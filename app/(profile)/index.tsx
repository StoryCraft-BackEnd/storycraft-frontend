/**
 * StoryCraft 프로필 선택 페이지
 * 자녀 프로필을 선택하거나 추가하는 화면입니다.
 */
import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { LoadingPopup } from '@/components/ui/LoadingPopup';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createProfileScreenStyles } from '@/styles/ProfileScreen.styles';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getProfiles, deleteProfile } from '@/features/profile/profileApi';
import { ChildProfile } from '@/features/profile/types';
import { loadImage } from '@/features/main/imageLoader';
import {
  saveProfiles,
  saveSelectedProfile,
  clearSelectedProfile,
} from '@/features/profile/profileStorage';
import { clearAllProfileData } from '@/features/storyCreate/storyStorage';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor('background');
  const isDark = backgroundColor === '#0d1b1e';
  const insets = useSafeAreaInsets();
  const [styles, setStyles] = useState(createProfileScreenStyles(isDark, insets));
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('프로필을 불러오는 중...');

  // 화면이 포커스될 때마다 프로필 목록을 새로고침
  useFocusEffect(
    React.useCallback(() => {
      loadProfiles();
    }, [])
  );

  // 화면 크기 변경 감지
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      // 화면 크기가 변경될 때마다 스타일 재계산
      setStyles(createProfileScreenStyles(isDark, insets));
    });

    return () => subscription.remove();
  }, [isDark, insets]);

  useEffect(() => {
    // 화면 방향을 가로 모드로 고정
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        // 화면 방향 변경 후 즉시 스타일 업데이트
        setStyles(createProfileScreenStyles(isDark, insets));
      } catch (error) {
        console.error('화면 방향 잠금 실패:', error);
        // 실패해도 스타일 업데이트
        setStyles(createProfileScreenStyles(isDark, insets));
      }
    };

    lockOrientation();
  }, [isDark, insets]);

  // 화면 크기 변경 감지 - 즉시 스타일 재계산
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      // 화면 크기가 변경될 때마다 즉시 스타일 재계산
      setStyles(createProfileScreenStyles(isDark, insets));
    });

    return () => subscription.remove();
  }, [isDark, insets]);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);

      // 서버에서 항상 최신 데이터를 불러옴
      const response = await getProfiles();

      // response.data가 null이거나 undefined인 경우 빈 배열로 설정
      const profilesData = response.data || [];
      setProfiles(profilesData);
      await saveProfiles(profilesData); // 로컬에 저장
      setError(null);
    } catch (err) {
      setError('프로필을 불러오는데 실패했습니다.');
      console.error('프로필 로드 실패:', err);
      // 에러 발생 시 빈 배열로 설정
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSelect = async (profileId: number) => {
    try {
      // 로딩 팝업 표시
      setIsProfileLoading(true);
      setLoadingMessage('프로필을 선택하는 중...');
      
      // 선택된 프로필 찾기 (profiles가 null일 수 있으므로 안전하게 처리)
      const selectedProfile = (profiles || []).find((profile) => profile.childId === profileId);
      if (selectedProfile) {
        // 선택된 프로필을 로컬 스토리지에 저장
        setLoadingMessage('프로필 정보를 저장하는 중...');
        await saveSelectedProfile(selectedProfile);
        console.log('선택된 프로필 저장:', selectedProfile.name);
      }

      setLoadingMessage('메인 화면으로 이동하는 중...');
      // 메인 화면으로 이동 (화면 방향은 이미 가로 모드로 고정되어 있음)
      router.replace('/(main)');
    } catch (error) {
      console.error('프로필 선택 실패:', error);
      setIsProfileLoading(false);
      // 오류가 발생해도 메인 화면으로 이동
      router.replace('/(main)');
    }
  };

  const handleAddProfile = () => {
    // 프로필 추가 화면으로 이동
    router.push('/(profile)/create');
  };

  const handleDeleteProfile = async (profileId: number) => {
    Alert.alert('프로필 삭제', '정말로 이 프로필을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProfile(profileId);
            // 프로필 목록을 다시 불러옴
            await loadProfiles();
            Alert.alert('알림', '프로필이 삭제되었습니다.');
          } catch (error) {
            Alert.alert('오류', '프로필 삭제에 실패했습니다.');
            console.error('프로필 삭제 실패:', error);
          }
        },
      },
    ]);
  };

  // 프로필 수정 버튼 클릭 시
  const handleEditProfile = (profile: ChildProfile) => {
    // 프로필 수정 화면으로 이동하면서 프로필 정보 전달
    router.push({
      pathname: '/(profile)/edit',
      params: { profile: JSON.stringify(profile) },
    });
  };

  // 로그아웃 버튼 클릭 시
  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 시작');

      // 화면 방향을 세로 모드로 변경
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      console.log('✅ 화면 방향 세로 모드로 변경 완료');

      // 모든 토큰과 인증 관련 데이터 삭제
      console.log('🧹 토큰 및 인증 데이터 삭제 시작');
      await AsyncStorage.multiRemove([
        'token',
        'refreshToken',
        'tokenIssuedAt',
        'profiles',
        'selectedProfile',
      ]);
      console.log('✅ 모든 토큰 및 인증 데이터 삭제 완료');

      // 선택된 프로필도 명시적으로 삭제
      await clearSelectedProfile();
      console.log('✅ 선택된 프로필 삭제 완료');

      // 모든 프로필 데이터 삭제 (즐겨찾기, 동화 목록 등)
      console.log('🧹 모든 프로필 데이터 삭제 시작');
      await clearAllProfileData();
      console.log('✅ 모든 프로필 데이터 삭제 완료');

      console.log('✅ 로그아웃 완료 - 로그인 화면으로 이동');

      // 네비게이션 스택을 완전히 초기화하고 로그인 화면으로 이동
      router.replace('/login');
    } catch (error) {
      console.error('❌ 로그아웃 중 오류 발생:', error);

      // 오류가 발생해도 토큰 삭제는 강제로 진행
      try {
        await AsyncStorage.multiRemove([
          'token',
          'refreshToken',
          'tokenIssuedAt',
          'profiles',
          'selectedProfile',
        ]);
        await clearSelectedProfile();
        await clearAllProfileData();
        console.log('✅ 오류 발생 후 강제 토큰 및 프로필 데이터 삭제 완료');
      } catch (cleanupError) {
        console.error('❌ 강제 토큰 및 프로필 데이터 삭제도 실패:', cleanupError);
      }

      // 화면 방향 변경에 실패하더라도 로그아웃은 진행
      router.replace('/login');
    }
  };

  // 프로필 이미지 로드 함수
  const getProfileImage = () => {
    // 모든 프로필에 기본 이미지 사용
    return loadImage('default_profile');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      
      {/* 프로필 선택 로딩 팝업 */}
      <LoadingPopup
        visible={isProfileLoading}
        title="프로필 선택"
        message={loadingMessage}
      />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText style={styles.headerTitle}>프로필 선택</ThemedText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>로그아웃</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ThemedText style={styles.loadingText}>프로필을 불러오는 중...</ThemedText>
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileList}
            nestedScrollEnabled={true}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.profileList}>
                {(profiles || []).map((profile) => (
                  <TouchableOpacity
                    key={profile.childId}
                    style={styles.profileCard}
                    onPress={() => handleProfileSelect(profile.childId)}
                  >
                    <Image source={getProfileImage()} style={styles.profileImage} />
                    <ThemedText style={styles.profileName}>{profile.name}</ThemedText>
                    <ThemedText style={styles.profileAge}>{profile.age}세</ThemedText>
                    <ThemedText style={styles.profileLevel}>
                      {profile.learningLevel || '미설정'}
                    </ThemedText>
                    <View style={styles.profileActions}>
                      <TouchableOpacity
                        onPress={() => handleEditProfile(profile)}
                        style={[styles.actionButton, styles.editButton]}
                      >
                        <ThemedText style={styles.actionButtonText}>수정</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteProfile(profile.childId)}
                        style={[styles.actionButton, styles.deleteButton]}
                      >
                        <ThemedText style={styles.actionButtonText}>삭제</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}

                {(profiles || []).length < 4 && (
                  <TouchableOpacity
                    style={[styles.profileCard, styles.addProfileCard]}
                    onPress={handleAddProfile}
                  >
                    <ThemedText style={styles.addProfileText}>+ 새 프로필 추가</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>
    </ThemedView>
  );
}

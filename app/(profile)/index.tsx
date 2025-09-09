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
import * as NavigationBar from 'expo-navigation-bar';
import { getProfiles, deleteProfile } from '@/features/profile/profileApi';
import { ChildProfile } from '@/features/profile/types';
import { loadImage } from '@/features/main/imageLoader';
import { getRandomAnimalImage, markImageAsUsed } from '@/shared/utils/profileImageUtils';
import {
  saveProfiles,
  saveSelectedProfile,
  clearSelectedProfile,
} from '@/features/profile/profileStorage';
import { clearAllProfileData } from '@/features/storyCreate/storyStorage';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLearningTimeTracking } from '@/shared/api';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor('background');
  const colorScheme = useColorScheme();
  const isDark = backgroundColor === '#0d1b1e';
  const insets = useSafeAreaInsets();

  // 화이트모드에서만 크림베이지 색상 적용
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF8F0' : backgroundColor;
  const [styles, setStyles] = useState(createProfileScreenStyles(isDark, insets));
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('프로필을 불러오는 중...');

  /**
   * 컴포넌트 마운트 시 시스템 UI 숨기기 함수
   */
  const hideSystemUIOnMount = async () => {
    try {
      console.log('🚀 프로필 선택 화면 마운트 시 시스템 UI 숨기기 시작');

      // 강화된 네비게이션 바 숨기기 (여러 번 시도)
      let navigationBarHidden = false;
      for (let i = 0; i < 3; i++) {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          navigationBarHidden = true;
          break;
        } catch (error) {
          console.log(`⚠️ 네비게이션 바 숨기기 시도 ${i + 1} 실패:`, error);
          await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
        }
      }

      if (!navigationBarHidden) {
        console.log('❌ 네비게이션 바 숨기기 최종 실패');
      }

      // 상태바 숨기기
      StatusBar.setHidden(true);

      // 전체 화면 모드 설정 (Immersive Mode)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      // 추가 지연 후 한 번 더 시도
      setTimeout(async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          console.log('✅ 지연 후 네비게이션 바 숨기기 재시도 완료');
        } catch (error) {
          console.log('❌ 지연 후 네비게이션 바 숨기기 실패:', error);
        }
      }, 500);
    } catch (error) {
      console.log('❌ 컴포넌트 마운트 시 시스템 UI 숨기기 실패:', error);
    }
  };

  /**
   * 포커스 시 시스템 UI 숨기기 함수
   */
  const hideSystemUI = async () => {
    try {
      // 강화된 네비게이션 바 숨기기 (여러 번 시도)
      let navigationBarHidden = false;
      for (let i = 0; i < 3; i++) {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          console.log(`✅ 포커스 시 네비게이션 바 숨기기 시도 ${i + 1} 완료`);
          navigationBarHidden = true;
          break;
        } catch (error) {
          console.log(`⚠️ 포커스 시 네비게이션 바 숨기기 시도 ${i + 1} 실패:`, error);
          await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
        }
      }

      if (!navigationBarHidden) {
        console.log('❌ 포커스 시 네비게이션 바 숨기기 최종 실패');
      }

      // 상태바 숨기기
      StatusBar.setHidden(true);

      // 전체 화면 모드 설정 (Immersive Mode)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      // 추가 지연 후 한 번 더 시도
      setTimeout(async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
          console.log('✅ 포커스 시 지연 후 네비게이션 바 숨기기 재시도 완료');
        } catch (error) {
          console.log('❌ 포커스 시 지연 후 네비게이션 바 숨기기 실패:', error);
        }
      }, 500);
    } catch (error) {
      console.log('❌ 포커스 시 시스템 UI 숨기기 실패:', error);
    }
  };

  /**
   * 시스템 UI 복원 함수
   */
  const restoreSystemUI = async () => {
    try {
      await NavigationBar.setVisibilityAsync('visible');
      StatusBar.setHidden(false);
      // 🚨 핵심: 화면 방향 잠금 해제하지 않음 - 메인 화면에서 가로 모드 유지
    } catch (error) {
      console.log('❌ 시스템 UI 복원 실패:', error);
    }
  };

  // ===== 실행 부분 =====
  // 컴포넌트 마운트 시 시스템 UI 숨기기
  React.useEffect(() => {
    hideSystemUIOnMount();
  }, []);

  // 화면이 포커스될 때마다 프로필 목록을 새로고침하고 시스템 UI 숨기기
  useFocusEffect(
    React.useCallback(() => {
      hideSystemUI();
      loadProfiles();

      // 화면이 포커스를 잃을 때 시스템 UI 복원 (화면 방향은 유지)
      return () => {
        restoreSystemUI();
      };
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

  /**
   * 프로필 목록을 로드하는 함수
   * 로컬 스토리지와 서버에서 프로필 데이터를 가져와 병합
   */
  const loadProfiles = async () => {
    try {
      setIsLoading(true);

      // 먼저 로컬 스토리지에서 프로필 정보 확인
      const localProfiles = await AsyncStorage.getItem('profiles');
      let profilesData: ChildProfile[] = [];

      if (localProfiles) {
        profilesData = JSON.parse(localProfiles);
        console.log('로컬에서 프로필 로드:', profilesData.length, '개');
      }

      // 서버에서 최신 데이터를 불러옴
      try {
        const response = await getProfiles();
        const serverProfiles = response.data || [];

        // 서버 데이터와 로컬 데이터를 병합
        profilesData = serverProfiles.map((serverProfile) => {
          const localProfile = profilesData.find(
            (local) => local.childId === serverProfile.childId
          );
          if (localProfile) {
            // 로컬에 이미지 정보가 있으면 유지, 없으면 랜덤 할당
            if (!localProfile.profileImage) {
              const randomImage = getRandomAnimalImage();
              markImageAsUsed(randomImage);
              return { ...serverProfile, profileImage: randomImage };
            }
            // 이미 이미지가 있는 경우 해당 이미지를 사용된 것으로 표시
            markImageAsUsed(localProfile.profileImage);
            return { ...serverProfile, profileImage: localProfile.profileImage };
          } else {
            // 새로운 프로필인 경우 랜덤 이미지 할당
            const randomImage = getRandomAnimalImage();
            markImageAsUsed(randomImage);
            return { ...serverProfile, profileImage: randomImage };
          }
        });

        console.log('서버에서 프로필 로드:', serverProfiles.length, '개');
      } catch (serverError) {
        console.log('서버에서 프로필 로드 실패, 로컬 데이터만 사용:', serverError);
        // 서버 로드 실패 시 로컬 데이터만 사용
        if (profilesData.length === 0) {
          throw new Error('프로필을 불러올 수 없습니다.');
        }
      }

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

  /**
   * 프로필 선택 핸들러
   * @param profileId 선택된 프로필의 ID
   */
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

      // 기존 학습시간 측정 중단
      await stopLearningTimeTracking();
      console.log('⏰ 기존 학습시간 측정 중단');

      // 메인 화면으로 이동 (화면 방향은 이미 가로 모드로 고정되어 있음)
      router.replace('/(main)');
    } catch (error) {
      console.error('프로필 선택 실패:', error);
      setIsProfileLoading(false);
      // 오류가 발생해도 메인 화면으로 이동
      router.replace('/(main)');
    }
  };

  /**
   * 프로필 추가 핸들러
   */
  const handleAddProfile = () => {
    // 프로필 추가 화면으로 이동
    router.push('/(profile)/create');
  };

  /**
   * 프로필 삭제 핸들러
   * @param profileId 삭제할 프로필의 ID
   */
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

            // 로컬 스토리지에서도 프로필 정보 삭제
            const existingProfiles = await AsyncStorage.getItem('profiles');
            if (existingProfiles) {
              let profiles = JSON.parse(existingProfiles);
              profiles = profiles.filter((profile: any) => profile.childId !== profileId);
              await AsyncStorage.setItem('profiles', JSON.stringify(profiles));
            }

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

  /**
   * 프로필 수정 핸들러
   * @param profile 수정할 프로필 정보
   */
  const handleEditProfile = (profile: ChildProfile) => {
    // 프로필 수정 화면으로 이동하면서 프로필 정보 전달
    router.push({
      pathname: '/(profile)/edit',
      params: { profile: JSON.stringify(profile) },
    });
  };

  /**
   * 로그아웃 핸들러
   * 모든 토큰과 프로필 데이터를 삭제하고 로그인 화면으로 이동
   */
  const handleLogout = async () => {
    console.log('🔘 로그아웃 버튼 클릭됨');
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

      // 학습시간 측정 중단
      await stopLearningTimeTracking();
      console.log('⏰ 학습시간 측정 중단');

      console.log('✅ 로그아웃 완료 - 로그인 화면으로 이동');

      // 네비게이션 스택을 완전히 초기화하고 로그인 화면으로 이동
      router.replace('/(auth)');
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
      router.replace('/(auth)');
    }
  };

  /**
   * 프로필 이미지 로드 함수
   * @param profile 프로필 정보
   * @returns 프로필 이미지 소스
   */
  const getProfileImage = (profile: ChildProfile) => {
    // 프로필에 설정된 이미지가 있으면 해당 이미지 사용, 없으면 기본 이미지 사용
    if (profile.profileImage) {
      return loadImage(profile.profileImage);
    }
    // 기본 이미지 사용
    return loadImage('default_profile');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: finalBackgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      {/* 프로필 선택 로딩 팝업 */}
      <LoadingPopup visible={isProfileLoading} title="프로필 선택" message={loadingMessage} />

      {/* 로그아웃 버튼 */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
        <ThemedText style={styles.logoutText}>로그아웃</ThemedText>
      </TouchableOpacity>

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
                    <Image source={getProfileImage(profile)} style={styles.profileImage} />
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

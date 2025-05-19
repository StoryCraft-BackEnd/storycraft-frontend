/**
 * StoryCraft 프로필 선택 페이지
 * 자녀 프로필을 선택하거나 추가하는 화면입니다.
 */
import React, { useEffect } from 'react';
import { TouchableOpacity, View, Image, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { router, Stack } from 'expo-router';
import { MainScreenStyles } from '@/styles/MainScreen';
import { createProfileScreenStyles } from '@/styles/ProfileScreen.styles';
import * as ScreenOrientation from 'expo-screen-orientation';

// 임시 프로필 데이터 (나중에 서버에서 가져올 예정)
const MOCK_PROFILES = [
  {
    id: 1,
    name: '민지',
    age: 7,
    image: 'https://via.placeholder.com/120',
  },
  {
    id: 2,
    name: '준호',
    age: 5,
    image: 'https://via.placeholder.com/120',
  },
  {
    id: 3,
    name: '소연',
    age: 8,
    image: 'https://via.placeholder.com/120',
  },
];

export default function ProfileScreen() {
  const ProfileScreenStyles = createProfileScreenStyles();

  useEffect(() => {
    // 화면을 가로 모드로 고정
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // 컴포넌트가 언마운트될 때 화면 방향 잠금 해제
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleProfileSelect = (profileId: number) => {
    // TODO: 선택된 프로필 정보를 전역 상태나 로컬 스토리지에 저장

    console.log('선택된 프로필 ID:', profileId);
    // 메인 화면으로 이동
    router.replace('/(main)');
  };

  const handleAddProfile = () => {
    // TODO: 프로필 추가 화면으로 이동

    console.log('프로필 추가');
  };

  // 로그아웃 버튼 클릭 시
  const handleLogout = () => {
    // TODO: 인증 토큰 삭제 등 로그아웃 처리

    console.log('로그아웃');
    router.replace('/login');
  };

  return (
    <ThemedView style={[MainScreenStyles.container, { paddingTop: 0 }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      {/* 헤더 */}
      <View style={ProfileScreenStyles.header}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText style={ProfileScreenStyles.headerTitle}>프로필 선택</ThemedText>
        </View>
        <TouchableOpacity onPress={handleLogout} style={ProfileScreenStyles.logoutButton}>
          <ThemedText style={ProfileScreenStyles.logoutText}>로그아웃</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={[ProfileScreenStyles.container, { paddingTop: 0 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={ProfileScreenStyles.profileList}
        >
          {MOCK_PROFILES.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={ProfileScreenStyles.profileCard}
              onPress={() => handleProfileSelect(profile.id)}
            >
              <Image source={{ uri: profile.image }} style={ProfileScreenStyles.profileImage} />
              <ThemedText style={ProfileScreenStyles.profileName}>{profile.name}</ThemedText>
              <ThemedText style={ProfileScreenStyles.profileAge}>{profile.age}세</ThemedText>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[ProfileScreenStyles.profileCard, ProfileScreenStyles.addProfileCard]}
            onPress={handleAddProfile}
          >
            <ThemedText style={ProfileScreenStyles.addProfileText}>+ 새 프로필 추가</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ThemedView>
  );
}

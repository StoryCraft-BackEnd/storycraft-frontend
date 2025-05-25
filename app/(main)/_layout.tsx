// app/(main)/_layout.tsx
// 메인 앱 스택 네비게이션 설정
// 로그인 후 접근하는 메인 앱 화면들의 스택

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

export default function MainLayout() {
  useEffect(() => {
    // 네비게이션 바 숨기기
    NavigationBar.setVisibilityAsync('hidden');

    return () => {
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    <Stack
      // 모든 스크린에 공통으로 적용될 설정
      screenOptions={{
        headerShown: false, // 헤더 숨김
        navigationBarHidden: true, // 네비게이션 바 숨김
        gestureEnabled: false, // 뒤로가기 제스처 비활성화
        animation: 'none', // 화면 전환 애니메이션 제거
        headerBackVisible: false, // 뒤로가기 버튼 숨김
        presentation: 'modal', // 모달 스타일로 표시
        animationDuration: 0, // 애니메이션 지속시간 0으로 설정
      }}
    >
      {/* 메인 화면 설정 */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // 헤더 숨김
          navigationBarHidden: true, // 네비게이션 바 숨김
          gestureEnabled: false, // 뒤로가기 제스처 비활성화
          animation: 'none', // 화면 전환 애니메이션 제거
          headerBackVisible: false, // 뒤로가기 버튼 숨김
          presentation: 'modal', // 모달 스타일로 표시
          animationDuration: 0, // 애니메이션 지속시간 0으로 설정
        }}
      />
    </Stack>
  );
}

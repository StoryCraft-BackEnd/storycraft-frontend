// app/(english-learning)/_layout.tsx
// 영어 학습 스택 네비게이션 설정
// 영어 학습 관련 화면들의 스택

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

export default function EnglishLearningLayout() {
  // ===== 함수 정의 부분 =====

  /**
   * 네비게이션 바 숨기기 함수
   */
  const hideNavigationBar = () => {
    NavigationBar.setVisibilityAsync('hidden');
  };

  /**
   * 네비게이션 바 복원 함수
   */
  const restoreNavigationBar = () => {
    NavigationBar.setVisibilityAsync('visible');
  };

  // ===== 실행 부분 =====

  useEffect(() => {
    hideNavigationBar();
    return restoreNavigationBar;
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
      {/* 영어 학습 메인 화면 설정 */}
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

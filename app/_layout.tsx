// app/_layout.tsx
// 앱의 최상위 레이아웃 컴포넌트
// 로그인 상태에 따라 인증 스택((auth)) 또는 메인 스택((main))을 렌더링

import { Stack } from 'expo-router';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startTokenRefreshManager, stopTokenRefreshManager } from '@/shared/api/authApi';

// 실제 레이아웃 로직을 처리하는 컴포넌트
function RootLayout() {
  // 로딩 상태 관리 (초기 토큰 확인 중)
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트(화면이 처음 렌더링 시) 시 초기화
  useEffect(() => {
    const initialize = async () => {
      try {
        // 초기화 작업 (필요시 토큰 확인 등)
        await AsyncStorage.getItem('token');

        // 토큰 갱신 매니저 시작
        await startTokenRefreshManager();
      } catch (error) {
        console.error('초기화 중 오류:', error);
      } finally {
        // 로딩 상태 해제
        setIsLoading(false);
      }
    };

    initialize();

    // 컴포넌트 언마운트 시 토큰 갱신 매니저 정리
    return () => {
      stopTokenRefreshManager();
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 로그인 상태에 따라 다른 스택 렌더링
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 모든 스크린을 항상 등록하되, 조건부로 표시 */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(english-learning)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
}

// ThemeProvider로 감싸진 최종 레이아웃 컴포넌트, 설정한 테마로 렌더링
export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}

// app/_layout.tsx
// 앱의 최상위 레이아웃 컴포넌트
// 로그인 상태에 따라 인증 스택((auth)) 또는 메인 스택((main))을 렌더링

import { Stack } from 'expo-router';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 실제 레이아웃 로직을 처리하는 컴포넌트
function RootLayout() {
  // 로딩 상태 관리 (초기 토큰 확인 중)
  const [isLoading, setIsLoading] = useState(true);
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트 마운트(화면이 처음 렌더링 시) 시 로그인 상태 확인
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // AsyncStorage에서 토큰 확인
        const token = await AsyncStorage.getItem('token');
        // 토큰 존재 여부로 로그인 상태 설정
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('로그인 상태 확인 중 오류:', error);
      } finally {
        // 로딩 상태 해제
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 로그인 상태에 따라 다른 스택 렌더링
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // 로그인된 경우 메인 스택 표시
        <Stack.Screen name="(main)" />
      ) : (
        // 로그인되지 않은 경우 인증 스택 표시
        <Stack.Screen name="(auth)" />
      )}
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

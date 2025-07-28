// app/_layout.tsx
// 앱의 최상위 레이아웃 컴포넌트
// 로그인 상태에 따라 인증 스택((auth)) 또는 메인 스택((main))을 렌더링

import { Stack } from 'expo-router';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startTokenRefreshManager, stopTokenRefreshManager } from '@/shared/api/authApi';
import { checkTermsAgreement, setCachedTermsAgreement } from '@/shared/utils/termsUtils';

// 실제 레이아웃 로직을 처리하는 컴포넌트
function RootLayout() {
  // 로딩 상태 관리 (초기 토큰 확인 중)
  const [isLoading, setIsLoading] = useState(true);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState<boolean | null>(null);

  // 컴포넌트 마운트(화면이 처음 렌더링 시) 시 초기화
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🔍 약관 동의 상태 확인 중...');

        // 약관 동의 상태를 먼저 확인
        const termsAgreed = await checkTermsAgreement();
        console.log('📋 약관 동의 상태:', termsAgreed);

        // 개발용: 강제로 약관 미동의 상태로 설정
        const forceTermsNotAgreed = false;
        console.log('🔧 개발용 강제 설정:', forceTermsNotAgreed);

        setHasAgreedToTerms(forceTermsNotAgreed);
        setCachedTermsAgreement(forceTermsNotAgreed);

        // 약관에 동의하지 않은 경우 다른 초기화 작업은 건너뛰고 바로 약관 동의 페이지로
        if (!forceTermsNotAgreed) {
          console.log('❌ 약관 미동의 - 약관 동의 페이지로 이동');
          setIsLoading(false);
          return;
        }

        console.log('✅ 약관 동의 완료 - 다른 초기화 작업 수행');
        // 약관에 동의한 경우에만 다른 초기화 작업 수행
        await AsyncStorage.getItem('token');

        // 토큰 갱신 매니저 시작
        await startTokenRefreshManager();
      } catch (error) {
        console.error('초기화 중 오류:', error);
        setHasAgreedToTerms(false);
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

  // 로딩 중이고 약관 동의 상태가 아직 확인되지 않은 경우에만 로딩 화면 표시
  if (isLoading && hasAgreedToTerms === null) {
    console.log('⏳ 초기 로딩 중...');
    return <LoadingScreen />;
  }

  // 약관 동의하지 않은 경우 약관 동의 화면으로 리다이렉트
  if (hasAgreedToTerms === false) {
    console.log('📄 약관 동의 페이지 렌더링');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // 약관 동의 완료 후 인증 화면으로 라우팅
  if (hasAgreedToTerms === true) {
    console.log('🔐 인증 화면 렌더링');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(english-learning)" />
        <Stack.Screen name="(profile)" />
      </Stack>
    );
  }

  // 약관 동의 상태가 아직 확인되지 않은 경우 (초기 로딩 중) 약관 동의 페이지 표시
  console.log('📄 기본 상태 - 약관 동의 페이지 렌더링');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="terms-agreement" />
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

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
//import { configureGoogleSignIn } from '@/shared/config/googleSignIn';
import { initializeLearningTimeTracker } from '@/shared/api';

import * as Linking from 'expo-linking';

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

        // 구글 로그인 초기화 (임시 비활성화)
        // configureGoogleSignIn();
        console.log('✅ 구글 로그인 초기화 완료');

        // 딥링크 처리 설정
        const handleDeepLink = (url: string) => {
          console.log('🔗 딥링크 수신:', url);
          // storycraft://redirect 스킴 처리
          if (url.startsWith('storycraft://redirect')) {
            console.log('✅ 구글 로그인 딥링크 처리');
          }
        };

        // 초기 딥링크 확인
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }

        // 딥링크 리스너 등록
        const subscription = Linking.addEventListener('url', (event) => {
          handleDeepLink(event.url);
        });

        // 약관 동의 상태를 먼저 확인
        const termsAgreed = await checkTermsAgreement();
        console.log('📋 약관 동의 상태:', termsAgreed);

        // 약관 동의 상태 설정
        setHasAgreedToTerms(termsAgreed);
        setCachedTermsAgreement(termsAgreed);

        // 약관에 동의하지 않은 경우 다른 초기화 작업은 건너뛰고 바로 약관 동의 페이지로
        if (!termsAgreed) {
          console.log('❌ 약관 미동의 - 약관 동의 페이지로 이동');
          console.log('🔍 setIsLoading(false) 호출');
          setIsLoading(false);
          console.log('🔍 return으로 함수 종료');
          return;
        }

        console.log('✅ 약관 동의 완료 - 다른 초기화 작업 수행');
        // 약관에 동의한 경우에만 다른 초기화 작업 수행
        await AsyncStorage.getItem('token');

        // 토큰 갱신 매니저 시작
        await startTokenRefreshManager();

        // 학습시간 추적기 초기화
        await initializeLearningTimeTracker();

        // 컴포넌트 언마운트 시 정리
        return () => {
          subscription?.remove();
          stopTokenRefreshManager();
        };
      } catch (error) {
        console.error('초기화 중 오류:', error);
        setHasAgreedToTerms(false);
      } finally {
        // 로딩 상태 해제
        setIsLoading(false);
      }
    };

    initialize();
  }, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

  // 로딩 중이고 약관 동의 상태가 아직 확인되지 않은 경우에만 로딩 화면 표시
  if (isLoading && hasAgreedToTerms === null) {
    console.log('⏳ 초기 로딩 중...');
    return <LoadingScreen />;
  }

  // 약관 동의하지 않은 경우 약관 동의 화면만 렌더링
  if (hasAgreedToTerms === false) {
    console.log('📄 약관 동의 페이지 렌더링');
    console.log('🔍 hasAgreedToTerms:', hasAgreedToTerms);
    console.log('🔍 isLoading:', isLoading);
    console.log('🔍 (terms-agreement) 그룹만 렌더링합니다');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(terms-agreement)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  // 약관 동의 완료 후 모든 그룹 포함하여 렌더링
  console.log('🔐 인증 및 메인 화면 렌더링 - hasAgreedToTerms:', hasAgreedToTerms);
  console.log('🔍 (auth), (main), (english-learning), (profile) 그룹을 렌더링합니다');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(terms-agreement)" />
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

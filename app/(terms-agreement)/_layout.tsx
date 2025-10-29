// app/(terms-agreement)/_layout.tsx
// 약관 동의 관련 스택 네비게이션 설정

import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function TermsAgreementLayout() {
  useEffect(() => {
    console.log('🔍 (terms-agreement)/_layout.tsx 마운트됨');
    console.log('🔍 약관 동의 레이아웃이 렌더링되었습니다');

    return () => {
      console.log('🔍 (terms-agreement)/_layout.tsx 언마운트됨');
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 헤더 숨김
      }}
    >
      {/* 약관 동의 화면 설정 */}
      <Stack.Screen
        name="index"
        options={{
          title: '약관 동의',
          headerShown: false, // 헤더 숨김
          headerBackVisible: false, // 뒤로가기 버튼 숨김
        }}
      />
    </Stack>
  );
}

// app/(auth)/_layout.tsx
// 인증 관련 스택 네비게이션 설정
// StoryCraft Dev 화면과 로그인 화면을 포함하는 스택

import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AuthLayout() {
  // 테마 색상 가져오기
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');

  return (
    <Stack
      // 모든 스크린에 공통으로 적용될 스타일 설정
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* 약관 동의 화면 설정 */}
      <Stack.Screen
        name="terms-agreement"
        options={{
          title: '약관 동의',
          headerShown: false, // 헤더 숨김
          headerBackVisible: false, // 뒤로가기 버튼 숨김
        }}
      />
      {/* StoryCraft Dev 화면 설정 */}
      <Stack.Screen
        name="index"
        options={{
          title: 'StoryCraft Dev',
          headerBackVisible: false, // 뒤로가기 버튼 숨김
        }}
      />
      {/* 로그인 화면 설정 */}
      <Stack.Screen
        name="login"
        options={{
          title: '로그인',
          headerShown: true, // 헤더 표시
          headerBackVisible: true, // 뒤로가기 버튼 표시
        }}
      />
    </Stack>
  );
}

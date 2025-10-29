/**
 * 마이페이지 레이아웃 컴포넌트
 * 마이페이지 관련 화면들의 스택 네비게이션을 설정하는 레이아웃입니다.
 * 헤더를 숨기고 각 화면에서 자체 헤더를 사용하도록 설정합니다.
 */

// Expo Router: 스택 네비게이터 컴포넌트
import { Stack } from 'expo-router';

/**
 * 마이페이지 레이아웃 컴포넌트
 * 마이페이지 하위 화면들의 네비게이션 스택을 구성합니다.
 */
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 헤더 숨김 (각 화면에서 자체 헤더 사용)
      }}
    />
  );
}

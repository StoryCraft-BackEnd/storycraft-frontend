// app/(auth)/_layout.tsx
// 인증 관련 스택 네비게이션 설정
// StoryCraft Dev 화면과 로그인 화면을 포함하는 스택

// React Native와 Expo Router에서 사용하는 컴포넌트들을 가져옵니다
// Stack: 화면 간의 계층적 네비게이션을 제공하는 컴포넌트
import { Stack } from 'expo-router';

// useThemeColor: 테마에 따른 색상을 반환하는 커스텀 훅
import { useThemeColor } from '@/hooks/useThemeColor';

// React 함수형 컴포넌트를 정의
// export default: 이 파일을 import할 때 기본으로 가져올 컴포넌트
// function AuthLayout(): 컴포넌트 이름
export default function AuthLayout() {
  // 이 값들은 앱의 테마 설정에 따라 동적으로 변경됩니다
  const backgroundColor = useThemeColor('background'); // useThemeColor('background'): 배경색을 반환
  const textColor = useThemeColor('text'); // useThemeColor('text'): 텍스트 색상을 반환

  // JSX를 반환합니다 (JavaScript XML)
  // React 컴포넌트는 항상 JSX를 반환해야 합니다
  return (
    // Stack 컴포넌트: 화면들을 쌓아서 네비게이션 스택을 만듭니다
    <Stack
      // screenOptions: 모든 Stack.Screen에 공통으로 적용될 옵션들
      // 객체 형태로 전달되며, 각 속성은 스크린의 스타일을 정의합니다
      screenOptions={{
        // headerStyle: 헤더의 스타일을 정의
        headerStyle: {
          backgroundColor: backgroundColor, // 헤더 배경색을 테마 색상으로 설정
        },
        // headerTintColor: 헤더의 텍스트와 아이콘 색상을 설정
        headerTintColor: textColor,
        // headerTitleStyle: 헤더 제목의 스타일을 정의
        headerTitleStyle: {
          fontWeight: 'bold', // 제목을 굵게 표시
        },
      }}
    >
      {/* Stack.Screen: 개별 화면을 정의합니다 */}
      {/* name: 화면의 고유 식별자 (파일 경로와 일치해야 함) */}
      {/* options: 해당 화면에만 적용되는 옵션들 */}

      {/* 로그인 화면 설정 (기본 화면) */}
      <Stack.Screen
        name="index" // app/(auth)/index.tsx 파일과 연결
        options={{
          title: '로그인', // 헤더에 표시될 제목
          headerShown: true, // 헤더를 표시할지 여부 (true/false)
          headerBackVisible: false, // 뒤로가기 버튼을 숨김 (기본 화면이므로)
        }}
      />

      {/* StoryCraft Dev 화면 설정 */}
      <Stack.Screen
        name="dev" // app/(auth)/dev.tsx 파일과 연결
        options={{
          title: 'StoryCraft Dev', // 헤더에 표시될 제목
          headerBackVisible: true, // 뒤로가기 버튼을 표시 (이전 화면으로 돌아갈 수 있음)
        }}
      />
    </Stack>
  );
}

// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useThemeColor } from '@/hooks/useThemeColor';

function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');

  // TODO: 추후 서버 연결 코드로 수정
  useEffect(() => {
    // 1초 후에 로딩 화면을 숨김
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
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
      <Stack.Screen
        name="index"
        options={{
          title: 'StoryCraft',
        }}
      />
      <Stack.Screen
        name="login/index"
        options={{
          title: '로그인',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}

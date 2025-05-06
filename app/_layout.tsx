// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider } from '../shared/contexts/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
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
    </ThemeProvider>
  );
}

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
      </Stack>
    </ThemeProvider>
  );
}

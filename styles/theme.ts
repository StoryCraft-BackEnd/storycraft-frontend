import { DefaultTheme, DarkTheme } from '@react-navigation/native';

// DefaultTheme 객체 전체를 복사해서 lightTheme에 넣고,
// 그 중 colors 속성만 덮어쓰기
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A90E2', // 파란색 (메인 버튼, 강조 색)
    background: '#FFFFFF', // 흰색 (기본 배경)
    card: '#F5F5F5', // 아주 연한 회색 (카드 배경)
    text: '#000000', // 검정 (기본 텍스트 색)
    border: '#E0E0E0', // 연한 회색 (선/구분선)
    notification: '#FF3B30', // 빨간색 (알림, 경고용)
    secondary: '#aaaaaa', // 중간 회색 (보조 텍스트)
    profileName: '#000000', // 프로필 이름용 검정색
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#4a90e2', // 파란색 (같은 색상, 소문자)
    background: '#0d1b1e', // 아주 짙은 남청색 (배경)
    card: '#ffffff', // 흰색 (카드는 강조되게 밝게)
    text: '#ffffff', // 흰색 (기본 텍스트)
    border: '#cccccc', // 밝은 회색 (구분선)
    notification: '#ff453a', // 밝은 빨간색 (iOS 알림 색 계열)
    secondary: '#aaaaaa', // 중간 회색 (보조 텍스트)
    profileName: '#000000', // 프로필 이름용 검정색
  },
};

export type ThemeColors = typeof lightTheme.colors;

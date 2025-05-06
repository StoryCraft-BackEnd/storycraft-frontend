/**
 * 테마 색상 커스텀 훅
 * 
 * 이 훅은 앱의 테마 시스템에서 색상을 가져오는 데 사용됩니다.
 * 시스템의 다크/라이트 모드에 따라 자동으로 적절한 색상을 반환합니다.
 * 
 * @see https://docs.expo.dev/guides/color-schemes/ Expo의 색상 스키마 가이드
 */

import { useTheme } from '../shared/contexts/ThemeContext';
import { lightTheme, darkTheme, ThemeColors } from '../styles/theme';

type ColorName = keyof ThemeColors;

/**
 * 현재 테마에 따라 색상을 반환하는 훅
 * 
 * @param colorName - 사용할 색상의 이름
 * @returns 현재 테마에 맞는 색상 값
 * 
 * @example
 * const textColor = useThemeColor('text');
 * const backgroundColor = useThemeColor('background');
 */
export function useThemeColor(colorName: ColorName) {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkTheme.colors[colorName] : lightTheme.colors[colorName];
}

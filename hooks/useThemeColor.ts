/**
 * 테마 색상 커스텀 훅
 * 
 * 이 훅은 앱의 테마 시스템에서 색상을 가져오는 데 사용됩니다.
 * 시스템의 다크/라이트 모드에 따라 자동으로 적절한 색상을 반환합니다.
 * 
 * @author StoryCraft Team
 * @version 1.0.0
 * 
 * @see https://docs.expo.dev/guides/color-schemes/ Expo의 색상 스키마 가이드
 */

import { useColorScheme } from 'react-native';
import { Colors, ColorName } from '../constants/Colors';

/**
 * 현재 테마에 맞는 색상을 반환하는 커스텀 훅
 * 
 * @param {ColorName} colorName - 가져올 색상의 이름 (예: 'text', 'background')
 * @returns {string} 현재 테마에 맞는 색상 값
 * 
 * @example
 * const textColor = useThemeColor('text');
 * const backgroundColor = useThemeColor('background');
 */
export function useThemeColor(colorName: ColorName) {
  // 현재 시스템의 색상 스키마 가져오기 (기본값: 'light')
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme][colorName];
}

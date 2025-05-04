/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';
import { Colors, ColorName } from '../constants/Colors';

export function useThemeColor(colorName: ColorName) {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme][colorName];
}

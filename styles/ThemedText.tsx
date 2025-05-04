import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ style, ...props }) => {
  const textColor = useThemeColor('text');

  return (
    <Text
      style={[styles.text, { color: textColor }, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
}); 
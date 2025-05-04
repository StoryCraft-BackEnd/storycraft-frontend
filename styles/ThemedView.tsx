import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ style, ...props }) => {
  const backgroundColor = useThemeColor('background');

  return (
    <View
      style={[styles.container, { backgroundColor }, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
}); 
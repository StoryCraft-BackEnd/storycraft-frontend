/**
 * 테마가 적용된 뷰 컴포넌트
 * 
 * 이 컴포넌트는 앱의 테마 시스템과 통합된 뷰 컴포넌트입니다.
 * 시스템의 다크/라이트 모드에 따라 자동으로 배경색이 변경되며,
 * 기본 View 컴포넌트의 모든 기능을 지원합니다.
 * 
 */
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * ThemedView 컴포넌트의 Props 인터페이스
 * 
 * @interface ThemedViewProps
 * @extends {ViewProps} React Native의 기본 View 컴포넌트 Props를 상속
 * @property {React.ReactNode} children - 뷰 컴포넌트의 자식 요소
 */
interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * 테마가 적용된 뷰를 렌더링하는 함수형 컴포넌트
 * 
 * @param {ThemedViewProps} props - 컴포넌트 props
 * @returns {JSX.Element} 테마가 적용된 뷰 컴포넌트
 */
export const ThemedView: React.FC<ThemedViewProps> = ({ style, ...props }) => {
  // 현재 테마에 맞는 배경색 가져오기
  const backgroundColor = useThemeColor('background');

  return (
    <View
      style={[styles.container, { backgroundColor }, style]}
      {...props}
    />
  );
};

// 기본 스타일 정의
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', // 흰색
  },
}); 
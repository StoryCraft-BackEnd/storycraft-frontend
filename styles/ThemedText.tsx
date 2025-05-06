/**
 * 테마가 적용된 텍스트 컴포넌트
 * 
 * 이 컴포넌트는 앱의 테마 시스템과 통합된 텍스트 컴포넌트입니다.
 * 시스템의 다크/라이트 모드에 따라 자동으로 색상이 변경되며,
 * 기본 Text 컴포넌트의 모든 기능을 지원합니다.
 * 
 */
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

/**
 * ThemedText 컴포넌트의 Props 인터페이스
 * 
 * @interface ThemedTextProps
 * @extends {TextProps} React Native의 기본 Text 컴포넌트 Props를 상속
 * @property {React.ReactNode} children - 텍스트 컴포넌트의 자식 요소
 */
interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
}

/**
 * 테마가 적용된 텍스트를 렌더링하는 함수형 컴포넌트
 * 
 * @param {ThemedTextProps} props - 컴포넌트 props
 * @returns {JSX.Element} 테마가 적용된 텍스트 컴포넌트
 */
export const ThemedText: React.FC<ThemedTextProps> = ({ style, ...props }) => {
  // 현재 테마에 맞는 텍스트 색상 가져오기
  const textColor = useThemeColor('text');

  return (
    <Text
      style={[styles.text, { color: textColor }, style]}
      {...props}
    />
  );
};

// 기본 스타일 정의
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
}); 
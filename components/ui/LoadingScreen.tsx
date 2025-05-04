/**
 * 로딩 화면 컴포넌트
 * 
 * 앱에서 비동기 작업이 진행 중일 때 표시되는 로딩 화면입니다.
 * ActivityIndicator를 사용하여 로딩 상태를 시각적으로 표현하고,
 * 사용자에게 현재 진행 중인 작업에 대한 메시지를 표시합니다.
 * 
 * @author StoryCraft Team
 * @version 1.0.0
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '../../styles/ThemedText';
import { ThemedView } from '../../styles/ThemedView';

/**
 * LoadingScreen 컴포넌트의 Props 인터페이스
 * 
 * @interface LoadingScreenProps
 * @property {string} [message] - 로딩 화면에 표시될 메시지 (기본값: '서버에 연결 중입니다...')
 */
interface LoadingScreenProps {
  message?: string;
}

/**
 * 로딩 화면을 렌더링하는 함수형 컴포넌트
 * 
 * @param {LoadingScreenProps} props - 컴포넌트 props
 * @returns {JSX.Element} 로딩 화면 컴포넌트
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = '서버에 연결 중입니다...' 
}) => {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <ThemedText style={styles.message}>{message}</ThemedText>
    </ThemedView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // 로딩 메시지 스타일
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
}); 
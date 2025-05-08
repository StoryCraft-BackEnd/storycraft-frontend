/**
 * LoadingScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const loadingScreenStyles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#666666',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

/**
 * NotFoundScreen 컴포넌트의 스타일 정의
 * 
 * 이 파일은 404 Not Found 화면의 모든 스타일을 정의합니다.
 * 사용자 경험을 고려한 레이아웃과 시각적 요소를 제공합니다.
 * 
 */
import { StyleSheet } from 'react-native';

export const notFoundScreenStyles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1,
  },
  // 내부 컨테이너 스타일
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // 에러 메시지 타이틀 스타일
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // 홈 화면 링크 컨테이너 스타일
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  // 홈 화면 링크 텍스트 스타일
  linkText: {
    color: '#0096FF',
    fontSize: 16,
  },
}); 
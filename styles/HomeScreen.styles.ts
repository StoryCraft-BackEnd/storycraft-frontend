/**
 * HomeScreen 컴포넌트의 스타일 정의
 *
 * 이 파일은 메인 홈 화면의 모든 스타일을 정의합니다.
 * 컴포넌트의 스타일을 분리하여 관리함으로써 코드의 가독성과 유지보수성을 향상시킵니다.
 *
 */
import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  // 전체 컨테이너 스타일
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2F4F5', // 밝은 회색
  },
  // 앱 타이틀 스타일
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // 서브타이틀 스타일
  subtitle: {
    fontSize: 16,
    color: '#555', // 중간 회색
    marginBottom: 20,
  },
  // 버튼 스타일
  button: {
    backgroundColor: '#0096FF', // 파란색
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  // 버튼 텍스트 스타일
  buttonText: {
    color: '#fff', // 흰색
    fontWeight: '600',
    fontSize: 16,
  },
});

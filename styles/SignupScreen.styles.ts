/**
 * SignupScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const signupScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: 24,
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    marginTop: 32,
  },

  // 회원가입 타이틀 텍스트
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },

  // 입력 필드와 중복확인 버튼을 가로로 배치하는 컨테이너
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  // 기본 입력 필드 (단독)
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    color: '#222',
    paddingVertical: 8,
  },

  // inputRow 안에서만 flex 적용
  inputRowInput: {
    flex: 1,
    borderBottomWidth: 1,
    color: '#222',
    paddingVertical: 8,
    marginRight: 8,
  },

  // 중복확인 버튼 스타일
  checkButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginLeft: 8,
  },

  // 역할 선택 버튼들을 가로로 배치하는 컨테이너
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },

  // 역할 선택 버튼 스타일
  roleButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 4,
  },

  // 회원가입 버튼
  signupButton: {
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  // 회원가입 버튼 내 텍스트
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // 로그인으로 돌아가기 링크 컨테이너
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  // 링크 텍스트
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },

  // 하단 안내 전체 컨테이너
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
});

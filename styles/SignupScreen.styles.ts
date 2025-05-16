/**
 * SignupScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const signupScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: 20,
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },

  // 회원가입 타이틀 텍스트
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 입력 필드와 중복확인 버튼을 가로로 배치하는 컨테이너
  inputRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },

  // 기본 입력 필드 (단독)
  input: {
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '100%',
    minHeight: 36,
    maxHeight: 40,
    fontSize: 14,
    marginBottom: 0,
  },

  // inputRow 안에서만 flex 적용
  inputRowInput: {
    flex: 1,
    borderRadius: 8,
  },

  // 중복확인 버튼 스타일
  checkButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // 역할 선택 버튼들을 가로로 배치하는 컨테이너
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  // 역할 선택 버튼 스타일
  roleButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },

  // 회원가입 버튼
  signupButton: {
    padding: 11,
    borderRadius: 8,
    marginTop: 10,
  },

  // 회원가입 버튼 내 텍스트
  signupButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // 로그인으로 돌아가기 링크 컨테이너
  linkContainer: {
    marginTop: 14,
    alignItems: 'center',
  },

  // 링크 텍스트
  linkText: {
    fontWeight: '500',
  },

  // 하단 안내 전체 컨테이너
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 14,
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },

  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
    marginLeft: 2,
    fontWeight: '500',
  },
});

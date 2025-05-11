/**
 * LoginScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const loginScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: 20,
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  // 로그인 타이틀 텍스트
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 이메일 및 비밀번호 입력 필드
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },

  // 로그인 버튼
  loginButton: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  // 로그인 버튼 내 텍스트
  loginButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 회원가입 / 비밀번호 찾기 링크 묶음
  linkContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // 링크 텍스트 (회원가입, 비번 찾기)
  linkText: {
    fontWeight: '500',
  },

  // 하단 소셜 로그인 및 안내 전체 컨테이너
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },

  // 소셜 로그인 버튼들을 가로로 나열하는 컨테이너
  socialButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  // Facebook / Google 버튼 스타일
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  //소셜 아이콘 스타일일
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },

  // 소셜 로그인 텍스트
  socialText: {
    fontWeight: 'bold',
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
});

/**
 * LoginScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const loginScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: 24,
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    marginTop: 32,
  },

  // 로그인 타이틀 텍스트
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },

  // 이메일 및 비밀번호 입력 필드
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    color: '#222',
    paddingVertical: 8,
  },

  // 로그인 버튼
  loginButton: {
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  // 로그인 버튼 내 텍스트
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // 회원가입 / 비밀번호 찾기 링크 묶음
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },

  // 링크 텍스트 (회원가입, 비번 찾기)
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },

  // 하단 소셜 로그인 및 안내 전체 컨테이너
  footerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },

  // 소셜 로그인 버튼들을 가로로 나열하는 컨테이너
  socialButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // Facebook / Google 버튼 스타일
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },

  //소셜 아이콘 스타일일
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  // 소셜 로그인 텍스트
  socialText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },

  // 헤더 뒤로가기 버튼 스타일
  headerBackButton: {
    marginLeft: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  // 헤더 뒤로가기 버튼 텍스트 스타일
  headerBackText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

/**
 * LoginScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const loginScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: wp('6%'), // 24px -> 6% of screen width
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    marginTop: hp('4%'), // 32px -> 4% of screen height
  },

  // 로그인 타이틀 텍스트
  title: {
    fontSize: wp('7%'), // 28px -> 7% of screen width
    fontWeight: 'bold',
    marginBottom: hp('4%'), // 32px -> 4% of screen height
    textAlign: 'center',
  },

  // 이메일 및 비밀번호 입력 필드
  input: {
    borderBottomWidth: 1,
    marginBottom: hp('2%'), // 16px -> 2% of screen height
    color: '#222',
    paddingVertical: hp('1%'), // 8px -> 1% of screen height
    flex: 1, // 입력 필드가 남은 공간을 모두 차지하도록
  },

  // 로그인 버튼
  loginButton: {
    borderRadius: wp('7.5%'), // 30px -> 7.5% of screen width
    padding: wp('4%'), // 16px -> 4% of screen width
    alignItems: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  // 로그인 버튼 내 텍스트
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'), // 16px -> 4% of screen width
  },

  // 회원가입 / 비밀번호 찾기 링크 묶음
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  // 링크 텍스트 (회원가입, 비번 찾기)
  linkText: {
    fontSize: wp('3.5%'), // 14px -> 3.5% of screen width
    fontWeight: 'bold',
    marginHorizontal: wp('2%'), // 8px -> 2% of screen width
  },

  // 하단 소셜 로그인 및 안내 전체 컨테이너
  footerContainer: {
    marginTop: hp('4%'), // 32px -> 4% of screen height
    alignItems: 'center',
  },

  // 소셜 로그인 버튼들을 가로로 나열하는 컨테이너
  socialButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp('2%'), // 16px -> 2% of screen height
  },

  // Facebook / Google 버튼 스타일
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp('5%'), // 20px -> 5% of screen width
    paddingHorizontal: wp('4%'), // 16px -> 4% of screen width
    paddingVertical: hp('1%'), // 8px -> 1% of screen height
    marginHorizontal: wp('2%'), // 8px -> 2% of screen width
  },

  //소셜 아이콘 스타일일
  socialIcon: {
    width: wp('6%'), // 24px -> 6% of screen width
    height: wp('6%'), // 24px -> 6% of screen width
    marginRight: wp('2%'), // 8px -> 2% of screen width
  },

  // 소셜 로그인 텍스트
  socialText: {
    fontSize: wp('4%'), // 16px -> 4% of screen width
    fontWeight: 'bold',
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    fontSize: wp('3%'), // 12px -> 3% of screen width
    textAlign: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  // 헤더 뒤로가기 버튼 스타일
  headerBackButton: {
    marginLeft: 0,
    paddingVertical: hp('1%'), // 8px -> 1% of screen height
    paddingHorizontal: wp('2%'), // 8px -> 2% of screen width
  },

  // 헤더 뒤로가기 버튼 텍스트 스타일
  headerBackText: {
    fontSize: wp('4.5%'), // 18px -> 4.5% of screen width
    fontWeight: '500',
  },

  // 입력 필드 컨테이너 (아이콘 + 입력 필드)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'), // 16px -> 2% of screen height
  },

  // 입력 필드 아이콘
  inputIcon: {
    marginRight: wp('2%'), // 8px -> 2% of screen width
  },

  // 북마크 아이콘 컨테이너
  bookmarkContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'), // 16px -> 2% of screen height
  },
});

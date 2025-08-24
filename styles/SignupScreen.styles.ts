/**
 * SignupScreen 컴포넌트의 스타일 정의
 */

import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const signupScreenStyles = StyleSheet.create({
  // 전체 화면을 감싸는 컨테이너
  container: {
    flex: 1,
    padding: wp('6%'), // 24px -> 6% of screen width
  },

  // 상단 입력 폼 및 버튼 묶음
  formContainer: {
    marginTop: hp('4%'), // 32px -> 4% of screen height
  },

  // 회원가입 타이틀 텍스트
  title: {
    fontSize: wp('7%'), // 28px -> 7% of screen width
    fontWeight: 'bold',
    marginBottom: hp('4%'), // 32px -> 4% of screen height
    textAlign: 'center',
  },

  // 입력 필드와 중복확인 버튼을 가로로 배치하는 컨테이너
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'), // 16px -> 2% of screen height
  },

  // 기본 입력 필드 (단독)
  input: {
    borderBottomWidth: 1,
    marginBottom: hp('2%'), // 16px -> 2% of screen height
    color: '#222',
    paddingVertical: hp('1%'), // 8px -> 1% of screen height
  },

  // inputRow 안에서만 flex 적용
  inputRowInput: {
    flex: 1,
    borderBottomWidth: 1,
    color: '#222',
    paddingVertical: hp('1%'), // 8px -> 1% of screen height
    marginRight: wp('2%'), // 8px -> 2% of screen width
  },

  // 중복확인 버튼 스타일
  checkButton: {
    borderRadius: wp('5%'), // 20px -> 5% of screen width
    paddingHorizontal: wp('4%'), // 16px -> 4% of screen width
    paddingVertical: hp('0.75%'), // 6px -> 0.75% of screen height
    marginLeft: wp('2%'), // 8px -> 2% of screen width
  },

  // 역할 선택 버튼들을 가로로 배치하는 컨테이너
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp('2%'), // 16px -> 2% of screen height
  },

  // 역할 선택 버튼 스타일
  roleButton: {
    flex: 1,
    alignItems: 'center',
    padding: wp('3%'), // 12px -> 3% of screen width
    borderWidth: 1,
    borderRadius: wp('5%'), // 20px -> 5% of screen width
    marginHorizontal: wp('1%'), // 4px -> 1% of screen width
  },

  // 회원가입 버튼
  signupButton: {
    borderRadius: wp('7.5%'), // 30px -> 7.5% of screen width
    padding: wp('4%'), // 16px -> 4% of screen width
    alignItems: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  // 회원가입 버튼 내 텍스트
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'), // 16px -> 4% of screen width
  },

  // 로그인으로 돌아가기 링크 컨테이너
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  // 링크 텍스트
  linkText: {
    fontSize: wp('3.5%'), // 14px -> 3.5% of screen width
    fontWeight: 'bold',
    marginHorizontal: wp('2%'), // 8px -> 2% of screen width
  },

  // 하단 안내 전체 컨테이너
  footerContainer: {
    marginTop: hp('4%'), // 32px -> 4% of screen height
    alignItems: 'center',
  },

  // 약관 및 개인정보처리방침 안내 텍스트
  notice: {
    fontSize: wp('3%'), // 12px -> 3% of screen width
    textAlign: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },

  label: {
    fontSize: wp('4%'), // 16px -> 4% of screen width
    fontWeight: 'bold',
    marginBottom: hp('1%'), // 8px -> 1% of screen height
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },
});

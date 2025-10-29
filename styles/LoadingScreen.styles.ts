/**
 * LoadingScreen 컴포넌트의 스타일 정의
 * 로딩 화면에서 사용되는 스타일들을 정의합니다.
 * react-native-responsive-screen을 사용하여 다양한 화면 크기에 대응합니다.
 */

import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const loadingScreenStyles = StyleSheet.create({
  // 전체 컨테이너 스타일 - 화면 전체를 차지하며 콘텐츠를 중앙에 배치
  container: {
    flex: 1, // 사용 가능한 모든 공간을 차지
    justifyContent: 'center', // 세로 방향 중앙 정렬
    alignItems: 'center', // 가로 방향 중앙 정렬
  },

  // 로딩 화면에 표시되는 이미지 스타일 (캐릭터 이미지 등)
  image: {
    width: wp('50%'), // 화면 너비의 50%를 이미지 너비로 사용 (기존 200px)
    height: wp('50%'), // 화면 너비의 50%를 이미지 높이로 사용 (기존 200px)
    marginBottom: hp('1%'), // 화면 높이의 1%를 하단 여백으로 사용 (기존 10px)
    resizeMode: 'contain', // 이미지 비율을 유지하면서 컨테이너에 맞춤
  },

  // 로딩 상태를 나타내는 메인 텍스트 스타일 (예: "로딩 중...")
  loadingText: {
    fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 사용 (기존 24px)
    fontWeight: 'bold', // 글자 두께를 굵게 설정
    marginBottom: hp('2.5%'), // 화면 높이의 2.5%를 하단 여백으로 사용 (기존 20px)
    color: '#666666', // 회색 계열의 텍스트 색상
  },

  // 추가 설명 메시지 스타일 (예: "잠시만 기다려주세요...")
  message: {
    fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용 (기존 16px)
    textAlign: 'center', // 텍스트를 가운데 정렬
    paddingHorizontal: wp('2.5%'), // 화면 너비의 2.5%를 좌우 패딩으로 사용 (기존 10px)
  },
});

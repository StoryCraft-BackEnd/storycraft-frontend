import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * Popup 스타일 정의
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 * 다크모드/라이트모드 테마 지원
 */
export const createPopupStyles = () => {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');

  // 테두리 색상을 배경색보다 약간 밝게 설정
  // const result = 조건식
  // ? 값1  // 조건이 참(true)일 때 사용
  // : 값2; // 조건이 거짓(false)일 때 사용
  const borderColorAdjusted =
    backgroundColor === '#000000' // 검정인지 확인
      ? 'rgba(255, 255, 255, 0.1)' // 다크모드: 반투명 흰색
      : 'rgba(0, 0, 0, 0.1)'; // 라이트모드: 반투명 검정색

  // 취소 버튼 테두리 색상
  const cancelButtonBorderColor =
    backgroundColor === '#000000'
      ? 'rgba(255, 255, 255, 0.2)' // 다크모드: 더 밝은 반투명 흰색
      : borderColorAdjusted; // 라이트모드: 반투명 검정색

  return StyleSheet.create({
    // 오버레이 - 전체 화면을 덮는 반투명 배경
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 검정색
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 팝업 컨테이너 - 메인 팝업 창
    container: {
      width: wp('80%'), // 화면 너비의 80%를 팝업 너비로 사용
      backgroundColor: backgroundColor,
      borderRadius: wp('3%'), // 화면 너비의 3%를 모서리 둥글기로 사용
      padding: wp('5%'), // 화면 너비의 5%를 패딩으로 사용
      elevation: 5,
      shadowColor: '#000', // 검정색
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 1,
      borderColor: borderColorAdjusted,
    },

    // 팝업 제목 - 굵은 글씨로 강조
    title: {
      fontSize: wp('5%'), // 화면 너비의 5%를 폰트 크기로 사용
      fontWeight: 'bold',
      color: textColor,
      marginBottom: hp('1.5%'), // 화면 높이의 1.5%를 하단 여백으로 사용
      textAlign: 'center',
    },

    // 팝업 메시지 - 설명 텍스트
    message: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      color: textColor,
      marginBottom: hp('2.5%'), // 화면 높이의 2.5%를 하단 여백으로 사용
      textAlign: 'center',
    },

    // 버튼 컨테이너 - 확인/취소 버튼을 가로로 배치
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp('1.5%'), // 화면 높이의 1.5%를 상단 여백으로 사용
    },

    // 기본 버튼 스타일 - 모든 버튼의 공통 스타일
    button: {
      flex: 1,
      padding: hp('1.5%'), // 화면 높이의 1.5%를 패딩으로 사용
      borderRadius: wp('2%'), // 화면 너비의 2%를 모서리 둥글기로 사용
      marginHorizontal: wp('1%'), // 화면 너비의 1%를 좌우 여백으로 사용
    },

    // 확인 버튼 - 주요 액션 버튼 (primary 색상)
    confirmButton: {
      backgroundColor: primaryColor,
    },

    // 취소 버튼 - 보조 액션 버튼 (투명 배경 + 테두리)
    cancelButton: {
      backgroundColor: 'transparent', // 투명
      borderWidth: 1,
      borderColor: cancelButtonBorderColor,
    },

    // 기본 버튼 텍스트 스타일 - 모든 버튼 텍스트의 공통 스타일
    buttonText: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      fontWeight: '600',
      textAlign: 'center',
    },

    // 확인 버튼 텍스트 - 흰색으로 강조
    confirmButtonText: {
      color: '#FFFFFF', // 흰색
    },

    // 취소 버튼 텍스트 - 테마 색상 사용
    cancelButtonText: {
      color: textColor,
    },
  });
};

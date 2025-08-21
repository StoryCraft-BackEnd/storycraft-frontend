import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { lightTheme, darkTheme } from '@/styles/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * 프로필 생성 화면의 스타일을 생성합니다.
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 다크모드/라이트모드 테마 기능 유지
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 * @returns 프로필 생성 화면의 스타일 객체
 */
export const createProfileCreateScreenStyles = () => {
  // 테마 색상 정의
  const backgroundColor = useThemeColor('background'); // 배경색

  // 다크모드/라이트모드에 따른 추가 색상
  const isDark = backgroundColor === '#0d1b1e'; // 다크모드 배경색 체크
  const theme = isDark ? darkTheme : lightTheme; // 현재 테마 설정

  return StyleSheet.create({
    // 전체 컨테이너 스타일 - 화면 전체를 차지하며 테마 배경색 적용
    container: {
      flex: 1,
      paddingTop: 0,
      backgroundColor,
    },

    // 상단 헤더 스타일 (제거됨)
    header: {
      display: 'none', // 헤더를 숨김
    },

    // 헤더 제목 - 화면 중앙에 표시되는 제목
    headerTitle: {
      fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 사용
      fontWeight: 'bold',
      color: theme.colors.text,
    },

    // 뒤로가기 버튼 - 배지 화면과 동일한 스타일
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      position: 'absolute',
      top: 34,
      left: 26,
      zIndex: 10,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
      borderRadius: 20,
    },

    // 스크롤 뷰 컨텐츠 컨테이너 스타일 - 메인 콘텐츠 영역
    contentContainer: {
      padding: wp('5%'), // 화면 너비의 5%를 패딩으로 사용
      alignItems: 'center',
    },

    // 입력 폼 컨테이너 스타일 - 카드 형태의 폼 영역
    formContainer: {
      width: '100%',
      maxWidth: wp('90%'), // 화면 너비의 90%를 최대 너비로 사용 (최대 400px 제한)
      backgroundColor: theme.colors.card,
      borderRadius: wp('5%'), // 화면 너비의 5%를 모서리 둥글기로 사용
      padding: wp('5%'), // 화면 너비의 5%를 패딩으로 사용
      marginTop: hp('2.5%'), // 화면 높이의 2.5%를 상단 여백으로 사용
      // 그림자 효과 - 다크모드에서 더 강한 그림자 적용
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.5 : 0.25, // 다크모드에서 더 강한 그림자
      shadowRadius: 3.84,
      elevation: 5,
    },

    // 입력 필드 컨테이너 스타일 - 각 입력 항목을 감싸는 컨테이너
    inputContainer: {
      marginBottom: hp('2.5%'), // 화면 높이의 2.5%를 하단 여백으로 사용
    },

    // 입력 라벨 - 각 입력 필드 위에 표시되는 설명 텍스트
    inputLabel: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      marginBottom: hp('1%'), // 화면 높이의 1%를 하단 여백으로 사용
      color: theme.colors.text,
    },

    // 입력 필드 - 사용자가 텍스트를 입력하는 영역
    input: {
      height: hp('6%'), // 화면 높이의 6%를 입력 필드 높이로 사용
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용
      paddingHorizontal: wp('4%'), // 화면 너비의 4%를 좌우 패딩으로 사용
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },

    // 학습 레벨 선택 버튼 컨테이너 - 가로로 배치된 버튼들
    levelContainer: {
      flexDirection: 'row',
      gap: wp('2.5%'), // 화면 너비의 2.5%를 버튼 간격으로 사용
    },

    // 학습 레벨 선택 버튼 - 기본 상태
    levelButton: {
      flex: 1,
      height: hp('5%'), // 화면 높이의 5%를 버튼 높이로 사용
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: wp('2%'), // 화면 너비의 2%를 모서리 둥글기로 사용
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },

    // 학습 레벨 선택 버튼 - 선택된 상태
    levelButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    // 학습 레벨 버튼 텍스트 - 기본 상태
    levelButtonText: {
      color: theme.colors.text,
    },

    // 학습 레벨 버튼 텍스트 - 선택된 상태
    levelButtonTextSelected: {
      color: '#FFFFFF',
    },

    // 제출 버튼 스타일 - 폼 하단의 메인 액션 버튼
    submitButton: {
      height: hp('6%'), // 화면 높이의 6%를 버튼 높이로 사용
      backgroundColor: theme.colors.primary,
      borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp('2.5%'), // 화면 높이의 2.5%를 상단 여백으로 사용
      // 그림자 효과 - 다크모드에서 더 강한 그림자 적용
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    // 제출 버튼 - 비활성화 상태 (투명도 적용)
    submitButtonDisabled: {
      opacity: 0.7,
    },

    // 제출 버튼 텍스트 - 흰색 굵은 글씨로 강조
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      fontWeight: 'bold',
    },
  });
};

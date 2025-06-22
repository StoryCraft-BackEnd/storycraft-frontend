import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { lightTheme, darkTheme } from '@/styles/theme';

/**
 * ProfileEditForm 스타일 정의
 * 프로필 수정 폼 화면 전용 스타일
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 이름, 나이, 학습 레벨만 수정 가능한 간단한 폼
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 */
export const createProfileEditFormStyles = (isDark: boolean, insets: { top: number }) => {
  const theme = isDark ? darkTheme : lightTheme;

  return StyleSheet.create({
    // 메인 컨테이너 - 전체 화면을 차지하며 테마 배경색 적용
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top, // 상단 안전 영역만큼 패딩 추가
    },

    // 헤더 영역 - 상단 네비게이션 바
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: hp('8%'), // 화면 높이의 8%를 헤더 높이로 사용
      paddingHorizontal: wp('5%'), // 화면 너비의 5%를 좌우 패딩으로 사용
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    // 헤더 제목 - 화면 중앙에 표시되는 제목
    headerTitle: {
      fontSize: wp('5%'), // 화면 너비의 5%를 폰트 크기로 사용
      fontWeight: 'bold',
      color: theme.colors.text,
    },

    // 뒤로가기 버튼 - 헤더 좌측에 위치
    backButton: {
      padding: wp('2%'), // 화면 너비의 2%를 패딩으로 사용
    },

    // 뒤로가기 버튼 텍스트 - 큰 폰트 크기로 터치하기 쉽게
    backButtonText: {
      fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 사용
      color: theme.colors.text,
    },

    // 메인 콘텐츠 영역 - 스크롤 가능한 영역
    content: {
      flex: 1,
      padding: wp('5%'), // 화면 너비의 5%를 패딩으로 사용
    },

    // 폼 컨테이너 - 입력 필드들을 감싸는 카드 형태의 영역
    formContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: wp('4%'), // 화면 너비의 4%를 모서리 둥글기로 사용
      padding: wp('6%'), // 화면 너비의 6%를 패딩으로 사용
      marginTop: hp('2%'), // 화면 높이의 2%를 상단 여백으로 사용
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

    // 입력 필드 컨테이너 - 각 입력 항목을 감싸는 컨테이너
    inputContainer: {
      marginBottom: hp('3%'), // 화면 높이의 3%를 하단 여백으로 사용
    },

    // 입력 라벨 - 각 입력 필드 위에 표시되는 설명 텍스트
    inputLabel: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      marginBottom: hp('1%'), // 화면 높이의 1%를 하단 여백으로 사용
      color: theme.colors.text,
      fontWeight: 'bold',
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
      gap: wp('2%'), // 화면 너비의 2%를 버튼 간격으로 사용
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
      fontSize: wp('3.5%'), // 화면 너비의 3.5%를 폰트 크기로 사용
    },

    // 학습 레벨 버튼 텍스트 - 선택된 상태
    levelButtonTextSelected: {
      color: '#FFFFFF',
      fontSize: wp('3.5%'), // 화면 너비의 3.5%를 폰트 크기로 사용
    },

    // 저장 버튼 - 폼 하단의 메인 액션 버튼
    submitButton: {
      height: hp('6%'), // 화면 높이의 6%를 버튼 높이로 사용
      backgroundColor: theme.colors.primary,
      borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp('4%'), // 화면 높이의 4%를 상단 여백으로 사용
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

    // 저장 버튼 - 비활성화 상태 (투명도 적용)
    submitButtonDisabled: {
      opacity: 0.7,
    },

    // 저장 버튼 텍스트 - 흰색 굵은 글씨로 강조
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      fontWeight: 'bold',
    },
  });
};

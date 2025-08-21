import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { lightTheme, darkTheme } from '@/styles/theme';

/**
 * ProfileScreen의 스타일을 생성하는 함수입니다.
 * 이 함수는 화면의 너비와 높이에 대한 백분율을 기반으로 동적인 스타일을 생성하여
 * 다양한 화면 크기에서 일관된 UI를 제공합니다.
 *
 * @param {boolean} isDark - 다크 모드 활성화 여부.
 * @param {object} insets - 화면의 안전 영역(Safe Area) 값. 상단 노치, 하단 바 등의 크기를 포함합니다.
 */
export const createProfileScreenStyles = (isDark: boolean, insets: { top: number }) => {
  const theme = isDark ? darkTheme : lightTheme;

  return StyleSheet.create({
    // --- 전체 화면 컨테이너 ---
    container: {
      flex: 1, // 사용 가능한 모든 공간을 채움
      backgroundColor: theme.colors.background, // 테마에 따른 배경색
      paddingTop: insets.top, // 상단 안전 영역(상태바, 노치)만큼 패딩을 추가하여 콘텐츠가 가려지지 않게 함
    },
    // --- 상단 헤더 영역 (제거됨) ---
    header: {
      display: 'none', // 헤더를 숨김
    },
    // --- 헤더 제목 텍스트 ---
    headerTitle: {
      fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 지정
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    // --- 메인 콘텐츠 영역 ---
    content: {
      flex: 1,
      padding: wp('5%'), // 화면 너비의 5%를 패딩으로 지정
    },
    // --- 프로필 카드들을 감싸는 리스트 컨테이너 ---
    profileList: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('4%'), // 카드 사이의 간격을 화면 너비의 4%로 지정
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('1%'),
      width: '100%',
      minHeight: '100%',
    },
    // --- 개별 프로필 카드 ---
    profileCard: {
      width: wp('40%'), // 너비를 화면 너비의 40%로 지정
      height: hp('32%'), // 높이를 화면 높이의 32%로 지정
      backgroundColor: theme.colors.card,
      borderRadius: wp('4%'), // 모서리 둥글기를 화면 너비에 비례하여 설정
      padding: wp('2%'),
      alignItems: 'center',
      justifyContent: 'space-between', // 위아래 공간을 균등하게 분배
      margin: wp('1%'),
      marginBottom: hp('2%'),
      // 그림자 효과
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    // --- 프로필 이미지 ---
    profileImage: {
      width: wp('28%'), // 프로필 이미지 너비
      height: wp('28%'), // 너비와 동일하게 하여 정사각형으로 만듦
      borderRadius: wp('14%'), // 너비/높이의 절반 값을 주어 원으로 만듦
      backgroundColor: theme.colors.background,
      marginTop: hp('2%'), // 이미지 위 여백 추가
      marginBottom: hp('1%'), // 이미지 아래 여백 조정
    },
    // --- 프로필 텍스트 (이름, 나이, 레벨) ---
    profileName: {
      fontSize: wp('4%'),
      fontWeight: 'bold',
      color: theme.colors.profileName,
      marginBottom: hp('0.5%'),
      textAlign: 'center',
    },
    profileAge: {
      fontSize: wp('3.5%'),
      color: theme.colors.secondary,
      marginBottom: hp('0.2%'),
      textAlign: 'center',
    },
    profileLevel: {
      fontSize: wp('3.2%'),
      color: theme.colors.secondary,
      marginBottom: hp('0.5%'),
      textAlign: 'center',
    },
    // --- 새 프로필 추가 카드 ---
    addProfileCard: {
      width: wp('40%'), // 프로필 카드와 동일한 크기
      height: hp('32%'),
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: wp('4%'),
      alignItems: 'center',
      justifyContent: 'center',
      margin: wp('1%'),
      padding: wp('2%'),
      backgroundColor: theme.colors.card,
    },
    addProfileText: {
      fontSize: wp('3.5%'),
      color: theme.colors.primary,
      textAlign: 'center',
    },
    // --- 로그아웃 버튼 ---
    logoutButton: {
      position: 'absolute',
      top: hp('2%'), // 상단에서 화면 높이의 2%만큼 떨어진 곳에 위치
      right: wp('5%'), // 오른쪽에서 화면 너비의 5%만큼 떨어진 곳에 위치
      backgroundColor: '#FF3B30', // 붉은색 배경
      paddingHorizontal: wp('3%'),
      paddingVertical: hp('1%'),
      borderRadius: wp('2%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000, // 다른 요소들 위에 표시되도록 zIndex 추가
      minWidth: wp('15%'), // 최소 너비 설정
      minHeight: hp('3%'), // 최소 높이 설정
    },
    logoutText: {
      color: '#FFFFFF', // 흰색 텍스트
      fontSize: wp('3.5%'),
      fontWeight: 'bold',
    },
    // --- 로딩 및 에러 텍스트 ---
    loadingText: {
      fontSize: wp('4.5%'),
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: hp('3%'),
    },
    errorText: {
      fontSize: wp('4.5%'),
      color: theme.colors.notification,
      textAlign: 'center',
      marginTop: hp('3%'),
    },
    // --- 프로필 카드 내 액션 버튼 ---
    profileActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginTop: hp('1%'),
      marginBottom: hp('2%'), // 하단 여백 추가
      paddingHorizontal: wp('1%'),
      gap: wp('2%'), // 버튼 사이의 간격을 화면 너비의 2%로 지정
    },
    actionButton: {
      paddingHorizontal: wp('2.5%'),
      paddingVertical: hp('0.8%'),
      borderRadius: wp('1%'),
      backgroundColor: theme.colors.notification,
      minWidth: wp('10%'),
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: wp('3%'),
    },
    deleteButton: {
      backgroundColor: theme.colors.notification,
    },
    editButton: {
      backgroundColor: theme.colors.primary, // 수정 버튼은 primary 색상 사용
    },
  });
};

import { StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width, height } = Dimensions.get('window');

export const createProfileScreenStyles = () => {
  // 테마 색상 정의
  const backgroundColor = useThemeColor('background'); // 배경색
  const primaryColor = useThemeColor('primary'); // 주요 강조 색상

  // 다크모드/라이트모드에 따른 추가 색상
  const isDark = backgroundColor === '#0d1b1e'; // 다크모드 배경색 체크
  const profileCardBg = isDark ? '#2C2C2E' : '#FFFFFF'; // 프로필 카드 배경
  const profileImageBg = isDark ? '#3A3A3C' : '#F0F0F0'; // 프로필 이미지 배경
  const profileNameColor = isDark ? '#FFFFFF' : '#333333'; // 프로필 이름 색상
  const profileAgeColor = isDark ? '#8E8E93' : '#666666'; // 프로필 나이 색상
  const addProfileBorder = isDark ? '#3A3A3C' : '#CCCCCC'; // 새 프로필 추가 테두리
  const addProfileText = isDark ? '#8E8E93' : '#666666'; // 새 프로필 추가 텍스트
  const headerTitleColor = isDark ? '#FFFFFF' : '#000000'; // 헤더 제목 색상

  return StyleSheet.create({
    // 전체 화면 컨테이너
    container: {
      flex: 1,
      backgroundColor,
    },
    // 상단 헤더 영역
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 80,
      paddingHorizontal: 20,
      backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: addProfileBorder,
    },
    // 헤더 제목 텍스트
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: headerTitleColor,
    },
    // 메인 콘텐츠 영역
    content: {
      flex: 1,
      padding: 20,
    },
    // 프로필 카드들을 감싸는 리스트 컨테이너
    profileList: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      paddingHorizontal: 20,
      height: height - 100, // 헤더 높이를 제외한 전체 높이
    },
    // 개별 프로필 카드
    profileCard: {
      width: width * 0.25, // 화면 너비의 25%
      height: height * 0.7, // 화면 높이의 70%
      backgroundColor: profileCardBg,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      // 그림자 효과
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.5 : 0.25, // 다크모드에서 더 강한 그림자
      shadowRadius: 3.84,
      elevation: 5,
    },
    // 프로필 이미지
    profileImage: {
      width: width * 0.2, // 화면 너비의 20%
      height: width * 0.2, // 정사각형 유지
      borderRadius: width * 0.1, // 원형 이미지
      backgroundColor: profileImageBg,
      marginBottom: 20,
    },
    // 프로필 이름 텍스트
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: profileNameColor,
      marginBottom: 10,
    },
    // 프로필 나이 텍스트
    profileAge: {
      fontSize: 18,
      color: profileAgeColor,
    },
    // 새 프로필 추가 카드
    addProfileCard: {
      width: width * 0.25, // 프로필 카드와 동일한 크기
      height: height * 0.7, // 프로필 카드와 동일한 크기
      borderWidth: 2,
      borderColor: addProfileBorder,
      borderStyle: 'dashed', // 점선 테두리
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // 새 프로필 추가 텍스트
    addProfileText: {
      fontSize: 20,
      color: addProfileText,
      marginTop: 10,
    },
    // 로그아웃 버튼
    logoutButton: {
      position: 'absolute',
      right: 20,
      padding: 10,
    },
    // 로그아웃 텍스트
    logoutText: {
      color: primaryColor,
      fontSize: 16,
    },
  });
};

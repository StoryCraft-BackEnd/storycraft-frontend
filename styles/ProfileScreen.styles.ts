import { StyleSheet, Dimensions } from 'react-native';
import { lightTheme, darkTheme } from '@/styles/theme';

const { width } = Dimensions.get('window');

export const createProfileScreenStyles = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme;

  return StyleSheet.create({
    // 전체 화면 컨테이너
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 40,
    },
    // 상단 헤더 영역
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    // 헤더 제목 텍스트
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    // 메인 콘텐츠 영역
    content: {
      flex: 1,
      padding: 20,
    },
    // 프로필 카드들을 감싸는 리스트 컨테이너
    profileList: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 15,
      paddingHorizontal: 15,
      paddingVertical: 10,
      width: '100%',
      minHeight: '100%',
    },
    // 개별 프로필 카드
    profileCard: {
      width: Math.min(width * 0.4, 250),
      height: Math.min(width * 0.56, 350),
      backgroundColor: theme.colors.card,
      borderRadius: 15,
      padding: 8,
      alignItems: 'center',
      justifyContent: 'flex-start',
      margin: 5,
      marginBottom: 20,
      // 그림자 효과
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    // 프로필 이미지
    profileImage: {
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: width * 0.075,
      backgroundColor: theme.colors.background,
      marginBottom: 15,
    },
    // 프로필 이름 텍스트
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.profileName,
      marginBottom: 3,
      textAlign: 'center',
    },
    // 프로필 나이 텍스트
    profileAge: {
      fontSize: 14,
      color: theme.colors.secondary,
      marginBottom: 2,
      textAlign: 'center',
    },
    // 프로필 레벨 텍스트
    profileLevel: {
      fontSize: 13,
      color: theme.colors.secondary,
      marginBottom: 3,
      textAlign: 'center',
    },
    // 새 프로필 추가 카드
    addProfileCard: {
      width: Math.min(width * 0.4, 250),
      height: Math.min(width * 0.56, 350),
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      padding: 8,
      backgroundColor: theme.colors.card,
    },
    // 새 프로필 추가 텍스트
    addProfileText: {
      fontSize: 14,
      color: theme.colors.primary,
      textAlign: 'center',
    },
    // 로그아웃 버튼
    logoutButton: {
      position: 'absolute',
      right: 20,
      padding: 10,
    },
    // 로그아웃 텍스트
    logoutText: {
      color: theme.colors.text,
      fontSize: 16,
    },
    // 로딩 텍스트
    loadingText: {
      fontSize: 18,
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: 20,
    },
    // 에러 텍스트
    errorText: {
      fontSize: 18,
      color: theme.colors.notification,
      textAlign: 'center',
      marginTop: 20,
    },
    // 프로필 액션 버튼 컨테이너
    profileActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginTop: 8,
      paddingHorizontal: 5,
    },
    // 액션 버튼
    actionButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: theme.colors.notification,
      minWidth: 40,
    },
    // 액션 버튼 텍스트
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
    },
    // 삭제 버튼
    deleteButton: {
      backgroundColor: theme.colors.notification,
    },
  });
};

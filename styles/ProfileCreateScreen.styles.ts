import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { lightTheme, darkTheme } from '@/styles/theme';

/**
 * 프로필 생성 화면의 스타일을 생성합니다.
 * @returns 프로필 생성 화면의 스타일 객체
 */
export const createProfileCreateScreenStyles = () => {
  // 테마 색상 정의
  const backgroundColor = useThemeColor('background'); // 배경색

  // 다크모드/라이트모드에 따른 추가 색상
  const isDark = backgroundColor === '#0d1b1e'; // 다크모드 배경색 체크
  const theme = isDark ? darkTheme : lightTheme; // 현재 테마 설정

  return StyleSheet.create({
    // 전체 컨테이너 스타일
    container: {
      flex: 1,
      paddingTop: 0,
      backgroundColor,
    },

    // 상단 헤더 스타일
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 80,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    backButton: {
      fontSize: 16,
      color: theme.colors.text,
    },

    // 스크롤 뷰 컨텐츠 컨테이너 스타일
    contentContainer: {
      padding: 20,
      alignItems: 'center',
    },

    // 입력 폼 컨테이너 스타일
    formContainer: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 20,
      marginTop: 20,
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

    // 입력 필드 컨테이너 스타일
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.colors.text,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },

    // 학습 레벨 선택 버튼 스타일
    levelContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    levelButton: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    levelButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    levelButtonText: {
      color: theme.colors.text,
    },
    levelButtonTextSelected: {
      color: '#FFFFFF',
    },

    // 제출 버튼 스타일
    submitButton: {
      height: 50,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
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
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

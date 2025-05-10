import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

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
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 검정색
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '80%',
      backgroundColor: backgroundColor,
      borderRadius: 12,
      padding: 20,
      elevation: 5,
      shadowColor: '#000', // 검정색
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 1,
      borderColor: borderColorAdjusted,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 10,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: textColor,
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    confirmButton: {
      backgroundColor: primaryColor,
    },
    cancelButton: {
      backgroundColor: 'transparent', // 투명
      borderWidth: 1,
      borderColor: cancelButtonBorderColor,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF', // 흰색
    },
    cancelButtonText: {
      color: textColor,
    },
  });
};

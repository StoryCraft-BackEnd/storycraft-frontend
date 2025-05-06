import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export const createPopupStyles = () => {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const cardColor = useThemeColor("card");
  const borderColor = useThemeColor("border");
  const primaryColor = useThemeColor("primary");

  // 테두리 색상을 배경색보다 약간 밝게 설정
  const borderColorAdjusted = backgroundColor === '#000000' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';

  // 취소 버튼 테두리 색상
  const cancelButtonBorderColor = backgroundColor === '#000000'
    ? 'rgba(255, 255, 255, 0.2)'
    : borderColorAdjusted;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '80%',
      backgroundColor: backgroundColor,
      borderRadius: 12,
      padding: 20,
      elevation: 5,
      shadowColor: '#000',
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
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: cancelButtonBorderColor,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
    },
    cancelButtonText: {
      color: textColor,
    },
  });
};
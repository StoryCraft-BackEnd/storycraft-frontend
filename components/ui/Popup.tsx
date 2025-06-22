import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { createPopupStyles } from '@/styles/Popup.styles';

// props로 들어오는 데이터의 타입을 명확히 하여 컴파일 타임 에러 방지
// ?는 선택적(optional) 프로퍼티
interface PopupProps {
  visible: boolean; // 팝업 표시 여부
  onClose: () => void; // 닫기 함수
  title: string; // 제목 텍스트
  message: string; // 메시지 본문
  confirmText?: string; // 확인 버튼 텍스트 (선택적)
  cancelText?: string; // 취소 버튼 텍스트 (선택적)
  onConfirm?: () => void; // 확인 눌렀을 때 콜백 (선택적)
  onCancel?: () => void; // 취소 눌렀을 때 콜백 (선택적)
}

// export는 이 컴포넌트를 다른 파일에서도 사용할 수 있도록 외부로 내보냄
// 괄호안에 작성해야 외부에서 아래처럼 사용 가능
// (props) => {
//     props.visible;
//     props.onClose;
//   }
export const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  const styles = createPopupStyles();

  // 확인 버튼 클릭 시 실행
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // 전달받은 콜백 실행
    }
    onClose(); // 팝업 닫기
  };

  // 취소 버튼 클릭 시 실행
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent // 배경 투명하게 설정
      animationType="fade" // 애니메이션 타입 설정
      onRequestClose={onClose} // 닫기 버튼 클릭 시 실행
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
          <View style={styles.buttonContainer}>
            {/* 취소 버튼은 onCancel이 제공될 때만 표시 */}
            {onCancel && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <ThemedText style={[styles.buttonText, styles.cancelButtonText]}>
                  {cancelText}
                </ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                // 취소 버튼이 없으면 확인 버튼이 전체 너비를 차지
                !onCancel && { flex: 1, marginHorizontal: 0 },
              ]}
              onPress={handleConfirm}
            >
              <ThemedText style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

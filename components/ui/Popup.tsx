import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedText } from '@/styles/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { popupStyles as styles } from '@/styles/Popup.styles';

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

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
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const cardColor = useThemeColor("card");

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.container, { backgroundColor: cardColor }]}>
          <ThemedText style={[styles.title, { color: textColor }]}>
            {title}
          </ThemedText>
          
          <ThemedText style={[styles.message, { color: textColor }]}>
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <ThemedText style={styles.buttonText}>{cancelText}</ThemedText>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: primaryColor }]}
              onPress={handleConfirm}
            >
              <ThemedText style={styles.buttonText}>{confirmText}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}; 
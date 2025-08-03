import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export const LoadingPopup: React.FC<LoadingPopupProps> = ({
  visible,
  title = '동화를 생성중입니다',
  message = '잠시만 기다려주세요',
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 5) {
          return '';
        }
        return prevDots + '.';
      });
    }, 2000); // 2초마다 점 추가

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              {/* 로딩 스피너 */}
              <ActivityIndicator size="large" color="#fff" style={styles.spinner} />

              {/* 제목 */}
              <Text style={styles.title}>
                {title}
                <Text style={styles.dots}>{dots}</Text>
              </Text>

              {/* 메시지 */}
              <Text style={styles.message}>{message}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    maxWidth: 300,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  dots: {
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
});

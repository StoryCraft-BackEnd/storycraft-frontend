import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingPopupProps {
  visible: boolean;
  title?: string;
  message?: string;
  currentStep?: number;
  totalSteps?: number;
  stepMessages?: string[];
}

const { width, height } = Dimensions.get('window');

export const LoadingPopup: React.FC<LoadingPopupProps> = ({
  visible,
  title = '동화를 생성중입니다',
  message = '잠시만 기다려주세요',
  currentStep = 1,
  totalSteps = 3,
  stepMessages = ['동화 생성 중...', '삽화 생성 중...', '음성 생성 중...'],
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

  const progressPercentage = (currentStep / totalSteps) * 100;
  const currentStepMessage = stepMessages[currentStep - 1] || '처리 중...';

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

              {/* 진행 단계 표시 */}
              {totalSteps > 1 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepText}>
                    {currentStep} / {totalSteps}
                  </Text>
                  <Text style={styles.stepMessage}>{currentStepMessage}</Text>

                  {/* 진행 바 */}
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                    </View>
                  </View>
                </View>
              )}
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
    marginBottom: 15,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  stepMessage: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
});

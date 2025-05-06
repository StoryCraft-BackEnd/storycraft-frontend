/**
 * 로딩 화면 컴포넌트
 * 
 * 앱에서 비동기 작업이 진행 중일 때 표시되는 로딩 화면입니다.
 * ActivityIndicator를 사용하여 로딩 상태를 시각적으로 표현하고,
 * 사용자에게 현재 진행 중인 작업에 대한 메시지를 표시합니다.
 * 
 */
import React, { useEffect, useState } from 'react';
import { View, Image, Animated } from 'react-native';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedText } from '@/styles/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadingScreenStyles as styles } from '@/styles/LoadingScreen.styles';

/**
 * LoadingScreen 컴포넌트의 Props 인터페이스
 * 
 * @interface LoadingScreenProps
 * @property {string} [message] - 로딩 화면에 표시될 메시지 (기본값: '잠시만 기다려주세요...')
 */
interface LoadingScreenProps {
  message?: string;
}

/**
 * 로딩 화면을 렌더링하는 함수형 컴포넌트
 * 
 * @param {LoadingScreenProps} props - 컴포넌트 props
 * @returns {JSX.Element} 로딩 화면 컴포넌트
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "잠시만 기다려주세요..." }) => {
  const [loadingText, setLoadingText] = useState("LOADING");
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setLoadingText("LOADING" + ".".repeat(dots));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <Image
        source={require('@/assets/character/sleep.png')}
        style={styles.characterImage}
        resizeMode="contain"
      />
      
      <ThemedText style={styles.loadingText}>
        {loadingText}
      </ThemedText>

      <ThemedText style={[styles.message, { color: textColor }]}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}; 
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
 * Props (Properties)는 외부에서 전달되는 데이터
 * @interface LoadingScreenProps
 * 인터페이스의 속성(prop)을 설명할 때 property 사용
 * @property {string} [message] - 로딩 화면에 표시될 메시지 (기본값: '잠시만 기다려주세요...')
 */

// message라는 prop 하나를 받음
interface LoadingScreenProps {
  message?: string;
}

/**
 * 로딩 화면을 렌더링하는 함수형 컴포넌트
 * 함수에 전달되는 인자(parameter)를 설명할 때 사용
 * @param {LoadingScreenProps} props - 컴포넌트 props
 * 함수의 **반환값(return value)**을 설명할 때 사용
 * @returns {JSX.Element} 로딩 화면 컴포넌트 
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "잠시만 기다려주세요..." }) => {
  const [loadingText, setLoadingText] = useState("LOADING"); // 로딩 텍스트 첫 상태 지정("LOADING")
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  // 컴포넌트가 렌더링될 때마다 어떤 동작을 수행하게 하는 훅
  // 로딩 텍스트 애니메이션 효과 적용
  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => { // 0.5초 마다 실행
      dots = (dots + 1) % 4; // 점 개수 증가
      setLoadingText("LOADING" + ".".repeat(dots)); // 로딩 텍스트 업데이트
    }, 500);

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* 캐릭터 이미지 표시 */}
      <Image
        source={require('@/assets/character/sleep.png')}
        style={styles.characterImage}
        resizeMode="contain" // 이미지 크기 조정, contain: 이미지 비율 유지
      />
      {/* 로딩 텍스트 표시 */}
      <ThemedText style={styles.loadingText}>
        {loadingText}
      </ThemedText>
      {/* 메시지 표시 */}
      <ThemedText style={[styles.message, { color: textColor }]}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}; 
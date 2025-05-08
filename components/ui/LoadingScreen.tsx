/**
 * 로딩 화면 컴포넌트
 *
 * 애플리케이션의 로딩 상태를 표시하는 화면입니다.
 * 메시지와 이미지를 커스터마이징할 수 있습니다.
 *
 */
import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadingScreenStyles as styles } from '@/styles/LoadingScreen.styles';

/**
 * LoadingScreen 컴포넌트의 Props 인터페이스
 * Props (Properties)는 외부에서 전달되는 데이터
 * @interface LoadingScreenProps
 * 인터페이스의 속성(prop)을 설명할 때 property 사용
 * @property {string} [message] - 로딩 화면에 표시될 메시지 (기본값: '잠시만 기다려주세요...')
 * @property {ImageSourcePropType} [image] - 로딩 화면에 표시될 이미지
 */

// message, image 두개의 prop 받음
interface LoadingScreenProps {
  message?: string;
  image?: ImageSourcePropType;
}

/**
 * 로딩 화면을 렌더링하는 함수형 컴포넌트
 * 함수에 전달되는 인자(parameter)를 설명할 때 사용
 * @param {LoadingScreenProps} props - 컴포넌트 props
 * 함수의 **반환값(return value)**을 설명할 때 사용
 * @returns {JSX.Element} 로딩 화면 컴포넌트
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = '잠시만 기다려주세요...',
  image,
}) => {
  const [loadingText, setLoadingText] = useState('LOADING');
  const backgroundColor = useThemeColor('background');

  // 컴포넌트가 렌더링될 때마다 어떤 동작을 수행하게 하는 훅
  // 로딩 텍스트 애니메이션 효과 적용
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === 'LOADING...') return 'LOADING';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* 캐릭터 이미지 표시 */}
      {image && <Image source={image} style={styles.image} />}
      {/* 로딩 텍스트 표시 */}
      <ThemedText style={styles.loadingText}>{loadingText}</ThemedText>
      {/* 메시지 표시 */}
      <ThemedText style={styles.message}>{message}</ThemedText>
    </ThemedView>
  );
};

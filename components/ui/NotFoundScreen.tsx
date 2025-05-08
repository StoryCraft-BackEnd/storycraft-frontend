/**
 * 404 Not Found 화면 컴포넌트
 *
 * 존재하지 않는 경로로 접근했을 때 표시되는 화면입니다.
 * 사용자에게 친절한 에러 메시지와 홈 화면으로 돌아갈 수 있는 링크를 제공합니다.
 *
 */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { notFoundScreenStyles as styles } from '@/styles/NotFoundScreen.styles';

interface NotFoundScreenProps {
  onBackToHome?: () => void;
}

export function NotFoundScreen({ onBackToHome }: NotFoundScreenProps) {
  /**
   * 화면 터치 이벤트 핸들러
   * 사용자가 화면을 터치할 때마다 로그를 출력합니다.
   *
   * @function handleScreenPress
   */
  const handleScreenPress = () => {
    console.log('사용자가 404 화면을 터치했습니다!');
    console.log('터치 시간:', new Date().toLocaleString());
  };

  /**
   * 홈 화면 링크 클릭 이벤트 핸들러
   * 사용자가 홈 화면으로 이동하려고 할 때 로그를 출력합니다.
   *
   * @function handleLinkPress
   */
  const handleLinkPress = () => {
    console.log('사용자가 홈 화면으로 이동중입니다.');
    if (onBackToHome) {
      onBackToHome();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleScreenPress} activeOpacity={0.7}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText style={styles.title}>This screen doesn't exist.</ThemedText>
        <TouchableOpacity style={styles.link} onPress={handleLinkPress}>
          <ThemedText style={styles.linkText}>Go to home screen!</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );
}

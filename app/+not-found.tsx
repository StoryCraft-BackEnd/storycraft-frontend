/**
 * 404 Not Found 화면 컴포넌트
 * 
 * 존재하지 않는 경로로 접근했을 때 표시되는 화면입니다.
 * 사용자에게 친절한 에러 메시지와 홈 화면으로 돌아갈 수 있는 링크를 제공합니다.
 * 
 * @author StoryCraft Team
 * @version 1.0.0
 */
import React from 'react';
import { Link, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '../styles/ThemedText';
import { ThemedView } from '../styles/ThemedView';
import { notFoundScreenStyles as styles } from '../styles/NotFoundScreen.styles';

export default function NotFoundScreen() {
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
    console.log('사용자가 홈 화면으로 이동하려고 합니다!');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <TouchableOpacity 
        style={styles.container} 
        onPress={handleScreenPress}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.innerContainer}>
          <ThemedText style={styles.title}>This screen doesn't exist.</ThemedText>
          <Link href="/" style={styles.link} onPress={handleLinkPress}>
            <ThemedText style={styles.linkText}>Go to home screen!</ThemedText>
          </Link>
        </ThemedView>
      </TouchableOpacity>
    </>
  );
}

import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function SubscriptionScreen() {
  return (
    <ImageBackground
      source={require('../../../../assets/images/background/night-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* 구독/결제 UI 구현 */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
});

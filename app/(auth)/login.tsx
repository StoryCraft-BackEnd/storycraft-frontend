// app/(auth)/login.tsx
// 로그인 화면 컴포넌트
// 사용자 인증을 처리하고 메인 앱으로 이동하는 화면

import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Alert, View, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { loginScreenStyles as styles } from '@/styles/LoginScreen.styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import facebookIcon from '@/assets/images/facebook.png';
import googleIcon from '@/assets/images/google.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  // 입력 필드 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 테마 색상 가져오기
  const placeholderColor = useThemeColor('secondary');
  const dividerColor = useThemeColor('text');
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');

  // 로그인 버튼 클릭 시 실행
  const handleLogin = async () => {
    // 테스트용 계정 확인
    if (email === 'test@example.com' && password === '1234') {
      try {
        // 토큰 저장
        await AsyncStorage.setItem('token', 'mock-token');
        // 메인 앱으로 이동
        router.replace('/(main)');
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        Alert.alert('오류', '로그인 처리 중 문제가 발생했습니다.');
      }
    } else {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* 입력 및 로그인 영역 */}
      <View style={styles.formContainer}>
        <ThemedText style={[styles.title, { color: textColor }]}>로그인</ThemedText>

        {/* 이메일 입력 필드 */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cardColor,
              borderColor,
              color: textColor,
            },
          ]}
          placeholder="이메일"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* 비밀번호 입력 필드 */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cardColor,
              borderColor,
              color: textColor,
            },
          ]}
          placeholder="비밀번호"
          placeholderTextColor={placeholderColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: primaryColor }]}
          onPress={handleLogin}
        >
          <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>로그인</ThemedText>
        </TouchableOpacity>

        {/* 회원가입 및 비밀번호 찾기 링크 */}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => Alert.alert('회원가입 버튼 눌림')}>
            <ThemedText style={[styles.linkText, { color: primaryColor }]}>회원가입</ThemedText>
          </TouchableOpacity>
          <ThemedText style={{ color: dividerColor }}> | </ThemedText>
          <TouchableOpacity onPress={() => Alert.alert('비밀번호 찾기 버튼 눌림')}>
            <ThemedText style={[styles.linkText, { color: primaryColor }]}>
              비밀번호 찾기
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* 소셜 로그인 영역 */}
      <View style={styles.footerContainer}>
        <View style={styles.socialButtonRow}>
          {/* Facebook 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]}
            onPress={() => Alert.alert('페이스북 로그인 눌림')}
          >
            <Image source={facebookIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Facebook</ThemedText>
          </TouchableOpacity>

          {/* Google 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]}
            onPress={() => Alert.alert('구글 로그인 눌림')}
          >
            <Image source={googleIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Google</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 이용약관 안내 텍스트 */}
        <ThemedText style={[styles.notice, { color: placeholderColor }]}>
          StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{'\n'}
          개인정보처리방침에 동의하게 됩니다.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

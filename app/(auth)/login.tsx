// app/(auth)/login.tsx
// 로그인 화면 컴포넌트
// 사용자 인증을 처리하고 메인 앱으로 이동하는 화면

import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { router, useFocusEffect, Stack } from 'expo-router';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import { loginScreenStyles as styles } from '../../styles/LoginScreen.styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import facebookIcon from '../../assets/images/facebook.png';
import googleIcon from '../../assets/images/google.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@/features/auth/authApi';

export default function LoginScreen() {
  //입력 필드 상태 관리
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

  // 뒤로가기 버튼 처리 - 로그인 화면에서 뒤로가기 시 StoryCraft Dev 화면으로 이동
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 로그인 화면에서 뒤로가기 버튼을 누르면 StoryCraft Dev 화면으로 이동
        router.replace('/(auth)');
        return true; // 이벤트 처리 완료
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  // 로그인 버튼 클릭 시 실행
  const handleLogin = async () => {
    try {
      console.log('로그인 시작:', { email, password });
      const res = await login({ email, password });
      console.log('로그인 결과:', res);

      // 상세한 조건 확인 로그
      console.log('🔍 조건 확인:');
      console.log('  - res.status:', res.status);
      console.log('  - res.data:', res.data);
      console.log('  - res.data.data?.access_token:', res.data.data?.access_token);
      console.log('  - 조건 만족 여부:', res.status === 200 && res.data.data?.access_token);

      if (res.status === 200 && res.data.data?.access_token) {
        console.log('✅ 조건 만족 - 토큰 저장 시작');
        await AsyncStorage.setItem('token', res.data.data.access_token);
        await AsyncStorage.setItem('refreshToken', res.data.data.refresh_token);
        console.log('✅ 토큰 저장 완료');

        console.log('🔄 화면 전환 시작 - 프로필 선택 화면으로 이동');
        // 네비게이션 스택을 정리하고 프로필 선택 화면으로 이동
        router.replace('/(profile)');
        console.log('✅ 화면 전환 명령 완료');
      } else {
        console.log('❌ 조건 불만족 - 로그인 실패');
        console.log('로그인 실패:', res);
        Alert.alert('로그인 실패', res.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('❌ 로그인 에러:', error);
      if (error instanceof Error) {
        Alert.alert('로그인 실패', error.message);
      } else {
        Alert.alert('오류', '예상치 못한 문제가 발생했습니다.');
      }
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '로그인',
          headerTitleAlign: 'center',
          headerBackTitle: '뒤로',
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/(auth)')}
              style={styles.headerBackButton}
            >
              <ThemedText style={[styles.headerBackText, { color: textColor }]}>← 뒤로</ThemedText>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} //ios 키보드 대응
        style={{ flex: 1 }}
      >
        {/* 입력 및 로그인 영역 */}
        <View style={styles.formContainer}>
          <ThemedText style={[styles.title, { color: textColor }]}>로그인</ThemedText>
          <TextInput
            style={[styles.input, { borderColor, color: textColor }]}
            placeholder="이메일"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { borderColor, color: textColor }]}
            placeholder="비밀번호"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: primaryColor }]}
            onPress={handleLogin}
          >
            <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>로그인</ThemedText>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => router.push('./signup')}>
              <ThemedText style={[styles.linkText, { color: primaryColor }]}>회원가입</ThemedText>
            </TouchableOpacity>
            <ThemedText style={{ color: dividerColor }}> | </ThemedText>
            <TouchableOpacity onPress={() => router.push('./find-account')}>
              <ThemedText style={[styles.linkText, { color: primaryColor }]}>
                아이디/비밀번호 찾기
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 하단 소셜 로그인 + 안내 */}
      <View style={styles.footerContainer}>
        <View style={styles.socialButtonRow}>
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]}
            onPress={() => Alert.alert('페이스북 로그인 눌림')}
          >
            <Image source={facebookIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Facebook</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]}
            onPress={() => Alert.alert('구글 로그인 눌림')}
          >
            <Image source={googleIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Google</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={[styles.notice, { color: placeholderColor }]}>
          StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{'\n'}
          개인정보처리방침에 동의하게 됩니다.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

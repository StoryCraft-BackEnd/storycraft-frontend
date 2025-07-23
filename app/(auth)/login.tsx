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
import { login, startTokenRefreshManager } from '@/shared/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Popup } from '@/components/ui/Popup';

export default function LoginScreen() {
  //입력 필드 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);

    // 로그인 시도 전에 기존 토큰들을 정리합니다
    try {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'tokenIssuedAt']);
      console.log('🧹 로그인 시도 전 기존 토큰 정리 완료');
    } catch (cleanupError) {
      console.error('❌ 토큰 정리 실패:', cleanupError);
    }

    try {
      console.log('로그인 시작:', { email, password });
      const res = await login({ email, password });
      console.log('로그인 결과:', res);

      // 상세한 조건 확인 로그
      console.log('🔍 조건 확인:');
      console.log('  - res.status:', res.status);
      console.log('  - res.message:', res.message);
      console.log('  - res.data.access_token:', res.data.access_token);
      console.log('  - res.data.refresh_token:', res.data.refresh_token);
      console.log('  - 조건 만족 여부:', res.status === 200 && res.data.access_token);

      if (res.status === 200 && res.data.access_token) {
        console.log('✅ 조건 만족 - 토큰 저장');

        // 토큰 갱신 매니저 시작
        try {
          await startTokenRefreshManager();
          console.log('✅ 토큰 갱신 매니저 시작 완료');
        } catch (error) {
          console.error('❌ 토큰 갱신 매니저 시작 실패:', error);
        }

        console.log('🔄 화면 전환 시작 - 프로필 선택 화면으로 이동');
        router.replace('/(profile)');
        console.log('✅ 화면 전환 명령 완료');
      } else {
        console.log('❌ 조건 불만족 - 로그인 실패');
        console.log('로그인 실패:', res);
        setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('❌ 로그인 에러:', error);

      // 사용자에게는 기술적인 에러 대신 이해하기 쉬운 메시지 표시
      let userFriendlyMessage = '로그인 중 문제가 발생했습니다.';

      if (error instanceof Error) {
        const errorMessage = error.message;

        // 서버에서 반환하는 에러 메시지 중 사용자 친화적인 것만 사용
        if (errorMessage.includes('이메일') || errorMessage.includes('비밀번호')) {
          userFriendlyMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (errorMessage.includes('네트워크') || errorMessage.includes('연결')) {
          userFriendlyMessage = '네트워크 연결을 확인해주세요.';
        } else if (errorMessage.includes('서버')) {
          userFriendlyMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        }

        // 개발용 로그에는 원본 에러 메시지 유지
        console.log('🔍 원본 에러 메시지:', errorMessage);
      }

      setErrorMessage(userFriendlyMessage);
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          >
            <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>
              {isLoading ? '로그인 중...' : '로그인'}
            </ThemedText>
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

      {/* 에러 팝업 */}
      <Popup
        visible={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        title="로그인 실패"
        message={errorMessage}
        confirmText="확인"
      />
    </ThemedView>
  );
}

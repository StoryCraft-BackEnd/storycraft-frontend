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
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect, Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import { loginScreenStyles as styles } from '../../styles/LoginScreen.styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import facebookIcon from '../../assets/images/facebook.png';
import googleIcon from '../../assets/images/google.png';
import { login, startTokenRefreshManager, refreshAccessToken } from '@/shared/api/authApi';
// import { signup } from '@/shared/api/authApi'; // 빠른 회원가입 함수 주석처리로 인해 임시 제거
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Popup } from '@/components/ui/Popup';
// import { useGoogleAuth, processGoogleLogin } from '@/shared/config/googleSignIn'; // 구글 로그인 비활성화

export default function LoginScreen() {
  // 구글 로그인 훅 사용 (현재 사용하지 않음)
  // const { request, response, promptAsync } = useGoogleAuth();

  // 안전 영역 정보 가져오기
  const insets = useSafeAreaInsets();

  // 입력 필드 상태 관리
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

  // 화이트모드에서만 밝은 살구색 배경 적용
  const colorScheme = useColorScheme();
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF5E6' : backgroundColor;

  // 컴포넌트 마운트 시 시스템 UI 숨기기 (최초 실행 대응)
  React.useEffect(() => {
    const hideSystemUIOnMount = async () => {
      try {
        // 강화된 네비게이션 바 숨기기 (여러 번 시도)
        let navigationBarHidden = false;
        for (let i = 0; i < 3; i++) {
          try {
            await NavigationBar.setVisibilityAsync('hidden');
            navigationBarHidden = true;
            break;
          } catch (error) {
            console.log(`⚠️ 네비게이션 바 숨기기 시도 ${i + 1} 실패:`, error);
            await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
          }
        }

        if (!navigationBarHidden) {
          console.log('❌ 네비게이션 바 숨기기 최종 실패');
        }

        // 상태바 숨기기
        StatusBar.setHidden(true);

        // 전체 화면 모드 설정 (Immersive Mode)
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

        // 추가 지연 후 한 번 더 시도
        setTimeout(async () => {
          try {
            await NavigationBar.setVisibilityAsync('hidden');
            console.log('✅ 지연 후 네비게이션 바 숨기기 재시도 완료');
          } catch (error) {
            console.log('❌ 지연 후 네비게이션 바 숨기기 실패:', error);
          }
        }, 500);
      } catch (error) {
        console.log('❌ 컴포넌트 마운트 시 시스템 UI 숨기기 실패:', error);
      }
    };

    hideSystemUIOnMount();
  }, []);

  // 화면이 포커스될 때 네비게이션 바와 상태바 숨기기
  useFocusEffect(
    React.useCallback(() => {
      const hideSystemUI = async () => {
        try {
          // 강화된 네비게이션 바 숨기기 (여러 번 시도)
          let navigationBarHidden = false;
          for (let i = 0; i < 3; i++) {
            try {
              await NavigationBar.setVisibilityAsync('hidden');
              navigationBarHidden = true;
              break;
            } catch (error) {
              console.log('⚠️ 네비게이션 바 숨기기 시도 실패:', error);
              await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
            }
          }

          if (!navigationBarHidden) {
            console.log('❌ 포커스 시 네비게이션 바 숨기기 최종 실패');
          }

          // 상태바 숨기기
          StatusBar.setHidden(true);

          // 전체 화면 모드 설정 (Immersive Mode)
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

          // 추가 지연 후 한 번 더 시도
          setTimeout(async () => {
            try {
              await NavigationBar.setVisibilityAsync('hidden');
              console.log('✅ 포커스 시 지연 후 네비게이션 바 숨기기 재시도 완료');
            } catch (error) {
              console.log('❌ 포커스 시 지연 후 네비게이션 바 숨기기 실패:', error);
            }
          }, 500);
        } catch (error) {
          console.log('❌ 포커스 시 시스템 UI 숨기기 실패:', error);
        }
      };

      hideSystemUI();

      // 화면이 포커스를 잃을 때 시스템 UI 복원
      return () => {
        const restoreSystemUI = async () => {
          try {
            console.log('🔄 화면 포커스 해제 시 시스템 UI 복원 시작');
            await NavigationBar.setVisibilityAsync('visible');
            StatusBar.setHidden(false);
            // 화면 방향 잠금 해제
            await ScreenOrientation.unlockAsync();
          } catch (error) {
            console.log('❌ 시스템 UI 복원 실패:', error);
          }
        };
        restoreSystemUI();
      };
    }, [])
  );

  // 뒤로가기 버튼 처리 - 로그인 화면에서 뒤로가기 시 아무것도 하지 않음
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // 로그인 화면에서 뒤로가기 버튼을 누르면 아무것도 하지 않음
        // 약관 동의 후 로그인 화면이므로 뒤로가기 비활성화
        return true; // 이벤트 처리 완료 (뒤로가기 방지)
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  // 구글 로그인 핸들러 (현재 사용하지 않음)
  /*
  const handleGoogleLogin = async () => {
    if (!request) {
      console.log('❌ 구글 로그인 요청이 준비되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 구글 로그인 시작...');
      await promptAsync();
    } catch (error) {
      console.error('❌ 구글 로그인 중 오류:', error);
      setErrorMessage('구글 로그인 중 오류가 발생했습니다.');
      setShowErrorPopup(true);
      setIsLoading(false);
    }
  };
  */

  // 구글 로그인 응답 처리 (현재 사용하지 않음)
  /*
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;

      console.log('✅ 구글 로그인 성공!');
      console.log('🆔 id_token:', id_token);
      console.log('🔑 access_token:', access_token);

      // 서버 인증 처리
      processGoogleLogin(id_token)
        .then((authResult) => {
          if (authResult.isExistingUser) {
            // 기존 사용자: 바로 메인 화면으로 이동
            console.log('✅ 기존 사용자 - 메인 화면으로 이동');
            router.replace('/(main)');
          } else {
            // 새 사용자: 닉네임 입력 화면으로 이동
            console.log('🆕 새 사용자 - 닉네임 입력 화면으로 이동');
            router.push({
              pathname: '/google-nickname',
              params: { email: authResult.user.email },
            });
          }
        })
        .catch((error) => {
          console.error('❌ 서버 인증 처리 실패:', error);
          setErrorMessage('서버 인증 처리 중 오류가 발생했습니다.');
          setShowErrorPopup(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (response?.type === 'error') {
      console.log('❌ 구글 로그인 실패:', response.error);
      setErrorMessage(`구글 로그인 실패: ${response.error}`);
      setShowErrorPopup(true);
      setIsLoading(false);
    }
  }, [response]);
  */

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

        // 토큰 리프레시를 한 번 더 실행하여 새로운 토큰 발급
        try {
          console.log('🔄 토큰 리프레시 시작 (일반 로그인)');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            await AsyncStorage.setItem('token', newAccessToken);
            console.log('✅ 토큰 리프레시 완료 - 새로운 토큰 발급됨 (일반 로그인)');
          } else {
            console.log('⚠️ 리프레시 토큰이 없어 토큰 리프레시를 건너뜁니다 (일반 로그인)');
          }
        } catch (refreshError) {
          console.error('❌ 토큰 리프레시 실패 (일반 로그인):', refreshError);
        }

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

  // 고정된 ID/PW로 회원가입하는 함수 - 임시 주석처리
  /*
  const handleQuickSignup = async () => {
    setIsLoading(true);

    try {
      console.log('🚀 빠른 회원가입 시작');

      // 고정된 회원가입 데이터
      const signupData = {
        email: 'testuser@naver.com',
        password: 'password123',
        name: '테스트 사용자',
        nickname: '테스트',
        role: 'parent', // API 문서에 따르면 'parent'여야 함
      };

      console.log('📝 회원가입 요청 데이터:', signupData);

      // 회원가입 API 호출
      const result = await signup(signupData);
      console.log('✅ 회원가입 완료:', result);

      // 회원가입 성공 시 자동으로 로그인
      console.log('🔄 자동 로그인 시작');
      const loginResult = await login({ email: 'testuser@naver.com', password: 'password123' });

      if (loginResult.status === 200 && loginResult.data.access_token) {
        // 토큰 리프레시를 한 번 더 실행하여 새로운 토큰 발급
        try {
          console.log('🔄 토큰 리프레시 시작');
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            await AsyncStorage.setItem('token', newAccessToken);
            console.log('✅ 토큰 리프레시 완료 - 새로운 토큰 발급됨');
          } else {
            console.log('⚠️ 리프레시 토큰이 없어 토큰 리프레시를 건너뜁니다');
          }
        } catch (refreshError) {
          console.error('❌ 토큰 리프레시 실패:', refreshError);
        }

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
      }
    } catch (error) {
      console.error('❌ 빠른 회원가입 실패:', error);

      let userFriendlyMessage = '회원가입 중 문제가 발생했습니다.';
      let shouldTryLogin = false;

      // Axios 에러인지 확인하고 상태 코드로 판단
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const statusCode = axiosError.response?.status;

        console.log('🔍 에러 상태 코드:', statusCode);

        // 409 Conflict: 이미 사용 중인 이메일
        if (statusCode === 409) {
          userFriendlyMessage = '이미 가입된 계정입니다. 로그인을 시도합니다.';
          shouldTryLogin = true;
        } else if (statusCode === 500) {
          userFriendlyMessage = '이미 가입된 계정입니다. 로그인을 시도합니다.';
          shouldTryLogin = true;
        } else if (statusCode >= 400 && statusCode < 500) {
          userFriendlyMessage = `회원가입 실패 (${statusCode}): ${axiosError.response?.data?.message || '클라이언트 오류'}`;
        } else if (statusCode >= 500) {
          userFriendlyMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        }
      } else if (error instanceof Error) {
        const errorMessage = error.message;

        // 문자열 기반 에러 메시지 처리 (기존 로직 유지)
        if (errorMessage.includes('409') || errorMessage.includes('이미 사용 중인 이메일')) {
          userFriendlyMessage = '이미 가입된 계정입니다. 로그인을 시도합니다.';
          shouldTryLogin = true;
        } else if (errorMessage.includes('500') || errorMessage.includes('서버 오류')) {
          userFriendlyMessage = '이미 가입된 계정입니다. 로그인을 시도합니다.';
          shouldTryLogin = true;
        } else if (errorMessage.includes('이미 존재')) {
          userFriendlyMessage = '이미 가입된 계정입니다. 로그인을 시도합니다.';
          shouldTryLogin = true;
        } else if (errorMessage.includes('네트워크') || errorMessage.includes('연결')) {
          userFriendlyMessage = '네트워크 연결을 확인해주세요.';
        } else if (errorMessage.includes('서버')) {
          userFriendlyMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      // 이미 가입된 계정으로 판단되면 로그인 시도
      if (shouldTryLogin) {
        try {
          console.log('🔄 이미 가입된 계정으로 로그인 시도');
          const loginResult = await login({
            email: 'testuser@naver.com',
            password: 'password123',
          });

          if (loginResult.status === 200 && loginResult.data.access_token) {
            // 토큰 리프레시를 한 번 더 실행하여 새로운 토큰 발급
            try {
              console.log('🔄 토큰 리프레시 시작 (자동 로그인)');
              const refreshToken = await AsyncStorage.getItem('refreshToken');
              if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);
                await AsyncStorage.setItem('token', newAccessToken);
                console.log('✅ 토큰 리프레시 완료 - 새로운 토큰 발급됨 (자동 로그인)');
              } else {
                console.log('⚠️ 리프레시 토큰이 없어 토큰 리프레시를 건너뜁니다 (자동 로그인)');
              }
            } catch (refreshError) {
              console.error('❌ 토큰 리프레시 실패 (자동 로그인):', refreshError);
            }

            // 토큰 갱신 매니저 시작
            try {
              await startTokenRefreshManager();
              console.log('✅ 토큰 갱신 매니저 시작 완료');
            } catch (tokenError) {
              console.error('❌ 토큰 갱신 매니저 시작 실패:', tokenError);
            }

            console.log('🔄 화면 전환 시작 - 프로필 선택 화면으로 이동');
            router.replace('/(profile)');
            console.log('✅ 화면 전환 명령 완료');
            return; // 성공적으로 로그인되면 팝업을 띄우지 않음
          }
        } catch (loginError) {
          console.error('❌ 자동 로그인 실패:', loginError);
          userFriendlyMessage = '이미 가입된 계정이지만 로그인에 실패했습니다.';
        }
      }

      setErrorMessage(userFriendlyMessage);
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };
  */

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: finalBackgroundColor,
          paddingTop: Math.max(insets.top, 20), // 최소 20px 여백 보장
          paddingBottom: Math.max(insets.bottom, 20),
          paddingLeft: Math.max(insets.left, 16),
          paddingRight: Math.max(insets.right, 16),
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      {/* 뒤로가기 버튼 - 약관 동의 후 로그인 화면이므로 제거 */}
      {/* <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          position: 'absolute',
          top: 34,
          left: 26,
          zIndex: 10,
          backgroundColor:
            colorScheme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.3)',
          borderRadius: 20,
        }}
        onPress={() => router.replace('/(auth)')}
      >
        <Ionicons name="arrow-back" size={24} color={colorScheme === 'light' ? '#333' : '#fff'} />
      </TouchableOpacity> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} //ios 키보드 대응
        style={{ flex: 1 }}
      >
        {/* 입력 및 로그인 영역 */}
        <View style={[styles.formContainer, { paddingTop: 20 }]}>
          <ThemedText style={[styles.title, { color: textColor }]}>로그인</ThemedText>

          {/* 이메일 입력 필드 */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={placeholderColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="이메일"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* 비밀번호 입력 필드 */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={placeholderColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="비밀번호"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#2D5016' }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>
              {isLoading ? '로그인 중...' : '로그인'}
            </ThemedText>
          </TouchableOpacity>

          {/* 빠른 회원가입 버튼 (개발용) - 임시 주석처리 */}
          {/* <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#4CAF50', marginTop: 10 }]}
            onPress={handleQuickSignup}
            disabled={isLoading}
          >
            <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>
              {isLoading ? '처리 중...' : '🚀 빠른 회원가입 (testuser@naver.com)'}
            </ThemedText>
          </TouchableOpacity> */}

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => router.push('./signup')}>
              <ThemedText style={[styles.linkText, { color: '#2D5016' }]}>회원가입</ThemedText>
            </TouchableOpacity>
            <ThemedText style={{ color: dividerColor }}> | </ThemedText>
            <TouchableOpacity onPress={() => router.push('./find-account')}>
              <ThemedText style={[styles.linkText, { color: '#2D5016' }]}>
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

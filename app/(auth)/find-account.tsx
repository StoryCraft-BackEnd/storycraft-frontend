import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { ThemedView } from '../../components/ui/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { findAccountScreenStyles as styles } from '../../styles/FindAccountScreen.styles';
import { sendEmailVerificationCode, verifyEmailCode, resetPassword } from '@/features/auth/authApi';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FindAccountScreen() {
  // 안전 영역 정보 가져오기
  const insets = useSafeAreaInsets();

  // 상태 관리
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // 테마 색상
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');
  const textColor = useThemeColor('text');
  const placeholderColor = useThemeColor('secondary');
  const backgroundColor = useThemeColor('background');

  // 화이트모드에서만 밝은 살구색 배경 적용 (로그인 화면과 동일)
  const colorScheme = useColorScheme();
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF5E6' : backgroundColor;

  // 화면이 포커스될 때 네비게이션 바와 상태바 숨기기
  useFocusEffect(
    React.useCallback(() => {
      const hideSystemUI = async () => {
        try {
          // 네비게이션 바 숨기기
          await NavigationBar.setVisibilityAsync('hidden');
          // 상태바 숨기기
          StatusBar.setHidden(true);
          // 전체 화면 모드 설정 (Immersive Mode)
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        } catch (error) {
          console.log('시스템 UI 숨기기 실패:', error);
        }
      };

      hideSystemUI();

      // 화면이 포커스를 잃을 때 시스템 UI 복원
      return () => {
        const restoreSystemUI = async () => {
          try {
            await NavigationBar.setVisibilityAsync('visible');
            StatusBar.setHidden(false);
            // 화면 방향 잠금 해제
            await ScreenOrientation.unlockAsync();
          } catch (error) {
            console.log('시스템 UI 복원 실패:', error);
          }
        };
        restoreSystemUI();
      };
    }, [])
  );

  // 라우터
  const router = useRouter();

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return '비밀번호는 영문자를 포함해야 합니다.';
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return '비밀번호는 숫자를 포함해야 합니다.';
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return '비밀번호는 특수문자를 포함해야 합니다.';
    }
    return null;
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordError(validatePassword(password));
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (password: string) => {
    setConfirmPassword(password);
    if (newPassword && password !== newPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError(null);
    }
  };

  // 인증코드 전송 핸들러 (실제 API 연동 필요)
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    try {
      const result = await sendEmailVerificationCode({ email });
      Alert.alert('알림', result.message);
    } catch (error) {
      console.error(error);
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response?.status === 404
      ) {
        Alert.alert('알림', '가입되지 않은 이메일입니다.');
      } else {
        Alert.alert('오류', '인증코드 전송 중 문제가 발생했습니다.');
      }
    }
  };

  // 인증번호 확인 핸들러 (실제 API 연동)
  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }
    try {
      const result = await verifyEmailCode({ email, code });
      if (result.status === 200) {
        setIsVerified(true);
        setResetToken(result.data.resetToken);
        Alert.alert('알림', '이메일 인증이 완료되었습니다. 비밀번호 재설정 화면으로 이동합니다.', [
          {
            text: '확인',
            onPress: () => {
              // 비밀번호 재설정 화면으로 이동
              // 여기서는 현재 화면에서 비밀번호 입력 UI를 표시하도록 상태 변경
              setIsVerified(true);
            },
          },
        ]);
      } else {
        Alert.alert('알림', result.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '인증번호 확인 중 문제가 발생했습니다.');
    }
  };

  // 비밀번호 재설정 핸들러 (실제 API 연동 필요)
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('알림', '새 비밀번호와 확인을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('알림', passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isVerified || !resetToken) {
      Alert.alert('오류', '이메일 인증을 먼저 완료해주세요.');
      return;
    }
    try {
      // API 스펙에 따라 resetToken과 새 비밀번호를 전송
      const result = await resetPassword({
        resetToken: resetToken,
        newPassword: newPassword,
      });
      if (result.status === 200) {
        Alert.alert('알림', '비밀번호가 성공적으로 재설정되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              // 로그인 화면으로 돌아가기
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert('오류', result.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '비밀번호 재설정 중 문제가 발생했습니다.');
    }
  };

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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start', paddingTop: 24 }}
        >
          {/* 상단 타이틀 및 안내문구 */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: textColor,
              marginBottom: 8,
              alignSelf: 'flex-start',
            }}
          >
            내 계정 찾기
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: placeholderColor,
              marginBottom: 24,
              alignSelf: 'flex-start',
            }}
          >
            이메일 주소를 입력하세요.
          </Text>

          {/* 이메일 입력 + 인증코드 전송 */}
          <View style={[styles.row, { marginBottom: 16, width: '100%' }]}>
            <TextInput
              placeholder="이메일 주소"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { flex: 1, borderColor, color: textColor, marginBottom: 0 }]}
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[
                styles.smallButton,
                styles.smallButtonMarginLeft,
                { borderColor: primaryColor },
              ]}
              onPress={handleSendCode}
            >
              <Text style={{ color: primaryColor }}>인증번호 전송</Text>
            </TouchableOpacity>
          </View>
          {/* 인증번호 입력 + 확인 */}
          <View style={[styles.row, { marginBottom: 16, width: '100%' }]}>
            <TextInput
              placeholder="인증번호 입력"
              value={code}
              onChangeText={setCode}
              style={[styles.input, { flex: 1, borderColor, color: textColor, marginBottom: 0 }]}
              placeholderTextColor={placeholderColor}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[
                styles.smallButton,
                styles.smallButtonMarginLeft,
                { borderColor: primaryColor },
              ]}
              onPress={handleVerifyCode}
            >
              <Text style={{ color: primaryColor }}>확인</Text>
            </TouchableOpacity>
          </View>
          {/* 인증 성공 시 비밀번호 재설정 필드 노출 */}
          {isVerified && (
            <>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: textColor,
                  marginTop: 32,
                  marginBottom: 16,
                  alignSelf: 'flex-start',
                }}
              >
                새 비밀번호 설정
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: placeholderColor,
                  marginBottom: 24,
                  alignSelf: 'flex-start',
                }}
              >
                새로운 비밀번호를 입력해주세요.
              </Text>
              <TextInput
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChangeText={handlePasswordChange}
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <Text
                style={{
                  fontSize: 12,
                  color: placeholderColor,
                  marginTop: 4,
                  marginBottom: 8,
                  alignSelf: 'flex-start',
                }}
              >
                • 8자 이상 • 영문자 포함 • 숫자 포함 • 특수문자 포함
              </Text>
              {passwordError && (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 8 }}>{passwordError}</Text>
              )}
              <TextInput
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              {confirmPasswordError && (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 8 }}>
                  {confirmPasswordError}
                </Text>
              )}
              <TouchableOpacity
                style={[
                  styles.mainButton,
                  {
                    backgroundColor: '#2D5016',
                    alignSelf: 'stretch',
                    opacity:
                      !newPassword || !confirmPassword || passwordError || confirmPasswordError
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={handleResetPassword}
                disabled={
                  !newPassword || !confirmPassword || !!passwordError || !!confirmPasswordError
                }
              >
                <Text style={styles.mainButtonText}>비밀번호 재설정</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 로그인으로 돌아가기 링크 */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, width: '100%' }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#5A7C65' }}>
                로그인으로 돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

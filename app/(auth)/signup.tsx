// app/(auth)/signup.tsx
// 회원가입 화면 컴포넌트
// 사용자 회원가입을 처리하는 화면

import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import { signupScreenStyles as styles } from '../../styles/SignupScreen.styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { signup, checkEmail } from '@/features/auth/authApi';
import { checkNicknameExists } from '@/shared/api/authApi';
import type { SignupRequest } from '@/features/auth/types';

export default function SignupScreen() {
  // 안전 영역 정보 가져오기
  const insets = useSafeAreaInsets();

  // 단계별 입력값 상태 관리
  const [step, setStep] = useState(1);
  const [lastName, setLastName] = useState(''); // 성
  const [firstName, setFirstName] = useState(''); // 이름
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<'admin' | 'parent'>('parent');
  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isNicknameChecking, setIsNicknameChecking] = useState(false);

  // 테마 색상 가져오기
  const placeholderColor = useThemeColor('secondary');
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');

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

  // 회원가입 처리
  const handleSignup = async () => {
    // 이미 로딩 중이면 중복 요청 방지
    if (isLoading) return;

    setIsLoading(true); // 로딩 시작

    try {
      // 사용자 입력 데이터로 회원가입 요청 객체 생성
      const formData: SignupRequest = {
        email,
        password,
        name: `${lastName} ${firstName}`.trim(),
        nickname,
        role,
      };

      console.log('📝 회원가입 요청 데이터:', formData);

      // 실제 회원가입 API 호출
      const result = await signup(formData);

      console.log('✅ 회원가입 완료:', result);

      // 성공 시 알림 표시 후 로그인 화면으로 이동
      Alert.alert('회원가입 완료! 🎉', `${result.message}\n로그인 화면으로 이동합니다.`, [
        {
          text: '확인',
          onPress: () => router.replace('/(auth)'),
        },
      ]);
    } catch (error: unknown) {
      console.error('❌ 회원가입 실패:', error);

      // 에러 메시지 생성
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : '회원가입 중 문제가 발생했습니다.';

      // 에러 알림 표시
      Alert.alert('회원가입 실패 ❌', message, [{ text: '다시 시도', style: 'default' }]);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    // 이메일 입력 검증
    if (!email || !email.includes('@')) {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    // 이미 확인 중이면 중복 요청 방지
    if (isEmailChecking) return;

    setIsEmailChecking(true); // 로딩 시작

    try {
      console.log('📧 이메일 중복 확인 요청:', email);
      const result = await checkEmail({ email });

      if (result.data) {
        Alert.alert('사용 가능 ✅', '사용 가능한 이메일입니다.');
        setEmailChecked(true);
        console.log('✅ 이메일 사용 가능:', email);
      } else {
        Alert.alert('중복 이메일 ❌', '이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
        console.log('❌ 이메일 중복:', email);
      }
    } catch (error) {
      console.error('❌ 이메일 중복 확인 실패:', {
        email,
        error,
        timestamp: new Date().toISOString(),
      });
      setEmailChecked(false);
      Alert.alert('확인 실패', '이메일 중복 확인 중 문제가 발생했습니다.');
    } finally {
      setIsEmailChecking(false); // 로딩 종료
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    // 닉네임 입력 검증
    if (!nickname || nickname.length < 2) {
      Alert.alert('오류', '닉네임을 2자 이상 입력해주세요.');
      return;
    }

    // 이미 확인 중이면 중복 요청 방지
    if (isNicknameChecking) return;

    setIsNicknameChecking(true); // 로딩 시작

    try {
      console.log('🏷️ 닉네임 중복 확인 요청:', nickname);
      const result = await checkNicknameExists({ nickname });

      if (result.data) {
        Alert.alert('사용 가능 ✅', '사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
        console.log('✅ 닉네임 사용 가능:', nickname);
      } else {
        Alert.alert('중복 닉네임 ❌', '이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
        console.log('❌ 닉네임 중복:', nickname);
      }
    } catch (error) {
      console.error('❌ 닉네임 중복 확인 실패:', {
        nickname,
        error,
        timestamp: new Date().toISOString(),
      });
      setNicknameChecked(false);
      Alert.alert('확인 실패', '닉네임 중복 확인 중 문제가 발생했습니다.');
    } finally {
      setIsNicknameChecking(false); // 로딩 종료
    }
  };

  // 단계별 유효성 검사 및 다음 단계 이동
  const handleNext = () => {
    if (step === 1) {
      if (!lastName || !firstName) {
        Alert.alert('오류', '성을 포함한 이름을 입력해 주세요.');
        return;
      }
      console.log('👤 이름 입력 완료:', { lastName, firstName });
    }
    if (step === 2) {
      if (!email || !email.includes('@')) {
        Alert.alert('오류', '올바른 이메일 주소를 입력해 주세요.');
        return;
      }
      if (!emailChecked) {
        Alert.alert('오류', '이메일 중복 확인을 해주세요.');
        return;
      }
      console.log('📧 이메일 입력 및 중복확인 완료:', { email, emailChecked });
    }
    if (step === 3) {
      if (!password || password.length < 6) {
        Alert.alert('오류', '비밀번호를 6자 이상 입력해 주세요.');
        return;
      }
      console.log('🔒 비밀번호 입력 완료:', { passwordLength: password.length });
    }
    if (step === 4) {
      if (!nickname) {
        Alert.alert('오류', '닉네임을 입력해 주세요.');
        return;
      }
      if (!nicknameChecked) {
        Alert.alert('오류', '닉네임 중복 확인을 해주세요.');
        return;
      }
      console.log('🏷️ 닉네임 입력 및 중복확인 완료:', { nickname, nicknameChecked });
    }
    if (step === 5) {
      console.log('🚀 최종 회원가입 단계 - 프로필 생성 시작');
      handleSignup();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // 단계별 입력 UI
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>이름이 뭐예요?</ThemedText>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="성"
              placeholderTextColor={placeholderColor}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="이름"
              placeholderTextColor={placeholderColor}
              value={firstName}
              onChangeText={setFirstName}
            />
          </>
        );
      case 2:
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>
              이메일 주소를 입력하세요
            </ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputRowInput, { borderColor, color: textColor }]}
                placeholder="이메일"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailChecked(false);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: '#2D5016' }]}
                onPress={handleEmailCheck}
                disabled={isEmailChecking}
              >
                <ThemedText style={{ color: cardColor }}>
                  {isEmailChecking ? '확인중...' : '중복확인'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>
              비밀번호를 설정하세요
            </ThemedText>
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="비밀번호"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </>
        );
      case 4:
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>
              닉네임을 입력하세요
            </ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputRowInput, { borderColor, color: textColor }]}
                placeholder="닉네임"
                placeholderTextColor={placeholderColor}
                value={nickname}
                onChangeText={(text) => {
                  setNickname(text);
                  setNicknameChecked(false);
                }}
              />
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: '#2D5016' }]}
                onPress={handleNicknameCheck}
                disabled={isNicknameChecking}
              >
                <ThemedText style={{ color: cardColor }}>
                  {isNicknameChecking ? '확인중...' : '중복확인'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case 5:
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>역할을 선택하세요</ThemedText>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: role === 'admin' ? '#2D5016' : cardColor,
                    borderColor: '#2D5016',
                  },
                ]}
                onPress={() => setRole('admin')}
              >
                <ThemedText style={{ color: role === 'admin' ? '#fff' : '#222' }}>
                  관리자
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: role === 'parent' ? '#2D5016' : cardColor,
                    borderColor: '#2D5016',
                  },
                ]}
                onPress={() => setRole('parent')}
              >
                <ThemedText style={{ color: role === 'parent' ? '#fff' : '#222' }}>부모</ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      default:
        return null;
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
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>
            <View style={styles.formContainer}>
              {/* 단계별 입력 UI */}
              {renderStep()}

              {/* 이전/다음 버튼 */}
              <View
                style={{ flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' }}
              >
                {step > 1 && (
                  <TouchableOpacity
                    style={[
                      styles.signupButton,
                      { backgroundColor: cardColor, flex: 1, marginRight: 8 },
                    ]}
                    onPress={handlePrev}
                  >
                    <ThemedText style={[styles.signupButtonText, { color: '#5A7C65' }]}>
                      이전
                    </ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    { backgroundColor: '#2D5016', flex: 1, marginLeft: step > 1 ? 8 : 0 },
                  ]}
                  onPress={handleNext}
                  disabled={step === 5 && isLoading}
                >
                  <ThemedText style={[styles.signupButtonText, { color: cardColor }]}>
                    {step === 5 ? (isLoading ? '프로필 생성중...' : '프로필 생성하기') : '계속하기'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* 로그인 페이지로 이동 */}
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText style={[styles.linkText, { color: '#5A7C65' }]}>
                    로그인으로 돌아가기
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {/* 하단 안내 문구 */}
          <View style={styles.footerContainer}>
            <ThemedText style={[styles.notice, { color: placeholderColor }]}>
              StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{'\n'}개인정보처리방침에 동의하게
              됩니다.
            </ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

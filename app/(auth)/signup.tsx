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
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '../../components/ui/ThemedView';
import { ThemedText } from '../../components/ui/ThemedText';
import { signupScreenStyles as styles } from '../../styles/SignupScreen.styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import { signup, checkEmail, checkNickname } from '@/features/auth/authApi';
import type { SignupRequest } from '@/features/auth/types';

export default function SignupScreen() {
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

  // 테마 색상 가져오기
  const placeholderColor = useThemeColor('secondary');
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      const formData: SignupRequest = {
        email,
        password,
        name: `${lastName} ${firstName}`.trim(),
        nickname,
        role,
      };
      const result = await signup(formData);
      Alert.alert('알림', result.message);
      router.replace('/login');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : '회원가입 중 문제가 발생했습니다.';
      Alert.alert('오류', message);
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    try {
      const result = await checkEmail({ email });
      if (result.data) {
        Alert.alert('알림', '사용 가능한 이메일입니다.');
        setEmailChecked(true);
      } else {
        Alert.alert('알림', '이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
      }
    } catch {
      setEmailChecked(false);
      Alert.alert('오류', '이메일 중복 확인 중 문제가 발생했습니다.');
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    try {
      const result = await checkNickname({ nickname });
      if (result.data) {
        Alert.alert('알림', '사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      } else {
        Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      }
    } catch {
      setNicknameChecked(false);
      Alert.alert('오류', '닉네임 중복 확인 중 문제가 발생했습니다.');
    }
  };

  // 단계별 유효성 검사 및 다음 단계 이동
  const handleNext = () => {
    if (step === 1) {
      if (!lastName || !firstName) {
        Alert.alert('오류', '성을 포함한 이름을 입력해 주세요.');
        return;
      }
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
    }
    if (step === 3) {
      if (!password || password.length < 6) {
        Alert.alert('오류', '비밀번호를 6자 이상 입력해 주세요.');
        return;
      }
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
    }
    if (step === 5) {
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
                style={[styles.checkButton, { backgroundColor: primaryColor }]}
                onPress={handleEmailCheck}
              >
                <ThemedText style={{ color: cardColor }}>중복확인</ThemedText>
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
                style={[styles.checkButton, { backgroundColor: primaryColor }]}
                onPress={handleNicknameCheck}
              >
                <ThemedText style={{ color: cardColor }}>중복확인</ThemedText>
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
                    backgroundColor: role === 'admin' ? primaryColor : cardColor,
                    borderColor: primaryColor,
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
                    backgroundColor: role === 'parent' ? primaryColor : cardColor,
                    borderColor: primaryColor,
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
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                    <ThemedText style={[styles.signupButtonText, { color: primaryColor }]}>
                      이전
                    </ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    { backgroundColor: primaryColor, flex: 1, marginLeft: step > 1 ? 8 : 0 },
                  ]}
                  onPress={handleNext}
                >
                  <ThemedText style={[styles.signupButtonText, { color: cardColor }]}>
                    {' '}
                    {step === 5 ? '프로필 생성하기' : '계속하기'}{' '}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* 로그인 페이지로 이동 */}
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText style={[styles.linkText, { color: primaryColor }]}>
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

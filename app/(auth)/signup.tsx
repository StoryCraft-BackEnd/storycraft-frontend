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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen() {
  // 입력 필드 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<'admin' | 'parent'>('parent');

  // 테마 색상 가져오기
  const placeholderColor = useThemeColor('secondary');
  const dividerColor = useThemeColor('text');
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    try {
      // TODO: API 연동
      Alert.alert('알림', '이메일 중복 확인 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      Alert.alert('오류', '이메일 중복 확인 중 문제가 발생했습니다.');
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    try {
      // TODO: API 연동
      Alert.alert('알림', '닉네임 중복 확인 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      Alert.alert('오류', '닉네임 중복 확인 중 문제가 발생했습니다.');
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      // TODO: API 연동
      Alert.alert('알림', '회원가입 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* 입력 및 회원가입 영역 */}
          <View style={styles.formContainer}>
            <ThemedText style={[styles.title, { color: textColor }]}>회원가입</ThemedText>

            {/* 이메일 입력 */}
            <ThemedText style={styles.label}>이메일</ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.inputRowInput,
                  { backgroundColor: cardColor, borderColor, color: '#000000' },
                ]}
                placeholder="이메일"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
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

            {/* 비밀번호 입력 */}
            <ThemedText style={styles.label}>비밀번호</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: cardColor, borderColor, color: '#000000' }]}
              placeholder="비밀번호"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* 이름 입력 */}
            <ThemedText style={styles.label}>이름</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: cardColor, borderColor, color: '#000000' }]}
              placeholder="이름"
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={setName}
            />

            {/* 닉네임 입력 */}
            <ThemedText style={styles.label}>닉네임</ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.inputRowInput,
                  { backgroundColor: cardColor, borderColor, color: '#000000' },
                ]}
                placeholder="닉네임"
                placeholderTextColor={placeholderColor}
                value={nickname}
                onChangeText={setNickname}
              />
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: primaryColor }]}
                onPress={handleNicknameCheck}
              >
                <ThemedText style={{ color: cardColor }}>중복확인</ThemedText>
              </TouchableOpacity>
            </View>

            {/* 역할 선택 */}
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

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[styles.signupButton, { backgroundColor: primaryColor }]}
              onPress={handleSignup}
            >
              <ThemedText style={[styles.signupButtonText, { color: cardColor }]}>
                회원가입
              </ThemedText>
            </TouchableOpacity>

            {/* 로그인 페이지로 이동 */}
            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <ThemedText style={[styles.linkText, { color: primaryColor }]}>
                  로그인으로 돌아가기
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 하단 안내 문구 */}
          <View style={styles.footerContainer}>
            <ThemedText style={[styles.notice, { color: placeholderColor }]}>
              StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{'\n'}
              개인정보처리방침에 동의하게 됩니다.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

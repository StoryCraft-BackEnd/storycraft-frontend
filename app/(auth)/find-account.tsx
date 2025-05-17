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
} from 'react-native';
import { ThemedView } from '../../components/ui/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { findAccountScreenStyles as styles } from '../../styles/FindAccountScreen.styles';
import { sendEmailVerificationCode, verifyEmailCode } from '@/features/auth/authApi';

export default function FindAccountScreen() {
  // 상태 관리
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 테마 색상
  const primaryColor = useThemeColor('primary');
  const borderColor = useThemeColor('border');
  const textColor = useThemeColor('text');
  const placeholderColor = useThemeColor('secondary');

  // 인증코드 전송 핸들러 (실제 API 연동 필요)
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    try {
      console.log('Sending code for email:', email);
      const result = await sendEmailVerificationCode({ email });
      console.log('Received result:', result);
      if (result.status === 404) {
        Alert.alert('알림', '가입되지 않은 이메일입니다.');
        return;
      }
      Alert.alert('알림', result.message);
    } catch (error) {
      console.log('Error occurred:', error);
      if (error.response?.status === 404) {
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
      if (result.status === 200 && result.data) {
        setIsVerified(true);
        Alert.alert('알림', '이메일 인증이 완료되었습니다.');
      } else {
        Alert.alert('알림', result.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      // axios 에러 타입 체크
      if (error && typeof error === 'object' && 'response' in error) {
        Alert.alert(
          '오류',
          error.response?.data?.message || '인증번호 확인 중 문제가 발생했습니다.'
        );
      } else {
        Alert.alert('오류', '인증번호 확인 중 문제가 발생했습니다.');
      }
    }
  };

  // 비밀번호 재설정 핸들러 (실제 API 연동 필요)
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('알림', '새 비밀번호와 확인을 모두 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: 비밀번호 재설정 API 연동
    Alert.alert('알림', '비밀번호가 성공적으로 재설정되었습니다.');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start', paddingTop: 48 }}
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
              <TextInput
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChangeText={setNewPassword}
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <TextInput
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: primaryColor, alignSelf: 'stretch' }]}
                onPress={handleResetPassword}
              >
                <Text style={styles.mainButtonText}>비밀번호 재설정</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

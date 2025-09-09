/**
 * 계정 찾기 화면 컴포넌트
 *
 * 사용자가 비밀번호를 잊었을 때 이메일 인증을 통해 비밀번호를 재설정할 수 있는 화면입니다.
 *
 * 주요 기능:
 * - 이메일 주소 입력 및 인증코드 전송
 * - 인증코드 확인 및 이메일 검증
 * - 새 비밀번호 설정 및 재설정
 * - 비밀번호 유효성 검사
 * - 시스템 UI 숨김 처리 (전체화면 모드)
 */

// React: React 라이브러리의 기본 기능들
// { useState }: React에서 제공하는 Hook 중 하나 (상태 관리용)
import React, { useState } from 'react';

// React Native: 모바일 앱 개발을 위한 UI 컴포넌트들
import {
  View, // 컨테이너 뷰 컴포넌트 (div와 비슷한 역할)
  TextInput, // 텍스트 입력 컴포넌트 (input과 비슷한 역할)
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트 (button)
  Text, // 텍스트 표시 컴포넌트
  KeyboardAvoidingView, // 키보드가 올라올 때 화면을 조정하는 컴포넌트
  Platform, // 플랫폼별 기능을 구분하는 유틸리티 (iOS/Android)
  ScrollView, // 스크롤 가능한 뷰 컴포넌트
  Alert, // 알림 다이얼로그 컴포넌트
  StatusBar, // 상태바 제어 컴포넌트
} from 'react-native';

// 내부 컴포넌트 및 훅들
import { ThemedView } from '../../components/ui/ThemedView'; // 테마가 적용된 뷰 컴포넌트
import { useThemeColor } from '../../hooks/useThemeColor'; // 테마 색상을 가져오는 커스텀 훅
import { useColorScheme } from '../../hooks/useColorScheme'; // 다크/라이트 모드 감지 훅
import { Ionicons } from '@expo/vector-icons'; // Expo에서 제공하는 아이콘 라이브러리
import { findAccountScreenStyles as styles } from '../../styles/FindAccountScreen.styles'; // 화면별 스타일 정의

// API 관련 함수들
import { sendEmailVerificationCode, verifyEmailCode, resetPassword } from '@/features/auth/authApi';

// 네비게이션 관련
import { useRouter, Stack, useFocusEffect } from 'expo-router'; // Expo Router의 네비게이션 기능들

// 시스템 UI 제어
import * as NavigationBar from 'expo-navigation-bar'; // 네비게이션 바 제어
import * as ScreenOrientation from 'expo-screen-orientation'; // 화면 방향 제어
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 안전 영역 정보 제공

/**
 * 계정 찾기 화면의 메인 컴포넌트
 * - 이메일 인증을 통한 비밀번호 재설정 기능 제공
 * - 단계별 UI 표시 (이메일 입력 → 인증 → 비밀번호 재설정)
 * - 시스템 UI 숨김 처리로 몰입감 있는 사용자 경험 제공
 */
export default function FindAccountScreen() {
  // === 안전 영역 및 테마 설정 ===
  // 안전 영역 정보 가져오기 (노치, 홈 인디케이터 등 고려)
  const insets = useSafeAreaInsets();

  // === 상태 관리 ===
  // 이메일 관련 상태
  const [email, setEmail] = useState(''); // 사용자가 입력한 이메일 주소
  const [code, setCode] = useState(''); // 이메일로 받은 인증코드
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
  const [resetToken, setResetToken] = useState(''); // 비밀번호 재설정용 토큰

  // 비밀번호 관련 상태
  const [newPassword, setNewPassword] = useState(''); // 새로 설정할 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 입력
  const [passwordError, setPasswordError] = useState<string | null>(null); // 비밀번호 유효성 검사 오류
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null); // 비밀번호 확인 오류

  // === 테마 색상 설정 ===
  // 테마에 따른 동적 색상 적용
  const primaryColor = useThemeColor('primary'); // 주요 색상 (버튼, 링크 등)
  const borderColor = useThemeColor('border'); // 테두리 색상
  const textColor = useThemeColor('text'); // 텍스트 색상
  const placeholderColor = useThemeColor('secondary'); // 플레이스홀더 색상
  const backgroundColor = useThemeColor('background'); // 배경 색상

  // 화이트모드에서만 밝은 살구색 배경 적용 (로그인 화면과 동일한 디자인)
  const colorScheme = useColorScheme(); // 현재 다크/라이트 모드 감지
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF5E6' : backgroundColor;

  // ===== 함수 정의 부분 =====

  /**
   * 시스템 UI 숨기기 함수
   * - 네비게이션 바, 상태바를 숨겨 몰입감 있는 사용자 경험 제공
   * - 세로 모드로 고정하여 일관된 레이아웃 유지
   *
   * @async
   * @function hideSystemUI
   * @returns {Promise<void>}
   */
  const hideSystemUI = async () => {
    try {
      // 네비게이션 바 숨기기 (Android 하단 네비게이션 바)
      await NavigationBar.setVisibilityAsync('hidden');
      // 상태바 숨기기 (상단 시간, 배터리 등 표시 영역)
      StatusBar.setHidden(true);
      // 전체 화면 모드 설정 (Immersive Mode) - 세로 모드로 고정
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    } catch (error) {
      console.log('시스템 UI 숨기기 실패:', error);
    }
  };

  /**
   * 시스템 UI 복원 함수
   * - 다른 화면으로 이동할 때 시스템 UI를 다시 표시
   * - 화면 방향 잠금 해제
   *
   * @async
   * @function restoreSystemUI
   * @returns {Promise<void>}
   */
  const restoreSystemUI = async () => {
    try {
      await NavigationBar.setVisibilityAsync('visible'); // 네비게이션 바 다시 표시
      StatusBar.setHidden(false); // 상태바 다시 표시
      // 화면 방향 잠금 해제 (자유로운 회전 허용)
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.log('시스템 UI 복원 실패:', error);
    }
  };

  // ===== 실행 부분 =====

  // === 시스템 UI 제어 ===
  // 화면이 포커스될 때 네비게이션 바와 상태바 숨기기 (전체화면 모드)
  useFocusEffect(
    React.useCallback(() => {
      hideSystemUI();

      // 화면이 포커스를 잃을 때 시스템 UI 복원 (cleanup 함수)
      return () => {
        restoreSystemUI();
      };
    }, []) // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행
  );

  // === 네비게이션 ===
  // 라우터 객체 (화면 간 이동을 위한 네비게이션 기능)
  const router = useRouter();

  // === 비밀번호 유효성 검사 함수들 ===
  /**
   * 비밀번호 유효성 검사 함수
   * @param password - 검사할 비밀번호
   * @returns 유효성 검사 오류 메시지 (유효하면 null)
   *
   * 검사 조건:
   * - 8자 이상
   * - 영문자 포함
   * - 숫자 포함
   * - 특수문자 포함
   */
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    // 정규식: 영문자가 하나 이상 포함되어야 함
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return '비밀번호는 영문자를 포함해야 합니다.';
    }
    // 정규식: 숫자가 하나 이상 포함되어야 함
    if (!/(?=.*[0-9])/.test(password)) {
      return '비밀번호는 숫자를 포함해야 합니다.';
    }
    // 정규식: 특수문자가 하나 이상 포함되어야 함
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return '비밀번호는 특수문자를 포함해야 합니다.';
    }
    return null; // 모든 조건을 만족하면 오류 없음
  };

  /**
   * 비밀번호 입력 핸들러
   * - 사용자가 비밀번호를 입력할 때마다 실시간 유효성 검사
   * - 오류 메시지를 상태에 저장하여 UI에 표시
   */
  const handlePasswordChange = (password: string) => {
    setNewPassword(password); // 비밀번호 상태 업데이트
    setPasswordError(validatePassword(password)); // 유효성 검사 결과 저장
  };

  /**
   * 비밀번호 확인 입력 핸들러
   * - 새 비밀번호와 확인 비밀번호가 일치하는지 검사
   * - 실시간으로 일치 여부를 확인하여 사용자에게 즉시 피드백 제공
   */
  const handleConfirmPasswordChange = (password: string) => {
    setConfirmPassword(password); // 확인 비밀번호 상태 업데이트
    if (newPassword && password !== newPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError(null); // 일치하면 오류 메시지 제거
    }
  };

  // === API 연동 핸들러 함수들 ===
  /**
   * 인증코드 전송 핸들러
   * - 사용자가 입력한 이메일로 인증코드를 전송
   * - 이메일 유효성 검사 및 서버 응답 처리
   * - 404 오류 시 "가입되지 않은 이메일" 메시지 표시
   */
  const handleSendCode = async () => {
    // 이메일 입력 검증
    if (!email) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    try {
      // API 호출: 이메일 인증코드 전송
      const result = await sendEmailVerificationCode({ email });
      Alert.alert('알림', result.message);
    } catch (error) {
      console.error(error);

      // 404 오류 처리: 가입되지 않은 이메일
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response?.status === 404
      ) {
        Alert.alert('알림', '가입되지 않은 이메일입니다.');
      } else {
        // 기타 오류 처리
        Alert.alert('오류', '인증코드 전송 중 문제가 발생했습니다.');
      }
    }
  };

  /**
   * 인증번호 확인 핸들러
   * - 사용자가 입력한 인증코드를 서버에서 검증
   * - 인증 성공 시 비밀번호 재설정 토큰을 받아서 저장
   * - 인증 완료 후 비밀번호 재설정 UI 표시
   */
  const handleVerifyCode = async () => {
    // 인증코드 입력 검증
    if (!code) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }

    try {
      // API 호출: 이메일 인증코드 검증
      const result = await verifyEmailCode({ email, code });

      if (result.status === 200) {
        // 인증 성공 처리
        setIsVerified(true); // 인증 완료 상태로 변경
        setResetToken(result.data.resetToken); // 비밀번호 재설정용 토큰 저장

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
        // 인증 실패 처리
        Alert.alert('알림', result.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '인증번호 확인 중 문제가 발생했습니다.');
    }
  };

  /**
   * 비밀번호 재설정 핸들러
   * - 모든 유효성 검사를 통과한 후 서버에 새 비밀번호 전송
   * - 인증 토큰과 함께 비밀번호 재설정 API 호출
   * - 성공 시 로그인 화면으로 자동 이동
   */
  const handleResetPassword = async () => {
    // 입력값 검증
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

    // 비밀번호 일치 검사
    if (newPassword !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 이메일 인증 완료 여부 검사
    if (!isVerified || !resetToken) {
      Alert.alert('오류', '이메일 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      // API 호출: 비밀번호 재설정
      // resetToken과 새 비밀번호를 서버에 전송
      const result = await resetPassword({
        resetToken: resetToken,
        newPassword: newPassword,
      });

      if (result.status === 200) {
        // 비밀번호 재설정 성공
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
        // 서버에서 오류 응답
        Alert.alert('오류', result.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '비밀번호 재설정 중 문제가 발생했습니다.');
    }
  };

  // === 메인 렌더링 ===
  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: finalBackgroundColor, // 테마에 따른 배경색 적용
          // 안전 영역을 고려한 패딩 설정 (최소값 보장)
          paddingTop: Math.max(insets.top, 20), // 상단: 노치 영역 고려, 최소 20px
          paddingBottom: Math.max(insets.bottom, 20), // 하단: 홈 인디케이터 고려, 최소 20px
          paddingLeft: Math.max(insets.left, 16), // 좌측: 최소 16px
          paddingRight: Math.max(insets.right, 16), // 우측: 최소 16px
        },
      ]}
    >
      {/* 네비게이션 헤더 숨김 설정 */}
      <Stack.Screen options={{ headerShown: false }} />
      {/* 상태바 숨김 설정 */}
      <StatusBar hidden />

      {/* 키보드 회피 뷰: 키보드가 올라올 때 화면 조정 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS/Android별 다른 동작
        style={{ flex: 1 }}
      >
        {/* 스크롤 가능한 컨테이너 */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1, // 내용이 적어도 전체 화면을 차지
            alignItems: 'flex-start', // 좌측 정렬
            paddingTop: 24, // 상단 여백
          }}
        >
          {/* === 상단 타이틀 및 안내문구 === */}
          <Text
            style={{
              fontSize: 28, // 큰 제목 폰트 크기
              fontWeight: 'bold', // 굵은 글씨
              color: textColor, // 테마에 따른 텍스트 색상
              marginBottom: 8, // 하단 여백
              alignSelf: 'flex-start', // 좌측 정렬
            }}
          >
            내 계정 찾기
          </Text>
          <Text
            style={{
              fontSize: 16, // 부제목 폰트 크기
              color: placeholderColor, // 보조 텍스트 색상
              marginBottom: 24, // 하단 여백
              alignSelf: 'flex-start', // 좌측 정렬
            }}
          >
            이메일 주소를 입력하세요.
          </Text>

          {/* === 이메일 입력 및 인증코드 전송 섹션 === */}
          <View style={[styles.row, { marginBottom: 16, width: '100%' }]}>
            {/* 이메일 입력 필드 */}
            <TextInput
              placeholder="이메일 주소"
              value={email}
              onChangeText={setEmail} // 이메일 상태 업데이트
              style={[styles.input, { flex: 1, borderColor, color: textColor, marginBottom: 0 }]}
              placeholderTextColor={placeholderColor} // 플레이스홀더 색상
              keyboardType="email-address" // 이메일 키보드 타입
              autoCapitalize="none" // 자동 대문자 변환 비활성화
            />
            {/* 인증코드 전송 버튼 */}
            <TouchableOpacity
              style={[
                styles.smallButton,
                styles.smallButtonMarginLeft,
                { borderColor: primaryColor }, // 테마 색상으로 테두리
              ]}
              onPress={handleSendCode} // 인증코드 전송 핸들러
            >
              <Text style={{ color: primaryColor }}>인증번호 전송</Text>
            </TouchableOpacity>
          </View>

          {/* === 인증번호 입력 및 확인 섹션 === */}
          <View style={[styles.row, { marginBottom: 16, width: '100%' }]}>
            {/* 인증번호 입력 필드 */}
            <TextInput
              placeholder="인증번호 입력"
              value={code}
              onChangeText={setCode} // 인증코드 상태 업데이트
              style={[styles.input, { flex: 1, borderColor, color: textColor, marginBottom: 0 }]}
              placeholderTextColor={placeholderColor} // 플레이스홀더 색상
              keyboardType="number-pad" // 숫자 키패드
            />
            {/* 인증번호 확인 버튼 */}
            <TouchableOpacity
              style={[
                styles.smallButton,
                styles.smallButtonMarginLeft,
                { borderColor: primaryColor }, // 테마 색상으로 테두리
              ]}
              onPress={handleVerifyCode} // 인증번호 확인 핸들러
            >
              <Text style={{ color: primaryColor }}>확인</Text>
            </TouchableOpacity>
          </View>
          {/* === 비밀번호 재설정 섹션 (인증 성공 시에만 표시) === */}
          {isVerified && (
            <>
              {/* 비밀번호 재설정 제목 */}
              <Text
                style={{
                  fontSize: 20, // 중간 크기 제목
                  fontWeight: 'bold', // 굵은 글씨
                  color: textColor, // 테마에 따른 텍스트 색상
                  marginTop: 32, // 상단 여백 (이전 섹션과의 간격)
                  marginBottom: 16, // 하단 여백
                  alignSelf: 'flex-start', // 좌측 정렬
                }}
              >
                새 비밀번호 설정
              </Text>

              {/* 비밀번호 재설정 안내문 */}
              <Text
                style={{
                  fontSize: 14, // 작은 폰트 크기
                  color: placeholderColor, // 보조 텍스트 색상
                  marginBottom: 24, // 하단 여백
                  alignSelf: 'flex-start', // 좌측 정렬
                }}
              >
                새로운 비밀번호를 입력해주세요.
              </Text>

              {/* 새 비밀번호 입력 필드 */}
              <TextInput
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChangeText={handlePasswordChange} // 실시간 유효성 검사 포함
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor} // 플레이스홀더 색상
                secureTextEntry // 비밀번호 숨김 처리
              />

              {/* 비밀번호 요구사항 안내 */}
              <Text
                style={{
                  fontSize: 12, // 작은 폰트 크기
                  color: placeholderColor, // 보조 텍스트 색상
                  marginTop: 4, // 상단 여백
                  marginBottom: 8, // 하단 여백
                  alignSelf: 'flex-start', // 좌측 정렬
                }}
              >
                • 8자 이상 • 영문자 포함 • 숫자 포함 • 특수문자 포함
              </Text>

              {/* 비밀번호 유효성 검사 오류 메시지 */}
              {passwordError && (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 8 }}>{passwordError}</Text>
              )}

              {/* 비밀번호 확인 입력 필드 */}
              <TextInput
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange} // 일치 여부 실시간 검사
                style={[styles.input, { borderColor, color: textColor, width: '100%' }]}
                placeholderTextColor={placeholderColor} // 플레이스홀더 색상
                secureTextEntry // 비밀번호 숨김 처리
              />

              {/* 비밀번호 확인 오류 메시지 */}
              {confirmPasswordError && (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 8 }}>
                  {confirmPasswordError}
                </Text>
              )}

              {/* 비밀번호 재설정 버튼 */}
              <TouchableOpacity
                style={[
                  styles.mainButton,
                  {
                    backgroundColor: '#2D5016', // 진한 녹색 배경
                    alignSelf: 'stretch', // 전체 너비 사용
                    // 입력값이 유효하지 않으면 버튼 비활성화 (투명도 50%)
                    opacity:
                      !newPassword || !confirmPassword || passwordError || confirmPasswordError
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={handleResetPassword} // 비밀번호 재설정 핸들러
                disabled={
                  // 모든 조건이 만족되어야 버튼 활성화
                  !newPassword || !confirmPassword || !!passwordError || !!confirmPasswordError
                }
              >
                <Text style={styles.mainButtonText}>비밀번호 재설정</Text>
              </TouchableOpacity>
            </>
          )}

          {/* === 로그인으로 돌아가기 링크 === */}
          <View
            style={{
              flexDirection: 'row', // 가로 배치
              justifyContent: 'center', // 중앙 정렬
              marginTop: 16, // 상단 여백
              width: '100%', // 전체 너비
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                style={{
                  fontSize: 14, // 작은 폰트 크기
                  fontWeight: 'bold', // 굵은 글씨
                  color: '#5A7C65', // 녹색 계열 색상
                }}
              >
                로그인으로 돌아가기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

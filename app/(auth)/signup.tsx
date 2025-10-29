// app/(auth)/signup.tsx
// 회원가입 화면 컴포넌트
// 사용자 회원가입을 처리하는 화면
// 5단계로 나누어진 회원가입 프로세스 (이름 → 이메일 → 비밀번호 → 닉네임 → 역할선택)
// 각 단계별 유효성 검사 및 중복 확인 기능 포함

// React: React 라이브러리의 기본 기능들
import React, { useState } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  TextInput, // 텍스트 입력 컴포넌트 (input과 비슷한 역할)
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  Alert, // 알림 팝업 표시용
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  KeyboardAvoidingView, // 키보드가 올라올 때 화면을 조정해주는 컴포넌트
  Platform, // iOS/Android 플랫폼 구분용
  ScrollView, // 스크롤 가능한 컨테이너
  StatusBar, // 상단 상태바 제어용
} from 'react-native';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router, Stack, useFocusEffect } from 'expo-router';
// Expo Navigation Bar: 하단 네비게이션 바 제어용
import * as NavigationBar from 'expo-navigation-bar';
// Expo Screen Orientation: 화면 방향(가로/세로) 제어용
import * as ScreenOrientation from 'expo-screen-orientation';
// React Native Safe Area: 노치나 상태바 영역을 피해 안전한 영역 계산
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 커스텀 테마 컴포넌트들
import { ThemedView } from '../../components/ui/ThemedView'; // 테마가 적용된 View 컴포넌트
import { ThemedText } from '../../components/ui/ThemedText'; // 테마가 적용된 Text 컴포넌트
// 회원가입 화면 전용 스타일
import { signupScreenStyles as styles } from '../../styles/SignupScreen.styles';
// 테마 관련 훅들
import { useThemeColor } from '../../hooks/useThemeColor'; // 테마 색상 가져오기
import { useColorScheme } from '../../hooks/useColorScheme'; // 다크모드/라이트모드 구분
// 아이콘 라이브러리
import { Ionicons } from '@expo/vector-icons';
// 인증 관련 API 함수들
import { signup, checkEmail } from '@/features/auth/authApi'; // 회원가입, 이메일 중복확인
import { checkNicknameExists } from '@/shared/api/authApi'; // 닉네임 중복확인
// 타입 정의
import type { SignupRequest } from '@/features/auth/types';

export default function SignupScreen() {
  // 안전 영역 정보 가져오기 (노치, 상태바 등을 피한 안전한 영역)
  const insets = useSafeAreaInsets();

  // 단계별 입력값 상태 관리 (5단계 회원가입 프로세스)
  const [step, setStep] = useState(1); // 현재 회원가입 단계 (1~5)
  const [lastName, setLastName] = useState(''); // 사용자가 입력한 성
  const [firstName, setFirstName] = useState(''); // 사용자가 입력한 이름
  const [email, setEmail] = useState(''); // 사용자가 입력한 이메일 주소
  const [password, setPassword] = useState(''); // 사용자가 입력한 비밀번호
  const [nickname, setNickname] = useState(''); // 사용자가 입력한 닉네임
  const [role, setRole] = useState<'admin' | 'parent'>('parent'); // 사용자 역할 (관리자/부모)
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복 확인 완료 여부
  const [nicknameChecked, setNicknameChecked] = useState(false); // 닉네임 중복 확인 완료 여부

  // 로딩 상태 관리 (사용자 경험 개선을 위한 로딩 표시)
  const [isLoading, setIsLoading] = useState(false); // 전체 회원가입 진행 중 여부
  const [isEmailChecking, setIsEmailChecking] = useState(false); // 이메일 중복 확인 진행 중 여부
  const [isNicknameChecking, setIsNicknameChecking] = useState(false); // 닉네임 중복 확인 진행 중 여부

  // 테마 색상 가져오기 (다크모드/라이트모드에 따른 동적 색상)
  const placeholderColor = useThemeColor('secondary'); // 입력 필드 플레이스홀더 색상
  const backgroundColor = useThemeColor('background'); // 화면 배경 색상
  const textColor = useThemeColor('text'); // 텍스트 색상
  const primaryColor = useThemeColor('primary'); // 주요 색상
  const cardColor = useThemeColor('card'); // 카드/버튼 배경 색상
  const borderColor = useThemeColor('border'); // 테두리 색상

  // 화이트모드에서만 밝은 살구색 배경 적용 (로그인 화면과 동일한 디자인)
  const colorScheme = useColorScheme(); // 현재 테마 모드 (light/dark)
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
      // 네비게이션 바 숨기기 (하단 시스템 네비게이션 바)
      await NavigationBar.setVisibilityAsync('hidden');
      // 상태바 숨기기 (상단 시간, 배터리 등이 표시되는 영역)
      StatusBar.setHidden(true);
      // 전체 화면 모드 설정 (Immersive Mode - 세로 모드 고정)
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
      // 화면 방향 잠금 해제 (자유로운 화면 회전 허용)
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.log('시스템 UI 복원 실패:', error);
    }
  };

  /**
   * 회원가입 처리 함수
   * - 5단계 입력 완료 후 최종 회원가입 실행
   * - 사용자 입력 데이터를 서버에 전송하여 계정 생성
   *
   * @async
   * @function handleSignup
   * @returns {Promise<void>}
   */
  const handleSignup = async () => {
    // 이미 로딩 중이면 중복 요청 방지 (사용자가 여러 번 버튼을 누르는 것 방지)
    if (isLoading) return;

    setIsLoading(true); // 로딩 상태 시작 (버튼 비활성화 및 로딩 텍스트 표시)

    try {
      // 사용자 입력 데이터로 회원가입 요청 객체 생성
      const formData: SignupRequest = {
        email, // 이메일 주소
        password, // 비밀번호
        name: `${lastName} ${firstName}`.trim(), // 성과 이름을 합쳐서 전체 이름 생성
        nickname, // 닉네임
        role, // 사용자 역할 (admin/parent)
      };

      console.log('📝 회원가입 요청 데이터:', formData);

      // 실제 회원가입 API 호출 (서버에 사용자 정보 전송)
      const result = await signup(formData);

      console.log('✅ 회원가입 완료:', result);

      // 성공 시 알림 표시 후 로그인 화면으로 이동
      Alert.alert('회원가입 완료! 🎉', `${result.message}\n로그인 화면으로 이동합니다.`, [
        {
          text: '확인',
          onPress: () => router.replace('/(auth)'), // 로그인 화면으로 이동
        },
      ]);
    } catch (error: unknown) {
      console.error('❌ 회원가입 실패:', error);

      // 에러 메시지 생성 (다양한 에러 타입에 대응)
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : '회원가입 중 문제가 발생했습니다.';

      // 에러 알림 표시 (사용자에게 친화적인 에러 메시지)
      Alert.alert('회원가입 실패 ❌', message, [{ text: '다시 시도', style: 'default' }]);
    } finally {
      setIsLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 이메일 중복 확인 함수
   * - 2단계에서 이메일 사용 가능 여부 확인
   * - 서버에 이메일 중복 확인 요청을 보내고 결과에 따라 상태 업데이트
   *
   * @async
   * @function handleEmailCheck
   * @returns {Promise<void>}
   */
  const handleEmailCheck = async () => {
    // 이메일 입력 검증 (기본적인 이메일 형식 확인)
    if (!email || !email.includes('@')) {
      Alert.alert('오류', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    // 이미 확인 중이면 중복 요청 방지 (사용자가 여러 번 버튼을 누르는 것 방지)
    if (isEmailChecking) return;

    setIsEmailChecking(true); // 로딩 상태 시작 (버튼 비활성화 및 "확인중..." 텍스트 표시)

    try {
      console.log('📧 이메일 중복 확인 요청:', email);
      // 서버에 이메일 중복 확인 요청
      const result = await checkEmail({ email });

      if (result.data) {
        // 이메일 사용 가능한 경우
        Alert.alert('사용 가능 ✅', '사용 가능한 이메일입니다.');
        setEmailChecked(true); // 중복 확인 완료 상태로 설정
        console.log('✅ 이메일 사용 가능:', email);
      } else {
        // 이메일이 이미 사용 중인 경우
        Alert.alert('중복 이메일 ❌', '이미 사용 중인 이메일입니다.');
        setEmailChecked(false); // 중복 확인 실패 상태로 설정
        console.log('❌ 이메일 중복:', email);
      }
    } catch (error) {
      // 네트워크 오류나 서버 오류 발생 시
      console.error('❌ 이메일 중복 확인 실패:', {
        email,
        error,
        timestamp: new Date().toISOString(),
      });
      setEmailChecked(false); // 중복 확인 실패 상태로 설정
      Alert.alert('확인 실패', '이메일 중복 확인 중 문제가 발생했습니다.');
    } finally {
      setIsEmailChecking(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 닉네임 중복 확인 함수
   * - 4단계에서 닉네임 사용 가능 여부 확인
   * - 서버에 닉네임 중복 확인 요청을 보내고 결과에 따라 상태 업데이트
   *
   * @async
   * @function handleNicknameCheck
   * @returns {Promise<void>}
   */
  const handleNicknameCheck = async () => {
    // 닉네임 입력 검증 (최소 2자 이상 입력 확인)
    if (!nickname || nickname.length < 2) {
      Alert.alert('오류', '닉네임을 2자 이상 입력해주세요.');
      return;
    }

    // 이미 확인 중이면 중복 요청 방지 (사용자가 여러 번 버튼을 누르는 것 방지)
    if (isNicknameChecking) return;

    setIsNicknameChecking(true); // 로딩 상태 시작 (버튼 비활성화 및 "확인중..." 텍스트 표시)

    try {
      console.log('🏷️ 닉네임 중복 확인 요청:', nickname);
      // 서버에 닉네임 중복 확인 요청
      const result = await checkNicknameExists({ nickname });

      if (result.data) {
        // 닉네임 사용 가능한 경우
        Alert.alert('사용 가능 ✅', '사용 가능한 닉네임입니다.');
        setNicknameChecked(true); // 중복 확인 완료 상태로 설정
        console.log('✅ 닉네임 사용 가능:', nickname);
      } else {
        // 닉네임이 이미 사용 중인 경우
        Alert.alert('중복 닉네임 ❌', '이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false); // 중복 확인 실패 상태로 설정
        console.log('❌ 닉네임 중복:', nickname);
      }
    } catch (error) {
      // 네트워크 오류나 서버 오류 발생 시
      console.error('❌ 닉네임 중복 확인 실패:', {
        nickname,
        error,
        timestamp: new Date().toISOString(),
      });
      setNicknameChecked(false); // 중복 확인 실패 상태로 설정
      Alert.alert('확인 실패', '닉네임 중복 확인 중 문제가 발생했습니다.');
    } finally {
      setIsNicknameChecking(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  /**
   * 단계별 유효성 검사 및 다음 단계 이동 함수
   * - 각 단계별 입력 검증 후 다음 단계로 진행
   * - 5단계에서는 최종 회원가입 실행
   *
   * @function handleNext
   */
  const handleNext = () => {
    if (step === 1) {
      // 1단계: 이름 입력 검증
      if (!lastName || !firstName) {
        Alert.alert('오류', '성을 포함한 이름을 입력해 주세요.');
        return;
      }
      console.log('👤 이름 입력 완료:', { lastName, firstName });
    }
    if (step === 2) {
      // 2단계: 이메일 입력 및 중복 확인 검증
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
      // 3단계: 비밀번호 입력 검증
      if (!password || password.length < 6) {
        Alert.alert('오류', '비밀번호를 6자 이상 입력해 주세요.');
        return;
      }
      console.log('🔒 비밀번호 입력 완료:', { passwordLength: password.length });
    }
    if (step === 4) {
      // 4단계: 닉네임 입력 및 중복 확인 검증
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
      // 5단계: 최종 회원가입 실행
      console.log('🚀 최종 회원가입 단계 - 프로필 생성 시작');
      handleSignup();
      return;
    }
    // 다음 단계로 이동 (현재 단계 + 1)
    setStep((prev) => prev + 1);
  };

  /**
   * 이전 단계로 이동 함수
   * - 1단계에서는 이전 버튼이 표시되지 않음
   *
   * @function handlePrev
   */
  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  /**
   * 단계별 입력 UI 렌더링 함수
   * - 현재 단계에 따라 다른 입력 폼 표시
   * - 5단계 회원가입 프로세스의 각 단계별 UI 구성
   *
   * @function renderStep
   * @returns {JSX.Element | null} - 현재 단계에 해당하는 UI 컴포넌트
   */
  const renderStep = () => {
    switch (step) {
      case 1:
        // 1단계: 이름 입력 (성과 이름을 분리하여 입력)
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
        // 2단계: 이메일 입력 및 중복 확인
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
                  setEmailChecked(false); // 이메일 변경 시 중복 확인 상태 초기화
                }}
                autoCapitalize="none" // 자동 대문자 변환 비활성화
                keyboardType="email-address" // 이메일 키보드 타입 설정
              />
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: '#2D5016' }]}
                onPress={handleEmailCheck}
                disabled={isEmailChecking} // 확인 중일 때 버튼 비활성화
              >
                <ThemedText style={{ color: cardColor }}>
                  {isEmailChecking ? '확인중...' : '중복확인'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case 3:
        // 3단계: 비밀번호 입력
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
              secureTextEntry // 비밀번호 숨김 처리
            />
          </>
        );
      case 4:
        // 4단계: 닉네임 입력 및 중복 확인
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
                  setNicknameChecked(false); // 닉네임 변경 시 중복 확인 상태 초기화
                }}
              />
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: '#2D5016' }]}
                onPress={handleNicknameCheck}
                disabled={isNicknameChecking} // 확인 중일 때 버튼 비활성화
              >
                <ThemedText style={{ color: cardColor }}>
                  {isNicknameChecking ? '확인중...' : '중복확인'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        );
      case 5:
        // 5단계: 역할 선택 (관리자 또는 부모)
        return (
          <>
            <ThemedText style={[styles.title, { color: textColor }]}>역할을 선택하세요</ThemedText>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  {
                    backgroundColor: role === 'admin' ? '#2D5016' : cardColor, // 선택된 역할에 따라 배경색 변경
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
                    backgroundColor: role === 'parent' ? '#2D5016' : cardColor, // 선택된 역할에 따라 배경색 변경
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

  // ===== 실행 부분 =====

  // 화면이 포커스될 때 네비게이션 바와 상태바 숨기기 (몰입형 경험 제공)
  useFocusEffect(
    React.useCallback(() => {
      hideSystemUI();

      // 화면이 포커스를 잃을 때 시스템 UI 복원 (다른 화면으로 이동 시)
      return () => {
        restoreSystemUI();
      };
    }, [])
  );

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: finalBackgroundColor, // 테마에 따른 배경색 적용
          paddingTop: Math.max(insets.top, 20), // 최소 20px 여백 보장 (노치 영역 고려)
          paddingBottom: Math.max(insets.bottom, 20), // 최소 20px 여백 보장 (홈 인디케이터 영역 고려)
          paddingLeft: Math.max(insets.left, 16), // 최소 16px 여백 보장
          paddingRight: Math.max(insets.right, 16), // 최소 16px 여백 보장
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS와 Android에서 키보드 대응 방식 다르게 설정
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>
            <View style={styles.formContainer}>
              {/* 단계별 입력 UI (현재 단계에 따라 다른 폼 표시) */}
              {renderStep()}

              {/* 이전/다음 버튼 (단계별 네비게이션) */}
              <View
                style={{ flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' }}
              >
                {step > 1 && (
                  // 1단계가 아닐 때만 이전 버튼 표시
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
                  disabled={step === 5 && isLoading} // 5단계에서 회원가입 진행 중일 때 버튼 비활성화
                >
                  <ThemedText style={[styles.signupButtonText, { color: cardColor }]}>
                    {step === 5 ? (isLoading ? '프로필 생성중...' : '프로필 생성하기') : '계속하기'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* 로그인 페이지로 이동 링크 */}
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText style={[styles.linkText, { color: '#5A7C65' }]}>
                    로그인으로 돌아가기
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {/* 하단 안내 문구 (이용약관 및 개인정보처리방침 동의 안내) */}
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

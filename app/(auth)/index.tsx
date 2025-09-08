/**
 * 로그인 화면 컴포넌트
 *
 * 사용자가 이메일과 비밀번호로 로그인하고 메인 앱으로 이동하는 화면입니다.
 * 약관 동의 후 진입하는 첫 번째 인증 화면으로, 성공 시 프로필 선택 화면으로 이동합니다.
 *
 * 주요 기능:
 * - 이메일/비밀번호 로그인
 * - 토큰 관리 및 자동 갱신
 * - 소셜 로그인 UI (현재 비활성화)
 * - 시스템 UI 숨김 처리 (전체화면 모드)
 * - 회원가입/계정 찾기 링크
 * - 뒤로가기 버튼 비활성화
 */

// React: React 라이브러리의 기본 기능들
// { useState }: React에서 제공하는 Hook 중 하나 (상태 관리용)
import React, { useState } from 'react';

// React Native: 모바일 앱 개발을 위한 UI 컴포넌트들
import {
  TextInput, // 텍스트 입력 컴포넌트 (input과 비슷한 역할)
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트 (button)
  Alert, // 알림 다이얼로그 컴포넌트
  View, // 컨테이너 뷰 컴포넌트 (div와 비슷한 역할)
  Image, // 이미지 표시 컴포넌트
  KeyboardAvoidingView, // 키보드가 올라올 때 화면을 조정하는 컴포넌트
  Platform, // 플랫폼별 기능을 구분하는 유틸리티 (iOS/Android)
  BackHandler, // 하드웨어 뒤로가기 버튼 처리
  StatusBar, // 상태바 제어 컴포넌트
} from 'react-native';

// 안전 영역 및 네비게이션 관련
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 안전 영역 정보 제공
import { router, useFocusEffect, Stack } from 'expo-router'; // Expo Router의 네비게이션 기능들

// 시스템 UI 제어
import * as NavigationBar from 'expo-navigation-bar'; // 네비게이션 바 제어
import * as ScreenOrientation from 'expo-screen-orientation'; // 화면 방향 제어

// 내부 컴포넌트 및 훅들
import { ThemedView } from '../../components/ui/ThemedView'; // 테마가 적용된 뷰 컴포넌트
import { ThemedText } from '../../components/ui/ThemedText'; // 테마가 적용된 텍스트 컴포넌트
import { loginScreenStyles as styles } from '../../styles/LoginScreen.styles'; // 화면별 스타일 정의
import { useThemeColor } from '../../hooks/useThemeColor'; // 테마 색상을 가져오는 커스텀 훅
import { useColorScheme } from '../../hooks/useColorScheme'; // 다크/라이트 모드 감지 훅
import { Ionicons } from '@expo/vector-icons'; // Expo에서 제공하는 아이콘 라이브러리

// 이미지 리소스
import facebookIcon from '../../assets/images/facebook.png'; // 페이스북 로그인 아이콘
import googleIcon from '../../assets/images/google.png'; // 구글 로그인 아이콘

// API 관련 함수들
import { login, startTokenRefreshManager, refreshAccessToken } from '@/shared/api/authApi'; // 인증 API 함수들
// import { signup } from '@/shared/api/authApi'; // 빠른 회원가입 함수 주석처리로 인해 임시 제거

// 로컬 저장소
import AsyncStorage from '@react-native-async-storage/async-storage'; // 비동기 로컬 저장소

// UI 컴포넌트
import { Popup } from '@/components/ui/Popup'; // 팝업 컴포넌트

// 구글 로그인 관련 (현재 비활성화)
// import { useGoogleAuth, processGoogleLogin } from '@/shared/config/googleSignIn';

/**
 * 로그인 화면의 메인 컴포넌트
 * - 이메일/비밀번호 로그인 기능 제공
 * - 토큰 관리 및 자동 갱신 처리
 * - 시스템 UI 숨김으로 몰입감 있는 사용자 경험 제공
 * - 약관 동의 후 진입하는 첫 번째 인증 화면
 */
export default function LoginScreen() {
  // === 구글 로그인 관련 (현재 비활성화) ===
  // 구글 로그인 훅 사용 (현재 사용하지 않음)
  // const { request, response, promptAsync } = useGoogleAuth();

  // === 안전 영역 및 테마 설정 ===
  // 안전 영역 정보 가져오기 (노치, 홈 인디케이터 등 고려)
  const insets = useSafeAreaInsets();

  // === 상태 관리 ===
  // 입력 필드 상태 관리
  const [email, setEmail] = useState(''); // 사용자가 입력한 이메일 주소
  const [password, setPassword] = useState(''); // 사용자가 입력한 비밀번호
  const [isLoading, setIsLoading] = useState(false); // 로그인 처리 중 여부
  const [showErrorPopup, setShowErrorPopup] = useState(false); // 에러 팝업 표시 여부
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용

  // === 테마 색상 설정 ===
  // 테마에 따른 동적 색상 적용
  const placeholderColor = useThemeColor('secondary'); // 플레이스홀더 색상
  const dividerColor = useThemeColor('text'); // 구분선 색상
  const backgroundColor = useThemeColor('background'); // 배경 색상
  const textColor = useThemeColor('text'); // 텍스트 색상
  const primaryColor = useThemeColor('primary'); // 주요 색상 (버튼, 링크 등)
  const cardColor = useThemeColor('card'); // 카드 배경 색상
  const borderColor = useThemeColor('border'); // 테두리 색상

  // 화이트모드에서만 밝은 살구색 배경 적용 (일관된 디자인)
  const colorScheme = useColorScheme(); // 현재 다크/라이트 모드 감지
  const finalBackgroundColor = colorScheme === 'light' ? '#FFF5E6' : backgroundColor;

  // === 시스템 UI 제어 ===
  // 컴포넌트 마운트 시 시스템 UI 숨기기 (최초 실행 대응)
  React.useEffect(() => {
    /**
     * 컴포넌트 마운트 시 시스템 UI 숨기기 함수
     * - 네비게이션 바, 상태바를 숨겨 몰입감 있는 사용자 경험 제공
     * - 여러 번 시도하여 안정성 확보
     * - 세로 모드로 고정하여 일관된 레이아웃 유지
     */
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

        // 상태바 숨기기 (상단 시간, 배터리 등 표시 영역)
        StatusBar.setHidden(true);

        // 전체 화면 모드 설정 (Immersive Mode) - 세로 모드로 고정
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

        // 추가 지연 후 한 번 더 시도 (안정성 확보)
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
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시에만 실행

  // 화면이 포커스될 때 네비게이션 바와 상태바 숨기기
  useFocusEffect(
    React.useCallback(() => {
      /**
       * 화면 포커스 시 시스템 UI 숨기기 함수
       * - 다른 화면에서 돌아올 때마다 시스템 UI를 다시 숨김
       * - 여러 번 시도하여 안정성 확보
       * - 세로 모드로 고정하여 일관된 레이아웃 유지
       */
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

          // 상태바 숨기기 (상단 시간, 배터리 등 표시 영역)
          StatusBar.setHidden(true);

          // 전체 화면 모드 설정 (Immersive Mode) - 세로 모드로 고정
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

          // 추가 지연 후 한 번 더 시도 (안정성 확보)
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

      // 화면이 포커스를 잃을 때 시스템 UI 복원 (cleanup 함수)
      return () => {
        /**
         * 시스템 UI 복원 함수
         * - 다른 화면으로 이동할 때 시스템 UI를 다시 표시
         * - 화면 방향 잠금 해제
         */
        const restoreSystemUI = async () => {
          try {
            console.log('🔄 화면 포커스 해제 시 시스템 UI 복원 시작');
            await NavigationBar.setVisibilityAsync('visible'); // 네비게이션 바 다시 표시
            StatusBar.setHidden(false); // 상태바 다시 표시
            // 화면 방향 잠금 해제 (자유로운 회전 허용)
            await ScreenOrientation.unlockAsync();
          } catch (error) {
            console.log('❌ 시스템 UI 복원 실패:', error);
          }
        };
        restoreSystemUI();
      };
    }, []) // 빈 의존성 배열: 화면 포커스 시에만 실행
  );

  // === 뒤로가기 버튼 처리 ===
  // 뒤로가기 버튼 처리 - 로그인 화면에서 뒤로가기 시 아무것도 하지 않음
  useFocusEffect(
    React.useCallback(() => {
      /**
       * 하드웨어 뒤로가기 버튼 처리 함수
       * - 로그인 화면에서 뒤로가기 버튼을 누르면 아무것도 하지 않음
       * - 약관 동의 후 로그인 화면이므로 뒤로가기 비활성화
       * - 사용자가 실수로 뒤로가기를 눌러도 앱이 종료되지 않도록 방지
       */
      const onBackPress = () => {
        // 로그인 화면에서 뒤로가기 버튼을 누르면 아무것도 하지 않음
        // 약관 동의 후 로그인 화면이므로 뒤로가기 비활성화
        return true; // 이벤트 처리 완료 (뒤로가기 방지)
      };

      // 하드웨어 뒤로가기 버튼 이벤트 리스너 등록
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // cleanup: 이벤트 리스너 제거
      return () => subscription.remove();
    }, []) // 빈 의존성 배열: 화면 포커스 시에만 실행
  );

  // === 구글 로그인 관련 (현재 비활성화) ===
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

  // === 로그인 핸들러 ===
  /**
   * 로그인 버튼 클릭 시 실행되는 함수
   * - 이메일/비밀번호 유효성 검사
   * - 기존 토큰 정리 후 새로운 로그인 시도
   * - 토큰 저장 및 자동 갱신 매니저 시작
   * - 성공 시 프로필 선택 화면으로 이동
   * - 실패 시 사용자 친화적인 에러 메시지 표시
   */
  const handleLogin = async () => {
    // 입력값 유효성 검사
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true); // 로딩 상태 시작

    // 로그인 시도 전에 기존 토큰들을 정리합니다 (보안 및 안정성)
    try {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'tokenIssuedAt']);
      console.log('🧹 로그인 시도 전 기존 토큰 정리 완료');
    } catch (cleanupError) {
      console.error('❌ 토큰 정리 실패:', cleanupError);
    }

    try {
      console.log('로그인 시작:', { email, password });
      // API 호출: 로그인 요청
      const res = await login({ email, password });
      console.log('로그인 결과:', res);

      // 상세한 조건 확인 로그 (디버깅용)
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

        // 토큰 갱신 매니저 시작 (자동 토큰 갱신)
        try {
          await startTokenRefreshManager();
          console.log('✅ 토큰 갱신 매니저 시작 완료');
        } catch (error) {
          console.error('❌ 토큰 갱신 매니저 시작 실패:', error);
        }

        // 로그인 성공 시 프로필 선택 화면으로 이동
        console.log('🔄 화면 전환 시작 - 프로필 선택 화면으로 이동');
        router.replace('/(profile)');
        console.log('✅ 화면 전환 명령 완료');
      } else {
        // 로그인 실패 처리
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
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // === 빠른 회원가입 함수 (현재 비활성화) ===
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

      {/* 키보드 회피 뷰: 키보드가 올라올 때 화면 조정 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS/Android별 다른 동작
        style={{ flex: 1 }}
      >
        {/* === 입력 및 로그인 영역 === */}
        <View style={[styles.formContainer, { paddingTop: 20 }]}>
          {/* 로그인 제목 */}
          <ThemedText style={[styles.title, { color: textColor }]}>로그인</ThemedText>

          {/* 이메일 입력 필드 */}
          <View style={styles.inputContainer}>
            {/* 이메일 아이콘 */}
            <Ionicons
              name="mail-outline"
              size={20}
              color={placeholderColor}
              style={styles.inputIcon}
            />
            {/* 이메일 입력창 */}
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="이메일"
              placeholderTextColor={placeholderColor} // 플레이스홀더 색상
              value={email}
              onChangeText={setEmail} // 이메일 상태 업데이트
              autoCapitalize="none" // 자동 대문자 변환 비활성화
              keyboardType="email-address" // 이메일 키보드 타입
            />
          </View>

          {/* 비밀번호 입력 필드 */}
          <View style={styles.inputContainer}>
            {/* 비밀번호 아이콘 */}
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={placeholderColor}
              style={styles.inputIcon}
            />
            {/* 비밀번호 입력창 */}
            <TextInput
              style={[styles.input, { borderColor, color: textColor }]}
              placeholder="비밀번호"
              placeholderTextColor={placeholderColor} // 플레이스홀더 색상
              value={password}
              onChangeText={setPassword} // 비밀번호 상태 업데이트
              secureTextEntry // 비밀번호 숨김 처리
            />
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: '#2D5016' }]} // 진한 녹색 배경
            onPress={handleLogin} // 로그인 핸들러
            disabled={isLoading} // 로딩 중일 때 비활성화
          >
            <ThemedText style={[styles.loginButtonText, { color: cardColor }]}>
              {isLoading ? '로그인 중...' : '로그인'} {/* 로딩 상태에 따른 텍스트 변경 */}
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

          {/* 회원가입/계정 찾기 링크 */}
          <View style={styles.linkContainer}>
            {/* 회원가입 링크 */}
            <TouchableOpacity onPress={() => router.push('./signup')}>
              <ThemedText style={[styles.linkText, { color: '#2D5016' }]}>회원가입</ThemedText>
            </TouchableOpacity>
            {/* 구분선 */}
            <ThemedText style={{ color: dividerColor }}> | </ThemedText>
            {/* 계정 찾기 링크 */}
            <TouchableOpacity onPress={() => router.push('./find-account')}>
              <ThemedText style={[styles.linkText, { color: '#2D5016' }]}>
                아이디/비밀번호 찾기
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* === 하단 소셜 로그인 + 안내 === */}
      <View style={styles.footerContainer}>
        {/* 소셜 로그인 버튼들 */}
        <View style={styles.socialButtonRow}>
          {/* 페이스북 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]} // 테마 색상으로 테두리
            onPress={() => Alert.alert('페이스북 로그인 눌림')} // 임시 알림 (현재 비활성화)
          >
            <Image source={facebookIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Facebook</ThemedText>
          </TouchableOpacity>

          {/* 구글 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: primaryColor }]} // 테마 색상으로 테두리
            onPress={() => Alert.alert('구글 로그인 눌림')} // 임시 알림 (현재 비활성화)
          >
            <Image source={googleIcon} style={styles.socialIcon} />
            <ThemedText style={[styles.socialText, { color: textColor }]}>Google</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 약관 동의 안내문 */}
        <ThemedText style={[styles.notice, { color: placeholderColor }]}>
          StoryCraft에 가입함으로써 StoryCraft의 이용 약관 및{'\n'}
          개인정보처리방침에 동의하게 됩니다.
        </ThemedText>
      </View>

      {/* === 에러 팝업 === */}
      <Popup
        visible={showErrorPopup} // 팝업 표시 여부
        onClose={() => setShowErrorPopup(false)} // 팝업 닫기 핸들러
        title="로그인 실패"
        message={errorMessage} // 에러 메시지 내용
        confirmText="확인"
      />
    </ThemedView>
  );
}

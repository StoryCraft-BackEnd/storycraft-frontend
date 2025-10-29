/**
 * StoryCraft 메인 화면 컴포넌트
 *
 * 개발 및 테스트를 위한 메인 화면입니다.
 * 다양한 기능들을 테스트할 수 있는 버튼들을 제공합니다.
 *
 * 주요 기능:
 * - 서버 연결 테스트
 * - 로딩 화면 테스트
 * - 404 화면 테스트
 * - 팝업 테스트
 * - 약관 동의 관리
 * - 화면 간 네비게이션
 */
import React, { useState, useEffect } from 'react';
// { useState, useEffect }: React Hook들 (상태 관리와 생명주기 관리)
import { TouchableOpacity, Alert } from 'react-native';
// TouchableOpacity: 터치 가능한 버튼 컴포넌트, Alert: 모바일에서 팝업 알림을 표시하는 컴포넌트
import { router } from 'expo-router';
// router: 화면 간 이동을 위한 네비게이션 객체

import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { checkServerConnection } from '@/shared/api/client';

// 스타일과 훅을 가져옵니다
import { homeScreenStyles as styles } from '@/styles/HomeScreen.styles';
// as styles: homeScreenStyles를 styles라는 이름으로 가져옴 (별칭)
import { useThemeColor } from '@/hooks/useThemeColor';

// UI 컴포넌트들을 가져옵니다
import { Popup } from '@/components/ui/Popup';
import { NotFoundScreen } from '@/components/ui/NotFoundScreen';
import sleepcharacter from '@/assets/images/character/sleep.png';
import { clearTermsAgreement } from '@/shared/utils/termsUtils';

// 메인 컴포넌트 함수 정의
// export default: 이 파일을 import할 때 기본으로 가져올 컴포넌트
export default function HomeScreen() {
  // 상태 관리 - useState Hook 사용
  // const [상태변수, 상태변경함수] = useState(초기값);

  // 초기 로딩 상태 (앱 시작 시 로딩 화면 표시 여부)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // true: 로딩 화면 표시, false: 로딩 화면 숨김

  // 로딩 화면 표시 여부 (버튼 클릭 시 로딩 화면 표시)
  const [showLoading, setShowLoading] = useState(false);
  // true: 로딩 화면 표시, false: 로딩 화면 숨김

  // 서버 연결 상태 (null: 확인 중, true: 연결됨, false: 연결 실패)
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  // <boolean | null>: TypeScript 타입 정의 (boolean 또는 null)

  // 팝업 표시 여부
  const [showPopup, setShowPopup] = useState(false);
  // true: 팝업 표시, false: 팝업 숨김

  // 404 화면 표시 여부
  const [showNotFound, setShowNotFound] = useState(false);
  // true: 404 화면 표시, false: 404 화면 숨김

  // 로딩 메시지 텍스트
  const [loadingMessage, setLoadingMessage] = useState('');
  // 빈 문자열: 기본 메시지 사용, 문자열: 커스텀 메시지 사용

  // 테스트 화면 표시 여부
  const [showTestScreen, setShowTestScreen] = useState(false);
  // true: 테스트 화면 표시, false: 홈 화면 표시

  // 테마 색상 가져오기 (useThemeColor 훅 사용)
  const backgroundColor = useThemeColor('background');
  // useThemeColor('background'): 테마에 따른 배경색 반환

  const textColor = useThemeColor('text');
  // useThemeColor('text'): 테마에 따른 텍스트 색상 반환

  // ===== 함수 정의 부분 =====

  /**
   * 앱 초기화 함수
   *
   * @async
   * @function initializeApp
   * @returns {Promise<void>}
   */
  const initializeApp = async () => {
    try {
      console.log('✅ (auth)/index.tsx - 서버 연결 확인 시작');

      // 서버 연결 확인
      // await: 비동기 함수의 결과를 기다림
      const connected = await checkServerConnection();
      // checkServerConnection(): 서버 연결 상태를 확인하는 함수 호출
      // 결과는 boolean (true: 연결됨, false: 연결 실패)

      // 상태 업데이트: 서버 연결 상태 저장
      setIsConnected(connected);
      // setIsConnected(): isConnected 상태를 변경하는 함수

      // setTimeout(): 지정된 시간 후에 함수 실행
      // 100ms 후에 초기 로딩 화면을 닫음
      setTimeout(() => {
        setIsInitialLoading(false);
        // setIsInitialLoading(false): 초기 로딩 상태를 false로 변경
      }, 100);
    } catch (error) {
      // catch: 에러가 발생했을 때 실행되는 블록
      // console.error(): 에러 로그 출력
      console.error('앱 초기화 중 오류:', error);
      // error: 발생한 에러 객체

      // 에러 발생 시 상태 설정
      setIsConnected(false); // 서버 연결 실패로 설정
      setIsInitialLoading(false); // 로딩 화면 닫기
    }
  };

  /**
   * 서버 연결 상태를 확인하고 결과를 표시하는 핸들러
   *
   * @async
   * @function handlePress
   * @returns {Promise<void>}
   */
  // 화살표 함수 문법: const 함수명 = () => { 함수내용 }
  // async: 비동기 함수임을 나타냄
  const handlePress = async () => {
    // 로딩 화면 표시 시작
    setShowLoading(true);
    // setShowLoading(true): showLoading 상태를 true로 변경

    try {
      // 서버 연결 상태 확인
      const connected = await checkServerConnection();
      // await: 비동기 함수의 결과를 기다림
      // checkServerConnection(): 서버 연결 상태를 확인하는 함수

      // 서버 연결 상태 저장
      setIsConnected(connected);
      // setIsConnected(): isConnected 상태를 변경하는 함수

      // setTimeout(): 지정된 시간 후에 함수 실행
      // 3초 후에 로딩 화면을 닫고 알림을 표시
      setTimeout(() => {
        // 로딩 화면 숨기기
        setShowLoading(false);
        // setShowLoading(false): showLoading 상태를 false로 변경

        // Alert.alert(): 모바일에서 팝업 알림 표시
        Alert.alert(
          '서버 연결 상태', // 제목
          // 삼항 연산자: 조건 ? 참일때값 : 거짓일때값
          connected ? '서버에 연결되었습니다!' : '서버 연결에 실패했습니다.'
          // connected가 true면 첫 번째 메시지, false면 두 번째 메시지
        );
      }, 3000); // 3000ms = 3초
    } catch (error) {
      // catch: 에러가 발생했을 때 실행되는 블록
      // console.error(): 에러 로그 출력
      console.error('서버 연결 확인 중 오류:', error);
      // error: 발생한 에러 객체

      // 에러 발생 시 상태 설정
      setIsConnected(false); // 서버 연결 실패로 설정
      setShowLoading(false); // 로딩 화면 숨기기

      // 에러 알림 표시
      Alert.alert('오류', '서버 연결 확인 중 오류가 발생했습니다.');
      // Alert.alert(제목, 메시지): 팝업 알림 표시
    }
  };

  /**
   * 404 화면으로 이동하는 핸들러
   *
   * @function handleNotFoundPress
   */
  const handleNotFoundPress = () => {
    console.log('404 화면으로 이동합니다!');

    // 404 화면 표시
    setShowNotFound(true);
    // setShowNotFound(true): showNotFound 상태를 true로 변경
  };

  /**
   * 로딩 화면 테스트 핸들러
   *
   * @function handleLoadingTest
   */
  const handleLoadingTest = () => {
    // 로딩 메시지 설정
    setLoadingMessage('로딩 중입니다...');
    // setLoadingMessage(): loadingMessage 상태를 변경하는 함수

    // 로딩 화면 표시
    setShowLoading(true);
    // setShowLoading(true): showLoading 상태를 true로 변경

    // setTimeout(): 지정된 시간 후에 함수 실행
    // 1초 후에 로딩 화면을 닫음
    setTimeout(() => {
      setShowLoading(false);
      // setShowLoading(false): showLoading 상태를 false로 변경
    }, 1000); // 1000ms = 1초
  };

  /**
   * 약관 동의 초기화 핸들러 (개발용)
   *
   * @function handleClearTerms
   */
  const handleClearTerms = async () => {
    try {
      // 약관 동의 상태 초기화
      await clearTermsAgreement();
      // await: 비동기 함수의 결과를 기다림
      // clearTermsAgreement(): 약관 동의 상태를 초기화하는 함수

      // 성공 알림 표시
      Alert.alert(
        '초기화 완료', // 제목
        '약관 동의가 초기화되었습니다. 앱을 다시 시작하면 약관 동의 페이지가 표시됩니다.' // 메시지
      );
      // Alert.alert(제목, 메시지): 팝업 알림 표시
    } catch (error) {
      console.error('약관 동의 초기화 중 오류:', error);
      Alert.alert('오류', '약관 동의 초기화 중 오류가 발생했습니다.');
    }
  };

  // ===== 실행 부분 =====

  // 앱 초기화 - useEffect Hook 사용
  // useEffect: 컴포넌트가 마운트되거나 의존성이 변경될 때 실행
  // []: 빈 배열 - 컴포넌트가 처음 마운트될 때만 실행 (의존성 없음)
  useEffect(() => {
    // 함수 호출: initializeApp 함수 실행
    initializeApp();
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  // 조건부 렌더링: 초기 로딩 화면 표시
  if (isInitialLoading) {
    // return: 함수의 반환값 (JSX로 화면 구조를 반환)
    return <LoadingScreen message="StoryCraft를 시작합니다..." image={sleepcharacter} />;
    // LoadingScreen: 로딩 화면 컴포넌트
    // message: 로딩 메시지 텍스트
    // image: 로딩 화면에 표시할 이미지
  }

  // 조건부 렌더링: 로딩 화면 표시
  if (showLoading) {
    return (
      // JSX 문법: HTML과 비슷하지만 JavaScript 안에서 사용
      <LoadingScreen
        // message 속성: 로딩 메시지 설정
        message={
          // 논리 OR 연산자 (||): 왼쪽이 falsy면 오른쪽 값 사용
          loadingMessage ||
          // 삼항 연산자 중첩: 조건에 따라 다른 메시지 표시
          (isConnected === null
            ? '서버 연결 확인 중...' // isConnected가 null일 때
            : isConnected
              ? '서버에 연결되었습니다!' // isConnected가 true일 때
              : '서버 연결에 실패했습니다.') // isConnected가 false일 때
        }
        // image 속성: 로딩 화면에 표시할 이미지
        image={sleepcharacter}
      />
    );
  }

  // 조건부 렌더링: 404 화면 표시
  if (showNotFound) {
    // setShowNotFound(false)는 404 화면에서 홈으로 돌아갈 때 404 화면을 숨기기 위한 정상적인 상태 변경 로직
    return <NotFoundScreen onBackToHome={() => setShowNotFound(false)} />;
    // NotFoundScreen: 404 에러 화면 컴포넌트
    // onBackToHome: 홈으로 돌아가는 함수 (props로 전달)
    // () => setShowNotFound(false): 화살표 함수로 404 화면 숨기기
  }

  // 조건부 렌더링: 테스트 화면이 아닐 때 (첫 화면)
  if (!showTestScreen) {
    return (
      // ThemedView: 테마에 따라 색상이 변하는 뷰 컴포넌트
      <ThemedView style={{ ...styles.container, backgroundColor }}>
        {/* 제목 텍스트 */}
        <ThemedText style={{ ...styles.title, color: textColor }}>StoryCraft</ThemedText>

        {/* 부제목 텍스트 */}
        <ThemedText style={{ ...styles.subtitle, color: textColor }}>
          당신의 이야기를 만들어보세요
        </ThemedText>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)')}>
          <ThemedText style={styles.buttonText}>로그인</ThemedText>
        </TouchableOpacity>

        {/* 테스트 화면으로 이동 버튼 */}
        <TouchableOpacity
          style={{ ...styles.button, marginTop: 10, backgroundColor: '#4CAF50' }}
          onPress={() => setShowTestScreen(true)}
        >
          <ThemedText style={styles.buttonText}>테스트 화면으로 이동</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // 테스트 화면 (showTestScreen이 true일 때)
  return (
    <ThemedView style={{ ...styles.container, backgroundColor }}>
      {/* 테스트 화면 제목 */}
      <ThemedText style={{ ...styles.title, color: textColor }}>테스트 화면</ThemedText>

      {/* 테스트 화면 부제목 */}
      <ThemedText style={{ ...styles.subtitle, color: textColor }}>
        다양한 기능을 테스트해보세요
      </ThemedText>

      {/* 서버 연결 테스트 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <ThemedText style={styles.buttonText}>서버 연결 테스트</ThemedText>
      </TouchableOpacity>

      {/* 404 화면으로 이동 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#FF6B6B' }}
        onPress={handleNotFoundPress}
      >
        <ThemedText style={styles.buttonText}>404 화면으로 이동</ThemedText>
      </TouchableOpacity>

      {/* 로딩 화면 테스트 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#4CAF50' }}
        onPress={handleLoadingTest}
      >
        <ThemedText style={styles.buttonText}>로딩 화면 테스트</ThemedText>
      </TouchableOpacity>

      {/* 팝업 테스트 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#9C27B0' }}
        onPress={() => setShowPopup(true)}
      >
        <ThemedText style={styles.buttonText}>팝업 테스트</ThemedText>
      </TouchableOpacity>

      {/* API 테스트 버튼 - 개발용으로 주석처리 */}
      {/* <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#FF5722' }]}
        onPress={() => router.push('./api-test')}
      >
        <ThemedText style={styles.buttonText}>🧪 API 테스트</ThemedText>
      </TouchableOpacity> */}

      {/* 메인 화면으로 이동 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#2196F3' }}
        onPress={() => router.replace('/(main)')}
      >
        <ThemedText style={styles.buttonText}>메인 화면으로 이동</ThemedText>
      </TouchableOpacity>

      {/* 홈으로 돌아가기 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#607D8B' }}
        onPress={() => setShowTestScreen(false)}
      >
        <ThemedText style={styles.buttonText}>홈으로 돌아가기</ThemedText>
      </TouchableOpacity>

      {/* 약관 동의 페이지로 이동 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#28a745' }}
        onPress={() => router.push('/(terms-agreement)')}
      >
        <ThemedText style={styles.buttonText}>약관 동의 페이지로 이동</ThemedText>
      </TouchableOpacity>

      {/* 약관 동의 초기화 버튼 (개발용) */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#FF9800' }}
        onPress={handleClearTerms}
      >
        <ThemedText style={styles.buttonText}>약관 동의 초기화</ThemedText>
      </TouchableOpacity>

      {/* 로그인 화면으로 이동 버튼 */}
      <TouchableOpacity
        style={{ ...styles.button, marginTop: 10, backgroundColor: '#E91E63' }}
        onPress={() => router.replace('/(auth)')}
      >
        <ThemedText style={styles.buttonText}>🔐 로그인 화면으로 이동</ThemedText>
      </TouchableOpacity>

      <Popup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        title="알림"
        message="이것은 팝업 테스트입니다."
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => console.log('확인 버튼 클릭')}
        onCancel={() => console.log('취소 버튼 클릭')}
      />
    </ThemedView>
  );
}

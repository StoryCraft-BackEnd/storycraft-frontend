/**
 * StoryCraft 메인 화면 컴포넌트
 */
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { checkServerConnection } from '@/shared/api/client';
import { homeScreenStyles as styles } from '@/styles/HomeScreen.styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Popup } from '@/components/ui/Popup';
import { NotFoundScreen } from '@/components/ui/NotFoundScreen';
import sleepcharacter from '@/assets/images/character/sleep.png';
import { clearTermsAgreement } from '@/shared/utils/termsUtils';

export default function HomeScreen() {
  // 상태 관리
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 초기 로딩 상태
  const [showLoading, setShowLoading] = useState(false); // 로딩 화면 표시 여부
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // 서버 연결 상태
  const [showPopup, setShowPopup] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(''); // 로딩 메시지 상태 추가
  const [showTestScreen, setShowTestScreen] = useState(false); // 테스트 화면 표시 여부
  const backgroundColor = useThemeColor('background'); // 배경색
  const textColor = useThemeColor('text'); // 텍스트 색상

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('✅ (auth)/index.tsx - 서버 연결 확인 시작');

        // 서버 연결 확인
        const connected = await checkServerConnection();
        setIsConnected(connected);

        // 2초 후에 초기 로딩 화면을 닫음
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 100);
      } catch (error) {
        console.error('앱 초기화 중 오류:', error);
        setIsConnected(false);
        setIsInitialLoading(false);
      }
    };

    initializeApp();
  }, []);

  /**
   * 서버 연결 상태를 확인하고 결과를 표시하는 핸들러
   *
   * @async
   * @function handlePress
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    setShowLoading(true);

    try {
      const connected = await checkServerConnection();
      setIsConnected(connected);

      // 3초 후에 로딩 화면을 닫고 알림을 표시
      setTimeout(() => {
        setShowLoading(false);
        Alert.alert(
          '서버 연결 상태',
          connected ? '서버에 연결되었습니다!' : '서버 연결에 실패했습니다.'
        );
      }, 3000);
    } catch (error) {
      console.error('서버 연결 확인 중 오류:', error);
      setIsConnected(false);
      setShowLoading(false);
      Alert.alert('오류', '서버 연결 확인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 404 화면으로 이동하는 핸들러
   *
   * @function handleNotFoundPress
   */
  const handleNotFoundPress = () => {
    console.log('404 화면으로 이동합니다!');
    setShowNotFound(true);
  };

  /**
   * 로딩 화면 테스트 핸들러
   *
   * @function handleLoadingTest
   */
  const handleLoadingTest = () => {
    setLoadingMessage('로딩 중입니다...');
    setShowLoading(true);

    // 2초 후에 로딩 화면을 닫음
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  /**
   * 약관 동의 초기화 핸들러 (개발용)
   *
   * @function handleClearTerms
   */
  const handleClearTerms = async () => {
    try {
      await clearTermsAgreement();
      Alert.alert(
        '초기화 완료',
        '약관 동의가 초기화되었습니다. 앱을 다시 시작하면 약관 동의 페이지가 표시됩니다.'
      );
    } catch (error) {
      console.error('약관 동의 초기화 중 오류:', error);
      Alert.alert('오류', '약관 동의 초기화 중 오류가 발생했습니다.');
    }
  };

  // 초기 로딩 화면 표시
  if (isInitialLoading) {
    return <LoadingScreen message="StoryCraft를 시작합니다..." image={sleepcharacter} />;
  }

  // 로딩 화면 표시
  if (showLoading) {
    return (
      <LoadingScreen
        message={
          loadingMessage ||
          (isConnected === null
            ? '서버 연결 확인 중...'
            : isConnected
              ? '서버에 연결되었습니다!'
              : '서버 연결에 실패했습니다.')
        }
        image={sleepcharacter}
      />
    );
  }

  if (showNotFound) {
    return <NotFoundScreen onBackToHome={() => setShowNotFound(false)} />;
  }

  // 테스트 화면이 아닐 때 (첫 화면)
  if (!showTestScreen) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={[styles.title, { color: textColor }]}>StoryCraft</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          당신의 이야기를 만들어보세요
        </ThemedText>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={[styles.button]} onPress={() => router.push('/(auth)')}>
          <ThemedText style={styles.buttonText}>로그인</ThemedText>
        </TouchableOpacity>

        {/* 테스트 화면으로 이동 버튼 */}
        <TouchableOpacity
          style={[styles.button, { marginTop: 10, backgroundColor: '#4CAF50' }]}
          onPress={() => setShowTestScreen(true)}
        >
          <ThemedText style={styles.buttonText}>테스트 화면으로 이동</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // 테스트 화면
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>테스트 화면</ThemedText>
      <ThemedText style={[styles.subtitle, { color: textColor }]}>
        다양한 기능을 테스트해보세요
      </ThemedText>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <ThemedText style={styles.buttonText}>서버 연결 테스트</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#FF6B6B' }]}
        onPress={handleNotFoundPress}
      >
        <ThemedText style={styles.buttonText}>404 화면으로 이동</ThemedText>
      </TouchableOpacity>

      {/* 로딩 화면 테스트 버튼 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#4CAF50' }]}
        onPress={handleLoadingTest}
      >
        <ThemedText style={styles.buttonText}>로딩 화면 테스트</ThemedText>
      </TouchableOpacity>

      {/* 팝업 테스트 버튼 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#9C27B0' }]}
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
        style={[styles.button, { marginTop: 10, backgroundColor: '#2196F3' }]}
        onPress={() => router.replace('/(main)')}
      >
        <ThemedText style={styles.buttonText}>메인 화면으로 이동</ThemedText>
      </TouchableOpacity>

      {/* 홈으로 돌아가기 버튼 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#607D8B' }]}
        onPress={() => setShowTestScreen(false)}
      >
        <ThemedText style={styles.buttonText}>홈으로 돌아가기</ThemedText>
      </TouchableOpacity>

      {/* 약관 동의 페이지로 이동 버튼 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#28a745' }]}
        onPress={() => router.push('/(terms-agreement)')}
      >
        <ThemedText style={styles.buttonText}>약관 동의 페이지로 이동</ThemedText>
      </TouchableOpacity>

      {/* 약관 동의 초기화 버튼 (개발용) */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#FF9800' }]}
        onPress={handleClearTerms}
      >
        <ThemedText style={styles.buttonText}>약관 동의 초기화</ThemedText>
      </TouchableOpacity>

      {/* 로그인 화면으로 이동 버튼 */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 10, backgroundColor: '#E91E63' }]}
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

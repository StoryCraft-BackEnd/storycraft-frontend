/**
 * API 테스트 화면
 *
 * 개발 중 API 기능을 테스트하기 위한 화면입니다.
 * 각 API 기능을 버튼으로 테스트할 수 있습니다.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  quickCreateTest,
  testServerConnection,
  testCreateChild,
  testGetChildren,
  testSaveLearningTime,
  runAllApiTests,
  createChild,
  // Auth 테스트 함수
  testSignup,
  testLogin,
  testLogout,
  testTokenCheck,
  testEmailCheck,
  testNicknameCheck,
  runAllAuthTests,
} from '@/shared/api';
import { API_CONFIG, ENV_CONFIG } from '@/shared/config/api';

export default function ApiTestScreen() {
  const [loading, setLoading] = useState(false);
  const [lastChildId, setLastChildId] = useState<number | null>(null);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(true);
    console.log(`\n🧪 ${testName} 테스트 시작...`);

    try {
      const result = await testFunction();
      console.log(`✅ ${testName} 성공:`, result);

      // 프로필 생성 결과에서 childId 저장
      if (result?.data?.childId) {
        setLastChildId(result.data.childId);
      }

      Alert.alert('성공! ✅', `${testName} 테스트가 성공했습니다!\n\n콘솔을 확인해보세요.`);
    } catch (error: any) {
      console.error(`❌ ${testName} 실패:`, error);
      Alert.alert('실패 ❌', `${testName} 테스트 실패:\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const TestButton = ({
    title,
    onPress,
    color = '#007AFF',
  }: {
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🧪 API 테스트 화면</Text>
      <Text style={styles.subtitle}>서버: https://dev.childstorycraft.com</Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>테스트 실행 중...</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>🔗 기본 테스트</Text>

        <TestButton
          title="서버 연결 테스트"
          color="#28a745"
          onPress={() => runTest('서버 연결', testServerConnection)}
        />

        <TestButton
          title="저장된 토큰 확인"
          color="#6c757d"
          onPress={() => runTest('토큰 확인', testTokenCheck)}
        />

        <Text style={styles.sectionTitle}>🔐 인증 API 테스트</Text>

        <TestButton
          title="회원가입 (POST /auth/signup)"
          color="#28a745"
          onPress={() => runTest('회원가입', testSignup)}
        />

        <TestButton
          title="로그인 (POST /auth/login)"
          color="#007AFF"
          onPress={() => runTest('로그인', testLogin)}
        />

        <TestButton
          title="로그아웃"
          color="#dc3545"
          onPress={() => runTest('로그아웃', testLogout)}
        />

        <Text style={styles.sectionTitle}>✅ 중복 확인 API 테스트</Text>

        <TestButton
          title="이메일 중복 확인 (POST /email/verification/exists)"
          color="#17a2b8"
          onPress={() => runTest('이메일 중복 확인', testEmailCheck)}
        />

        <TestButton
          title="닉네임 중복 확인 (POST /nickname/exists)"
          color="#ffc107"
          onPress={() => runTest('닉네임 중복 확인', testNicknameCheck)}
        />

        <TestButton
          title="전체 인증 테스트 실행"
          color="#6f42c1"
          onPress={() => runTest('전체 인증', runAllAuthTests)}
        />

        <Text style={styles.sectionTitle}>📝 프로필 API 테스트 (토큰 필요)</Text>

        <TestButton
          title="빠른 프로필 생성 테스트"
          color="#17a2b8"
          onPress={() => runTest('빠른 프로필 생성', quickCreateTest)}
        />

        <Text style={styles.sectionTitle}>📝 개별 API 테스트</Text>

        <TestButton
          title="프로필 생성 (POST /children)"
          color="#007AFF"
          onPress={() => runTest('프로필 생성', testCreateChild)}
        />

        <TestButton
          title="프로필 목록 조회 (GET /children)"
          color="#6f42c1"
          onPress={() => runTest('프로필 목록 조회', testGetChildren)}
        />

        <TestButton
          title="커스텀 프로필 생성"
          color="#fd7e14"
          onPress={() =>
            runTest('커스텀 프로필 생성', async () => {
              return await createChild({
                name: '테스트 아이 ' + Date.now(),
                age: Math.floor(Math.random() * 10) + 5,
                learningLevel: ['초급', '중급', '고급'][Math.floor(Math.random() * 3)] as any,
              });
            })
          }
        />

        <Text style={styles.sectionTitle}>⏰ 학습 통계 API 테스트</Text>

        <TestButton
          title="학습 시간 저장 테스트 (POST /statistics/learning-time)"
          color="#20c997"
          onPress={() =>
            runTest('학습 시간 저장', async () => {
              // lastChildId가 있으면 사용하고, 없으면 기본값 1 사용
              const childId = lastChildId || 1;
              const learningTime = Math.floor(Math.random() * 60) + 10; // 10-70분 랜덤
              return await testSaveLearningTime(childId, learningTime);
            })
          }
        />

        <Text style={styles.sectionTitle}>🚀 종합 테스트</Text>

        <TestButton
          title="전체 API 테스트 실행"
          color="#dc3545"
          onPress={() => runTest('전체 API', runAllApiTests)}
        />

        {lastChildId && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>마지막 생성된 childId: {lastChildId}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.instructionTitle}>🌐 서버 정보 (TypeScript 설정):</Text>
          <Text style={styles.instructionText}>
            📍 URL: {API_CONFIG.BASE_URL}
            {'\n'}
            🏠 Host: {API_CONFIG.HOST}
            {'\n'}
            🔌 Port: {API_CONFIG.PORT}
            {'\n'}
            🔒 Protocol: {API_CONFIG.PROTOCOL}
            {'\n'}
            ⏱️ Timeout: {API_CONFIG.TIMEOUT}ms{'\n'}
            🏷️ Environment: {API_CONFIG.ENVIRONMENT}
            {'\n'}
            🐛 Debug Mode: {ENV_CONFIG.app.debugMode ? 'ON' : 'OFF'}
          </Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>📱 사용법:</Text>
          <Text style={styles.instructionText}>
            1. "서버 연결 테스트"를 먼저 실행해보세요{'\n'}
            2. "회원가입"으로 새 계정을 만들어보세요{'\n'}
            3. "로그인"으로 토큰을 받아보세요{'\n'}
            4. 토큰이 있어야 프로필 API가 정상 작동합니다{'\n'}
            5. "저장된 토큰 확인"으로 현재 상태를 확인하세요{'\n'}
            6. 결과는 콘솔과 알림으로 확인할 수 있습니다
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#343a40',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  infoText: {
    color: '#155724',
    fontSize: 14,
    fontWeight: '500',
  },
  instructionContainer: {
    backgroundColor: '#e2e3e5',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6c757d',
  },
});

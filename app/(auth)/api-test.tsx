/**
 * API 테스트 화면
 *
 * 개발 중 API 기능을 테스트하기 위한 화면입니다.
 * 각 API 기능을 버튼으로 테스트할 수 있습니다.
 *
 * 주요 기능:
 * - 서버 연결 테스트
 * - 인증 API 테스트 (회원가입, 로그인, 로그아웃)
 * - 중복 확인 API 테스트 (이메일, 닉네임)
 * - 프로필 API 테스트 (생성, 조회)
 * - 학습 통계 API 테스트
 * - 종합 테스트 실행
 */

// React: React 라이브러리의 기본 기능들
// { useState }: React에서 제공하는 Hook 중 하나 (상태 관리용)
import React, { useState } from 'react';
import {
  // React Native에서 제공하는 UI 컴포넌트들
  View, // 컨테이너 뷰 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트 (button)
  ScrollView, // 스크롤 가능한 뷰 컴포넌트
  Alert, // 알림 다이얼로그 컴포넌트
  ActivityIndicator, // 로딩 인디케이터 컴포넌트 (돌아가는 스피너 모양)
  StyleSheet, // 스타일 정의를 위한 유틸리티
} from 'react-native';

// Expo Router에서 네비게이션 기능을 가져옵니다
// { router }: 화면 간 이동을 위한 네비게이션 객체
import { router } from 'expo-router';

// Expo의 아이콘 라이브러리를 가져옵니다
// { Ionicons }: 다양한 아이콘들을 제공하는 컴포넌트
import { Ionicons } from '@expo/vector-icons';

// API 테스트 함수들을 가져옵니다
// '@/shared/api': 프로젝트 내의 shared/api 폴더에서 함수들을 가져옴
// @ 기호: 프로젝트 루트를 의미하는 별칭 (경로 단축)
import {
  quickCreateTest, // 빠른 프로필 생성 테스트 함수
  testServerConnection, // 서버 연결 테스트 함수
  testCreateChild, // 프로필 생성 테스트 함수
  testGetChildren, // 프로필 목록 조회 테스트 함수
  testSaveLearningTime, // 학습 시간 저장 테스트 함수
  runAllApiTests, // 전체 API 테스트 실행 함수
  createChild, // 프로필 생성 함수
  testSignup, // 회원가입 테스트 함수
  testLogin, // 로그인 테스트 함수
  testLogout, // 로그아웃 테스트 함수
  testTokenCheck, // 토큰 확인 테스트 함수
  testEmailCheck, // 이메일 중복 확인 테스트 함수
  testNicknameCheck, // 닉네임 중복 확인 테스트 함수
  runAllAuthTests, // 전체 인증 테스트 실행 함수
} from '@/shared/api';

// API 설정과 환경 설정을 가져옵니다
import { API_CONFIG, ENV_CONFIG } from '@/shared/config/api';

// API 테스트 화면의 메인 컴포넌트
// export default: 이 파일을 import할 때 기본으로 가져올 컴포넌트
// function ApiTestScreen(): 함수형 컴포넌트 정의
export default function ApiTestScreen() {
  // useState Hook 사용법:
  // const [상태변수, 상태변경함수] = useState(초기값);
  // 로딩 상태를 관리하는 state (테스트 실행 중인지 여부)
  const [loading, setLoading] = useState(false);

  // 마지막으로 생성된 프로필의 ID를 저장하는 state
  // 다른 테스트에서 이 ID를 참조할 수 있도록 함
  // <number | null>: TypeScript 타입 정의 (숫자 또는 null)
  const [lastChildId, setLastChildId] = useState<number | null>(null);

  /**
   * 테스트를 실행하는 공통 함수
   * @param testName - 테스트 이름 (사용자에게 표시될 이름)
   * @param testFunction - 실행할 테스트 함수
   */
  // async/await 문법: 비동기 함수를 동기적으로 처리
  // (testName: string, testFunction: () => Promise<any>): 매개변수 타입 정의
  // Promise<any>: 비동기 작업의 결과를 나타내는 객체 (어떤 타입이든 가능)
  // Promise로 "나중에 결과 줄게"라고 약속하고, 비동기로 다른 일을 계속 할 수 있음
  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    // setLoading(true): state 변경 함수 호출 (로딩 시작)
    setLoading(true);
    console.log(`\n🧪 ${testName} 테스트 시작...`);

    try {
      // await: 비동기 함수의 결과를 기다림
      const result = await testFunction();
      console.log(`✅ ${testName} 성공:`, result);

      // 옵셔널 체이닝 (?.) : 객체가 null/undefined일 때 에러 방지
      // 1. result가 null이나 undefined면 → undefined 반환 (에러 없음)
      // 2. result.data가 null이나 undefined면 → undefined 반환 (에러 없음)
      // 3. result.data.childId가 있으면 → 그 값을 반환
      if (result?.data?.childId) {
        setLastChildId(result.data.childId);
      }

      // Alert.alert(): 모바일에서 팝업 알림 표시
      Alert.alert('성공! ✅', `${testName} 테스트가 성공했습니다!\n\n콘솔을 확인해보세요.`);
    } catch (error: any) {
      // catch: 에러가 발생했을 때 실행되는 블록
      console.error(`❌ ${testName} 실패:`, error);
      Alert.alert('실패 ❌', `${testName} 테스트 실패:\n\n${error.message}`);
    } finally {
      // finally: 성공/실패 관계없이 항상 실행되는 블록
      setLoading(false);
    }
  };

  /**
   * 재사용 가능한 테스트 버튼 컴포넌트
   * @param title - 버튼에 표시될 텍스트
   * @param onPress - 버튼 클릭 시 실행될 함수
   * @param color - 버튼의 배경색 (기본값: '#007AFF')
   */
  // 화살표 함수 문법: const 함수명 = (매개변수) => { 함수내용 }
  // color = '#007AFF': 기본값 설정 (매개변수가 없으면 이 값 사용)
  const TestButton = ({
    title,
    onPress,
    color = '#007AFF',
  }: {
    // TypeScript 타입 정의: 매개변수의 타입을 명시
    title: string; // 문자열 타입
    onPress: () => void; // 매개변수 없고 반환값 없는 함수 타입
    color?: string; // 선택적 매개변수 (물음표로 표시)
  }) => (
    <TouchableOpacity
      // style 속성: 배열로 여러 스타일을 합칠 수 있음
      // [styles.button, { backgroundColor: color }]: 기본 버튼 스타일 + 동적 배경 색상
      style={[styles.button, { backgroundColor: color }]}
      // onPress: 터치 이벤트 핸들러
      onPress={onPress}
      // disabled: 버튼 비활성화 여부 (boolean 값)
      disabled={loading}
    >
      {/* JSX에서 텍스트는 Text 컴포넌트'{}'로 감싸야 함 */}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* JSX 주석 문법: 중괄호와 별표로 주석 작성 */}
      {/* 뒤로가기 버튼 - 이전 화면으로 돌아가는 기능 */}
      <TouchableOpacity
        style={styles.backButton}
        // 화살표 함수: () => { 함수내용 } - 간단한 함수 정의
        onPress={() => router.back()}
      >
        {/* Ionicons: 아이콘 컴포넌트 (name, size, color 속성) */}
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>

      {/* 화면 제목과 서버 정보 표시 */}
      <Text style={styles.title}>🧪 API 테스트 화면</Text>
      <Text style={styles.subtitle}>서버: https://dev.childstorycraft.com</Text>

      {/* 조건부 렌더링: {조건 && <컴포넌트>} - 조건이 true일 때만 렌더링 */}
      {loading && (
        <View style={styles.loadingContainer}>
          {/* ActivityIndicator: 로딩 스피너 컴포넌트 (돌아가는 원형 아이콘) */}
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>테스트 실행 중...</Text>
        </View>
      )}

      {/* ScrollView: 스크롤 가능한 컨테이너 */}
      {/* showsVerticalScrollIndicator={false}: 세로 스크롤바 숨김 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 기본 테스트 섹션 */}
        <Text style={styles.sectionTitle}>🔗 기본 테스트</Text>

        {/* 서버 연결 상태를 확인하는 테스트 */}
        <TestButton
          title="서버 연결 테스트"
          color="#28a745" // 녹색 - 성공을 의미
          onPress={() => runTest('서버 연결', testServerConnection)}
        />

        {/* 현재 저장된 인증 토큰을 확인하는 테스트 */}
        <TestButton
          title="저장된 토큰 확인"
          color="#6c757d" // 회색 - 정보 확인을 의미
          onPress={() => runTest('토큰 확인', testTokenCheck)}
        />

        {/* 인증 관련 API 테스트 섹션 */}
        <Text style={styles.sectionTitle}>🔐 인증 API 테스트</Text>

        {/* 회원가입 API 테스트 */}
        <TestButton
          title="회원가입 (POST /auth/signup)"
          color="#28a745" // 녹색 - 계정 생성
          onPress={() => runTest('회원가입', testSignup)}
        />

        {/* 로그인 API 테스트 */}
        <TestButton
          title="로그인 (POST /auth/login)"
          color="#007AFF" // 파란색 - 기본 액션
          onPress={() => runTest('로그인', testLogin)}
        />

        {/* 로그아웃 API 테스트 */}
        <TestButton
          title="로그아웃"
          color="#dc3545" // 빨간색 - 로그아웃
          onPress={() => runTest('로그아웃', testLogout)}
        />

        {/* 중복 확인 API 테스트 섹션 */}
        <Text style={styles.sectionTitle}>✅ 중복 확인 API 테스트</Text>

        {/* 이메일 중복 확인 API 테스트 */}
        <TestButton
          title="이메일 중복 확인 (POST /email/verification/exists)"
          color="#17a2b8" // 청록색 - 정보 확인
          onPress={() => runTest('이메일 중복 확인', testEmailCheck)}
        />

        {/* 닉네임 중복 확인 API 테스트 */}
        <TestButton
          title="닉네임 중복 확인 (POST /nickname/exists)"
          color="#ffc107" // 노란색 - 주의/확인
          onPress={() => runTest('닉네임 중복 확인', testNicknameCheck)}
        />

        {/* 모든 인증 관련 테스트를 한 번에 실행 */}
        <TestButton
          title="전체 인증 테스트 실행"
          color="#6f42c1" // 보라색 - 종합 테스트
          onPress={() => runTest('전체 인증', runAllAuthTests)}
        />

        {/* 프로필 관련 API 테스트 섹션 (인증 토큰이 필요함) */}
        <Text style={styles.sectionTitle}>📝 프로필 API 테스트 (토큰 필요)</Text>

        {/* 빠른 프로필 생성 테스트 (기본값으로 프로필 생성) */}
        <TestButton
          title="빠른 프로필 생성 테스트"
          color="#17a2b8" // 청록색 - 프로필 생성
          onPress={() => runTest('빠른 프로필 생성', quickCreateTest)}
        />

        {/* 개별 API 테스트 섹션 */}
        <Text style={styles.sectionTitle}>📝 개별 API 테스트</Text>

        {/* 프로필 생성 API 테스트 */}
        <TestButton
          title="프로필 생성 (POST /children)"
          color="#007AFF" // 파란색 - 기본 액션
          onPress={() => runTest('프로필 생성', testCreateChild)}
        />

        {/* 프로필 목록 조회 API 테스트 */}
        <TestButton
          title="프로필 목록 조회 (GET /children)"
          color="#6f42c1" // 보라색 - 조회 기능
          onPress={() => runTest('프로필 목록 조회', testGetChildren)}
        />

        {/* 커스텀 데이터로 프로필 생성 테스트 */}
        <TestButton
          title="커스텀 프로필 생성"
          color="#fd7e14" // 주황색 - 커스텀 기능
          // onPress에 화살표 함수 전달
          onPress={() =>
            // runTest 함수 호출 (첫 번째 매개변수: 테스트명, 두 번째: 테스트 함수)
            runTest('커스텀 프로필 생성', async () => {
              return await createChild({
                // 문자열 연결: + 연산자로 문자열 합치기
                name: '테스트 아이 ' + Date.now(), // Date.now(): 현재 시간을 밀리초로 반환
                // Math.floor(): 소수점 버림, Math.random(): 0~1 사이 랜덤값
                age: Math.floor(Math.random() * 10) + 5, // 5-14세 랜덤
                // 배열 인덱스 접근: [인덱스], as any: TypeScript 타입 강제 변환
                learningLevel: ['초급', '중급', '고급'][Math.floor(Math.random() * 3)] as any,
              });
            })
          }
        />

        {/* 학습 통계 API 테스트 섹션 */}
        <Text style={styles.sectionTitle}>⏰ 학습 통계 API 테스트</Text>

        {/* 학습 시간 저장 API 테스트 */}
        <TestButton
          title="학습 시간 저장 테스트 (POST /statistics/learning-time)"
          color="#20c997" // 청록색 - 통계 저장
          onPress={() =>
            runTest('학습 시간 저장', async () => {
              // 논리 OR 연산자 (||): 왼쪽이 false면 오른쪽 값 사용
              // falsy 값: false, 0, '', null, undefined, NaN
              const childId = lastChildId || 1;
              // 변수 선언: const 변수명 = 값 (값 변경 불가)
              const learningTime = Math.floor(Math.random() * 60) + 10;
              // 함수 호출: 함수명(매개변수1, 매개변수2)
              return await testSaveLearningTime(childId, learningTime);
            })
          }
        />

        {/* 종합 테스트 섹션 */}
        <Text style={styles.sectionTitle}>🚀 종합 테스트</Text>

        {/* 모든 API 테스트를 한 번에 실행 */}
        <TestButton
          title="전체 API 테스트 실행"
          color="#dc3545" // 빨간색 - 전체 테스트
          onPress={() => runTest('전체 API', runAllApiTests)}
        />

        {/* 조건부 렌더링: lastChildId가 있을 때만 표시 */}
        {lastChildId && (
          <View style={styles.infoContainer}>
            {/* JSX에서 변수 출력: {변수명} */}
            <Text style={styles.infoText}>마지막 생성된 childId: {lastChildId}</Text>
          </View>
        )}

        {/* 서버 설정 정보 표시 */}
        <View style={styles.infoContainer}>
          <Text style={styles.instructionTitle}>🌐 서버 정보 (TypeScript 설정):</Text>
          <Text style={styles.instructionText}>
            {/* 객체 속성 접근: 객체명.속성명 */}
            📍 URL: {API_CONFIG.BASE_URL} {/* API_CONFIG 객체의 BASE_URL 속성 */}
            {'\n'} {/* 문자열 리터럴: 줄바꿈 문자 */}
            🏠 Host: {API_CONFIG.HOST} {/* API_CONFIG 객체의 HOST 속성 */}
            {'\n'}
            🔌 Port: {API_CONFIG.PORT} {/* API_CONFIG 객체의 PORT 속성 */}
            {'\n'}
            🔒 Protocol: {API_CONFIG.PROTOCOL} {/* API_CONFIG 객체의 PROTOCOL 속성 */}
            {'\n'}
            ⏱️ Timeout: {API_CONFIG.TIMEOUT}ms {/* API_CONFIG 객체의 TIMEOUT 속성 */}
            {'\n'}
            🏷️ Environment: {API_CONFIG.ENVIRONMENT} {/* API_CONFIG 객체의 ENVIRONMENT 속성 */}
            {'\n'}
            {/* 삼항 연산자: 조건 ? 참일때값 : 거짓일때값 */}
            🐛 Debug Mode: {ENV_CONFIG.app.debugMode ? 'ON' : 'OFF'}{' '}
            {/* 조건에 따라 'ON' 또는 'OFF' 표시 */}
          </Text>
        </View>

        {/* 사용법 안내 */}
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

// 스타일 정의 - StyleSheet.create를 사용하여 성능 최적화
// StyleSheet.create(): React Native에서 스타일을 정의하는 방법
// CSS와 비슷하지만 JavaScript 객체 형태로 작성
const styles = StyleSheet.create({
  // 객체 리터럴 문법: { 속성명: 값, 속성명: 값 }
  // 메인 컨테이너 스타일
  container: {
    flex: 1, // flexbox의 flex 속성 (전체 화면을 차지)
    backgroundColor: '#f8f9fa', // 배경색 (16진수 색상 코드)
    paddingTop: 50, // 상단 패딩 (상태바 고려)
  },

  // 뒤로가기 버튼 스타일
  backButton: {
    flexDirection: 'row', // flexbox 방향 (row: 가로, column: 세로)
    alignItems: 'center', // 교차축 정렬 (center: 중앙)
    paddingHorizontal: 20, // 좌우 패딩
    paddingVertical: 10, // 상하 패딩
    marginBottom: 10, // 하단 마진
  },

  // 뒤로가기 버튼 텍스트 스타일
  backButtonText: {
    marginLeft: 8, // 아이콘과 텍스트 사이 간격
    fontSize: 16, // 폰트 크기
    color: '#007AFF', // 파란색
    fontWeight: '500', // 중간 굵기
  },

  // 화면 제목 스타일
  title: {
    fontSize: 24, // 큰 폰트 크기
    fontWeight: 'bold', // 굵은 글씨
    textAlign: 'center', // 중앙 정렬
    marginBottom: 8, // 하단 마진
    color: '#343a40', // 진한 회색
  },

  // 부제목 스타일
  subtitle: {
    fontSize: 14, // 작은 폰트 크기
    textAlign: 'center', // 중앙 정렬
    marginBottom: 20, // 하단 마진
    color: '#6c757d', // 회색
  },

  // 로딩 컨테이너 스타일
  loadingContainer: {
    alignItems: 'center', // 중앙 정렬
    padding: 20, // 패딩
  },

  // 로딩 텍스트 스타일
  loadingText: {
    marginTop: 10, // 상단 마진
    fontSize: 16, // 폰트 크기
    color: '#007AFF', // 파란색
  },

  // 스크롤 뷰 스타일
  scrollView: {
    flex: 1, // 남은 공간을 모두 차지
    paddingHorizontal: 20, // 좌우 패딩
  },

  // 섹션 제목 스타일
  sectionTitle: {
    fontSize: 18, // 중간 폰트 크기
    fontWeight: 'bold', // 굵은 글씨
    marginTop: 20, // 상단 마진
    marginBottom: 10, // 하단 마진
    color: '#495057', // 진한 회색
  },

  // 버튼 기본 스타일
  button: {
    backgroundColor: '#007AFF', // 파란색 배경
    paddingVertical: 15, // 상하 패딩
    paddingHorizontal: 20, // 좌우 패딩
    borderRadius: 8, // 둥근 모서리
    marginBottom: 10, // 하단 마진
    alignItems: 'center', // 중앙 정렬
  },

  // 버튼 텍스트 스타일
  buttonText: {
    color: 'white', // 흰색 텍스트
    fontSize: 16, // 폰트 크기
    fontWeight: '600', // 중간 굵기
  },

  // 정보 컨테이너 스타일 (성공 메시지용)
  infoContainer: {
    backgroundColor: '#d4edda', // 연한 녹색 배경
    padding: 15, // 패딩
    borderRadius: 8, // 둥근 모서리
    marginVertical: 10, // 상하 마진
  },

  // 정보 텍스트 스타일
  infoText: {
    color: '#155724', // 진한 녹색
    fontSize: 14, // 폰트 크기
    fontWeight: '500', // 중간 굵기
  },

  // 안내 컨테이너 스타일 (사용법 안내용)
  instructionContainer: {
    backgroundColor: '#e2e3e5', // 연한 회색 배경
    padding: 15, // 패딩
    borderRadius: 8, // 둥근 모서리
    marginVertical: 20, // 상하 마진
  },

  // 안내 제목 스타일
  instructionTitle: {
    fontSize: 16, // 폰트 크기
    fontWeight: 'bold', // 굵은 글씨
    marginBottom: 8, // 하단 마진
    color: '#495057', // 진한 회색
  },

  // 안내 텍스트 스타일
  instructionText: {
    fontSize: 14, // 폰트 크기
    lineHeight: 20, // 줄 간격
    color: '#6c757d', // 회색
  },
});

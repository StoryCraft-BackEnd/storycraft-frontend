/**
 * API 모듈 중앙 집중화 인덱스
 *
 * 이 파일은 모든 API 관련 모듈들을 중앙에서 관리하고 외부로 노출하는 역할을 합니다.
 * 다른 컴포넌트나 화면에서 API 함수를 사용할 때 이 파일을 통해 import하면 됩니다.
 *
 * 장점:
 * - 일관된 import 경로 제공
 * - API 함수들의 중앙 관리
 * - 코드 유지보수성 향상
 * - 의존성 관리 최적화
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 핵심 API 클라이언트 및 유틸리티 export =====

/**
 * API 클라이언트 및 기본 유틸리티 함수들
 *
 * 모든 HTTP 통신의 기반이 되는 API 클라이언트와 서버 연결 확인 함수를 export합니다.
 * 다른 모듈들이 이 클라이언트를 통해 일관된 방식으로 API 통신을 수행합니다.
 */
export {
  apiClient, // Axios 기반 HTTP 클라이언트 인스턴스 (요청/응답 인터셉터 포함)
  checkServerConnection, // 서버 연결 상태 확인 함수 (헬스체크용)
} from './client';

// ===== 인증 관련 API 함수들 export =====

/**
 * 사용자 인증 및 토큰 관리 함수들
 *
 * 회원가입, 로그인, 로그아웃, 토큰 관리 등 사용자 인증과 관련된 모든 API 함수들을 export합니다.
 * 이 함수들은 사용자의 신원을 확인하고 API 접근 권한을 관리합니다.
 */
export {
  signup, // 회원가입 함수 (POST /auth/signup)
  login, // 로그인 함수 (POST /auth/login)
  logout, // 로그아웃 함수 (클라이언트 측 토큰 삭제)
  getStoredToken, // 저장된 토큰 확인 함수
  setToken, // 토큰 수동 설정 함수 (테스트용)
  refreshAccessToken, // 만료된 액세스 토큰 갱신 함수
  getStoredUserId, // 저장된 사용자 ID 확인 함수
} from './authApi';

/**
 * 인증 관련 TypeScript 타입 정의들
 *
 * 인증 API의 요청과 응답에 사용되는 타입들을 export합니다.
 * TypeScript의 타입 안전성을 보장하고 개발자 경험을 향상시킵니다.
 */
export type {
  SignupRequest, // 회원가입 요청 데이터 타입
  SignupResponse, // 회원가입 응답 데이터 타입
  LoginRequest, // 로그인 요청 데이터 타입 (이메일, 비밀번호)
  LoginResponse, // 로그인 응답 데이터 타입 (토큰, 사용자 정보)
} from './authApi';

// ===== 아이 프로필 관련 API 함수들 export =====

/**
 * 아이 프로필 CRUD 작업 함수들
 *
 * 아이 프로필의 생성, 조회, 수정, 삭제(CRUD) 작업을 수행하는 API 함수들을 export합니다.
 * 모든 함수는 인증 토큰이 필요하며, 사용자별로 격리된 데이터를 다룹니다.
 */
export {
  createChild, // 새 아이 프로필 생성 함수 (POST /children)
  getChildren, // 모든 아이 프로필 목록 조회 함수 (GET /children)
  getChild, // 특정 아이 프로필 상세 조회 함수 (GET /children/{id})
  updateChild, // 아이 프로필 정보 수정 함수 (PUT /children/{id})
  deleteChild, // 아이 프로필 삭제 함수 (DELETE /children/{id})
} from './childrenApi';

/**
 * 아이 프로필 관련 TypeScript 타입 정의들
 *
 * 프로필 API의 요청과 응답에 사용되는 타입들을 export합니다.
 * 데이터 구조의 일관성을 보장하고 런타임 에러를 방지합니다.
 */
export type {
  CreateChildRequest, // 프로필 생성 요청 데이터 타입 (이름, 나이, 학습레벨)
  CreateChildResponse, // 프로필 생성 응답 데이터 타입 (생성된 ID 포함)
  Child, // 완전한 프로필 데이터 타입 (모든 필드 포함)
} from './childrenApi';

// ===== 공지사항 및 이벤트 관련 API 함수들 export =====

/**
 * 공지사항 및 이벤트 조회 함수들
 *
 * 공지사항과 이벤트의 목록 조회 및 상세 조회 기능을 제공하는 API 함수들을 export합니다.
 * 공지사항은 중요도 순으로 정렬되며, 이벤트는 진행 상태에 따라 분류됩니다.
 */
export {
  getNotices, // 공지사항 목록 조회 함수 (GET /api/notices)
  getNoticeDetail, // 공지사항 상세 조회 함수 (GET /api/notices/{id})
  getOngoingEvents, // 진행중인 이벤트 목록 조회 함수 (GET /api/events/ongoing)
  getPastEvents, // 지난 이벤트 목록 조회 함수 (GET /api/events/past)
  getEventDetail, // 이벤트 상세 조회 함수 (GET /api/events/{id})
} from './noticeEventApi';

/**
 * 공지사항 및 이벤트 관련 TypeScript 타입 정의들
 *
 * 공지사항과 이벤트 API의 요청과 응답에 사용되는 타입들을 export합니다.
 * 데이터 구조의 일관성을 보장하고 런타임 에러를 방지합니다.
 */
export type {
  Notice, // 공지사항 데이터 타입
  NoticeListResponse, // 공지사항 목록 응답 타입
  NoticeDetailResponse, // 공지사항 상세 응답 타입
  Event, // 이벤트 데이터 타입
  EventListResponse, // 이벤트 목록 응답 타입
  EventDetailResponse, // 이벤트 상세 응답 타입
} from './noticeEventApi';

// ===== 자녀별 학습 통계 관련 API 함수들 export =====

/**
 * 자녀별 학습 통계 조회 함수들
 *
 * 자녀의 학습 성과와 통계 데이터를 조회하는 API 함수들을 export합니다.
 * 생성한 동화 수, 완성한 동화 수, 학습한 단어 수, 퀴즈 성과, 총 학습 시간 등을 제공합니다.
 */
export {
  getChildStatistics, // 자녀별 학습 통계 조회 함수 (GET /statistics/children/{id})
  saveLearningTime, // 총 학습 시간 저장 함수 (POST /statistics/learning-time)
  statisticsUtils, // 통계 데이터 유틸리티 함수들 (시간 포맷팅, 완성률 계산 등)
} from './statisticsApi';

/**
 * 자녀별 학습 통계 관련 TypeScript 타입 정의들
 *
 * 학습 통계 API의 요청과 응답에 사용되는 타입들을 export합니다.
 * 데이터 구조의 일관성을 보장하고 런타임 에러를 방지합니다.
 */
export type {
  ChildStatistics, // 자녀별 학습 통계 데이터 타입
  StatisticsApiResponse, // 통계 API 응답 래퍼 타입
  SaveLearningTimeRequest, // 학습 시간 저장 요청 데이터 타입
  SaveLearningTimeResponse, // 학습 시간 저장 응답 데이터 타입
} from './statisticsApi';

// ===== 학습시간 추적 관련 유틸리티 함수들 export =====

/**
 * 학습시간 측정 및 추적 함수들
 *
 * 프로필 선택 후 메인화면 진입부터 앱 종료까지의 학습시간을 측정하고
 * 백엔드에 자동으로 저장하는 기능을 제공합니다.
 */
export {
  startLearningTimeTracking, // 학습시간 측정 시작
  stopLearningTimeTracking, // 학습시간 측정 중단
  getCurrentLearningData, // 현재 학습시간 데이터 조회
  isLearningTimeTracking, // 학습시간 측정 상태 확인
  getCurrentTotalLearningTime, // 현재까지의 총 학습시간 조회
  formatLearningTime, // 학습시간 포맷팅
  initializeLearningTimeTracker, // 학습시간 추적기 초기화
  loadLearningTimeFromStorage, // 로컬에서 학습시간 데이터 불러오기
} from '../utils/learningTimeTracker';

// ===== 단어 조회 및 저장 관련 API 함수들 export =====

/**
 * 단어 조회 및 저장 함수들
 *
 * 영어 단어를 조회하고 사용자 사전에 저장하는 API 함수들을 export합니다.
 * 사용자 ID와 자녀 프로필 ID를 기반으로 단어를 저장합니다.
 */
export {
  saveWord, // 단어 조회 및 저장 함수 (POST /dictionaries/words/save)
  saveWordsByStory, // 동화 ID로 단어 추출 및 저장 함수 (POST /dictionaries/words/save-by-story)
  getAllWordsByChild, // 자녀별 저장된 모든 단어 조회 함수 (GET /dictionaries/words/list)
  getWordsByStory, // 동화 ID로 저장된 모든 단어 조회 함수 (GET /dictionaries/words/by-story)
} from './dictionaryApi';

/**
 * 단어 조회 및 저장 관련 TypeScript 타입 정의들
 *
 * 단어 API의 요청과 응답에 사용되는 타입들을 export합니다.
 * 데이터 구조의 일관성을 보장하고 런타임 에러를 방지합니다.
 */
export type {
  SaveWordRequest, // 단어 저장 요청 데이터 타입
  SaveWordResponse, // 단어 저장 응답 데이터 타입
} from './dictionaryApi';

/**
 * 단어 사전 API 테스트 함수들
 *
 * 단어 조회 및 저장 API의 정상 동작을 검증하는 테스트 함수들을 export합니다.
 * 개발 및 디버깅 목적으로 사용할 수 있습니다.
 */
export {
  testSaveWord, // 단일 단어 저장 테스트 함수
  testMultipleWords, // 다중 단어 저장 테스트 함수
} from './dictionaryTestApi';

// ===== API 테스트 함수들 export =====

/**
 * 개발 및 디버깅용 API 테스트 함수들
 *
 * 각 API 엔드포인트의 정상 동작을 확인하고 테스트하는 함수들을 export합니다.
 * 개발 중이나 문제 진단 시 API의 동작을 검증하는 데 사용됩니다.
 */
export {
  testServerConnection, // 서버 연결 상태 테스트 함수
  testCreateChild, // 프로필 생성 API 테스트 함수
  testGetChildren, // 프로필 목록 조회 API 테스트 함수
  testGetChild, // 특정 프로필 조회 API 테스트 함수
  testUpdateChild, // 프로필 수정 API 테스트 함수
  testDeleteChild, // 프로필 삭제 API 테스트 함수
  runAllApiTests, // 모든 API 종합 테스트 실행 함수
  quickCreateTest, // 빠른 프로필 생성 테스트 함수
} from './apiTest';

// ===== 인증 API 테스트 함수들 export =====

/**
 * 인증 관련 API 테스트 함수들
 *
 * 회원가입, 로그인, 로그아웃, 토큰 관리 등 인증 API의 정상 동작을 확인하는 함수들을 export합니다.
 * 인증 플로우 전체를 테스트하고 토큰 관리가 올바르게 작동하는지 검증합니다.
 */
export {
  testSignup, // 회원가입 API 테스트 함수 (고유 이메일로 자동 생성)
  testLogin, // 로그인 API 테스트 함수 (토큰 발급 확인)
  testLogout, // 로그아웃 API 테스트 함수 (토큰 정리 확인)
  testTokenCheck, // 저장된 토큰 확인 테스트 함수
  testEmailCheck, // 이메일 중복 확인 API 테스트 함수
  testNicknameCheck, // 닉네임 중복 확인 API 테스트 함수
  runAllAuthTests, // 모든 인증 API 종합 테스트 실행 함수
} from './authTestApi';

// ===== 사용 예시 및 가이드 =====

/**
 * API 모듈 사용 예시
 *
 * 이 인덱스 파일을 통해 API 함수들을 import하고 사용하는 방법:
 *
 * @example
 * ```typescript
 * // 인증 관련 API 사용
 * import { login, logout, getStoredToken } from '@/shared/api';
 *
 * const handleLogin = async (email: string, password: string) => {
 *   try {
 *     const result = await login({ email, password });
 *     console.log('로그인 성공:', result.data.user.nickname);
 *   } catch (error) {
 *     console.error('로그인 실패:', error.message);
 *   }
 * };
 *
 * // 프로필 관련 API 사용
 * import { createChild, getChildren, updateChild } from '@/shared/api';
 *
 * const createNewProfile = async () => {
 *   const profile = await createChild({
 *     name: '새로운 아이',
 *     age: 7,
 *     learningLevel: '초급'
 *   });
 *   return profile;
 * };
 *
 * // 테스트 함수 사용
 * import { runAllApiTests, testServerConnection } from '@/shared/api';
 *
 * const runDiagnostics = async () => {
 *   const isConnected = await testServerConnection();
 *   if (isConnected) {
 *     await runAllApiTests();
 *   }
 * };
 *
 * // 타입 정의 사용
 * import type { Child, CreateChildRequest, LoginResponse } from '@/shared/api';
 *
 * const processProfile = (profile: Child) => {
 *   console.log(`처리 중: ${profile.name} (${profile.age}세)`);
 * };
 * ```
 */

// ===== 모듈 정보 및 메타데이터 =====

/**
 * 현재 API 모듈의 버전 및 상태 정보
 *
 * 이 상수들은 디버깅이나 버전 관리 시 유용한 정보를 제공합니다.
 */
export const API_MODULE_INFO = {
  version: '1.0.0', // API 모듈 버전
  lastUpdated: '2025-01-01', // 마지막 업데이트 날짜
  description: 'StoryCraft API 모듈', // 모듈 설명
  endpoints: {
    // 제공하는 API 엔드포인트 목록
    auth: [
      'POST /auth/signup', // 회원가입
      'POST /auth/login', // 로그인
      'POST /auth/refresh', // 토큰 갱신
    ],
    children: [
      'GET /children', // 프로필 목록 조회
      'POST /children', // 프로필 생성
      'GET /children/{id}', // 특정 프로필 조회
      'PUT /children/{id}', // 프로필 수정
      'DELETE /children/{id}', // 프로필 삭제
    ],
    notices: [
      'GET /api/notices', // 공지사항 목록 조회
      'GET /api/notices/{id}', // 공지사항 상세 조회
    ],
    events: [
      'GET /api/events/ongoing', // 진행중인 이벤트 목록 조회
      'GET /api/events/past', // 지난 이벤트 목록 조회
      'GET /api/events/{id}', // 이벤트 상세 조회
    ],
    statistics: [
      'GET /statistics/children/{id}', // 자녀별 학습 통계 조회
    ],
    health: [
      'GET /health', // 서버 상태 확인
    ],
  },
} as const;

/**
 * 권장되는 API 사용 패턴
 *
 * 개발자들이 API를 올바르게 사용할 수 있도록 권장 패턴을 제시합니다.
 */
export const API_USAGE_PATTERNS = {
  authentication: {
    description: '인증 관련 API는 순서대로 사용하세요',
    sequence: [
      '1. 회원가입 (signup) 또는 로그인 (login)',
      '2. 토큰 자동 저장 확인',
      '3. 인증이 필요한 API 호출 (토큰 자동 포함)',
      '4. 토큰 만료 시 자동 갱신',
      '5. 로그아웃 시 토큰 정리 (logout)',
    ],
  },
  profileManagement: {
    description: '프로필 관리는 CRUD 패턴을 따르세요',
    sequence: [
      '1. 기존 프로필 목록 조회 (getChildren)',
      '2. 새 프로필 생성 (createChild)',
      '3. 특정 프로필 조회 (getChild)',
      '4. 프로필 정보 수정 (updateChild)',
      '5. 불필요한 프로필 삭제 (deleteChild)',
    ],
  },
  errorHandling: {
    description: '에러 처리 모범 사례',
    practices: [
      'try-catch 블록으로 API 호출 감싸기',
      '401 에러는 자동으로 토큰 갱신 시도',
      '네트워크 에러 시 사용자 친화적 메시지 표시',
      '서버 에러 시 재시도 로직 구현 고려',
    ],
  },
} as const;

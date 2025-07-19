/**
 * 환경 설정 관리
 *
 * .env 파일 대신 TypeScript로 환경 설정을 관리합니다.
 * 타입 안전성과 IDE 지원을 받을 수 있으며, 컴파일 타임에 오류를 발견할 수 있습니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 환경 설정 타입 정의 =====

/**
 * 환경 설정 인터페이스
 *
 * 앱에서 사용되는 모든 환경 변수와 설정값들을 타입 안전하게 정의합니다.
 */
export interface EnvironmentConfig {
  // API 서버 설정
  api: {
    baseUrl: string; // 완전한 API 기본 URL
    host: string; // API 서버 호스트 주소
    port: number; // API 서버 포트 번호
    protocol: 'http' | 'https'; // 통신 프로토콜
    path: string; // API 기본 경로
    timeout: number; // 요청 타임아웃 (밀리초)
  };

  // 앱 환경 설정
  app: {
    environment: 'development' | 'staging' | 'production'; // 실행 환경
    name: string; // 앱 이름
    version: string; // 앱 버전
    debugMode: boolean; // 디버그 모드 여부
  };

  // 기능 플래그 설정
  features: {
    enableAnalytics: boolean; // 분석 기능 활성화 여부
    enablePushNotifications: boolean; // 푸시 알림 활성화 여부
    enableOfflineMode: boolean; // 오프라인 모드 활성화 여부
  };
}

// ===== 환경별 설정 정의 =====

/**
 * 개발 환경 설정
 *
 * 로컬 개발 및 테스트 시 사용되는 설정입니다.
 * 실제 서버 주소와 포트를 직접 지정합니다.
 */
const developmentConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://54.180.180.213:8080', // 개발 서버 전체 URL (Swagger 스펙에 맞춤)
    host: '54.180.180.213', // 개발 서버 호스트
    port: 8080, // 개발 서버 포트
    protocol: 'http', // HTTP 프로토콜 사용
    path: '', // API 기본 경로 없음 (Swagger에서 /api 경로 사용 안 함)
    timeout: 10000, // 10초 타임아웃
  },
  app: {
    environment: 'development', // 개발 환경
    name: 'StoryCraft Dev', // 개발용 앱 이름
    version: '1.0.0-dev', // 개발 버전
    debugMode: true, // 디버그 모드 활성화
  },
  features: {
    enableAnalytics: false, // 개발 시 분석 비활성화
    enablePushNotifications: false, // 개발 시 푸시 알림 비활성화
    enableOfflineMode: true, // 오프라인 모드 활성화
  },
};

/**
 * 스테이징 환경 설정
 *
 * 테스트 및 QA 단계에서 사용되는 설정입니다.
 * 프로덕션과 유사하지만 별도의 테스트 서버를 사용합니다.
 */
const stagingConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://54.180.180.213:8080', // 스테이징 서버 (동일한 서버 사용)
    host: '54.180.180.213', // 스테이징 서버 호스트
    port: 8080, // 스테이징 서버 포트
    protocol: 'http', // HTTP 프로토콜 (테스트용)
    path: '', // API 기본 경로 없음 (Swagger 스펙에 맞춤)
    timeout: 15000, // 15초 타임아웃 (조금 더 길게)
  },
  app: {
    environment: 'staging', // 스테이징 환경
    name: 'StoryCraft Staging', // 스테이징용 앱 이름
    version: '1.0.0-staging', // 스테이징 버전
    debugMode: true, // 디버그 모드 활성화 (테스트용)
  },
  features: {
    enableAnalytics: true, // 분석 기능 테스트
    enablePushNotifications: true, // 푸시 알림 테스트
    enableOfflineMode: true, // 오프라인 모드 테스트
  },
};

/**
 * 프로덕션 환경 설정
 *
 * 실제 배포 시 사용되는 설정입니다.
 * 보안과 성능을 최우선으로 설정합니다.
 */
const productionConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://api.storycraft.com', // 프로덕션 서버 URL (HTTPS)
    host: 'api.storycraft.com', // 프로덕션 도메인
    port: 443, // HTTPS 기본 포트
    protocol: 'https', // HTTPS 프로토콜 사용
    path: '', // API 기본 경로
    timeout: 30000, // 30초 타임아웃
  },
  app: {
    environment: 'production', // 프로덕션 환경
    name: 'StoryCraft', // 정식 앱 이름
    version: '1.0.0', // 정식 버전
    debugMode: false, // 디버그 모드 비활성화
  },
  features: {
    enableAnalytics: true, // 분석 기능 활성화
    enablePushNotifications: true, // 푸시 알림 활성화
    enableOfflineMode: false, // 오프라인 모드 비활성화 (선택적)
  },
};

// ===== 환경 감지 및 설정 선택 =====

/**
 * 현재 실행 환경을 감지하는 함수
 *
 * 기본적으로 개발 환경으로 설정합니다.
 *
 * @returns {string} 현재 환경 ('development' | 'staging' | 'production')
 */
const detectEnvironment = (): 'development' | 'staging' | 'production' => {
  // 기본적으로 개발 환경으로 설정
  console.log('🔧 개발 환경으로 설정됨');
  return 'development';
};

/**
 * 현재 환경에 맞는 설정을 반환하는 함수
 *
 * 감지된 환경에 따라 적절한 설정 객체를 반환합니다.
 *
 * @returns {EnvironmentConfig} 현재 환경에 맞는 설정 객체
 */
const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentEnv = detectEnvironment();

  switch (currentEnv) {
    case 'development':
      console.log('📋 개발 환경 설정 로드됨');
      return developmentConfig;

    case 'staging':
      console.log('📋 스테이징 환경 설정 로드됨');
      return stagingConfig;

    case 'production':
      console.log('📋 프로덕션 환경 설정 로드됨');
      return productionConfig;

    default:
      console.warn('⚠️ 알 수 없는 환경, 개발 설정으로 fallback');
      return developmentConfig;
  }
};

// ===== 설정 검증 함수 =====

/**
 * 환경 설정의 유효성을 검증하는 함수
 *
 * 로드된 설정이 올바른지 확인하고 잠재적 문제를 경고합니다.
 *
 * @param config - 검증할 환경 설정 객체
 */
const validateEnvironmentConfig = (config: EnvironmentConfig): void => {
  console.log('🔍 환경 설정 검증 시작...');

  // API URL 유효성 검사
  try {
    new URL(config.api.baseUrl);
    console.log('✅ API URL 형식이 올바릅니다');
  } catch (error) {
    console.error('❌ 잘못된 API URL 형식:', config.api.baseUrl, error);
  }

  // 포트 번호 검증
  if (config.api.port < 1 || config.api.port > 65535) {
    console.warn('⚠️ 포트 번호가 유효 범위를 벗어남:', config.api.port);
  } else {
    console.log('✅ 포트 번호가 유효합니다');
  }

  // 타임아웃 검증
  if (config.api.timeout < 1000) {
    console.warn('⚠️ 타임아웃이 너무 짧습니다:', config.api.timeout, 'ms');
  } else {
    console.log('✅ 타임아웃 설정이 적절합니다');
  }

  // 프로토콜 검증
  if (!['http', 'https'].includes(config.api.protocol)) {
    console.error('❌ 지원되지 않는 프로토콜:', config.api.protocol);
  } else {
    console.log('✅ 프로토콜이 유효합니다');
  }

  console.log('✅ 환경 설정 검증 완료');
};

// ===== 최종 설정 객체 및 export =====

/**
 * 현재 환경에 맞는 최종 설정 객체
 *
 * 앱의 모든 부분에서 이 객체를 통해 환경 설정에 접근할 수 있습니다.
 */
export const ENV_CONFIG: EnvironmentConfig = getEnvironmentConfig();

// 환경 설정 검증 및 디버깅 정보 출력
console.log('\n🔧 ===== Environment Configuration Debug Info =====');
console.log('📋 현재 환경 설정:');
console.log(`   🌐 Environment: ${ENV_CONFIG.app.environment}`);
console.log(`   📱 App Name: ${ENV_CONFIG.app.name}`);
console.log(`   🔢 App Version: ${ENV_CONFIG.app.version}`);
console.log(`   🐛 Debug Mode: ${ENV_CONFIG.app.debugMode}`);
console.log('📋 API 설정:');
console.log(`   🌐 Base URL: ${ENV_CONFIG.api.baseUrl}`);
console.log(`   🏠 Host: ${ENV_CONFIG.api.host}`);
console.log(`   🔌 Port: ${ENV_CONFIG.api.port}`);
console.log(`   🔒 Protocol: ${ENV_CONFIG.api.protocol}`);
console.log(`   📂 Path: ${ENV_CONFIG.api.path}`);
console.log(`   ⏱️ Timeout: ${ENV_CONFIG.api.timeout}ms`);
console.log('📋 기능 플래그:');
console.log(`   📊 Analytics: ${ENV_CONFIG.features.enableAnalytics}`);
console.log(`   🔔 Push Notifications: ${ENV_CONFIG.features.enablePushNotifications}`);
console.log(`   📱 Offline Mode: ${ENV_CONFIG.features.enableOfflineMode}`);
console.log('🔧 =============================================\n');

// 설정 검증 실행
validateEnvironmentConfig(ENV_CONFIG);

// ===== 유틸리티 함수들 =====

/**
 * 특정 환경 설정을 강제로 로드하는 함수 (테스트용)
 *
 * @param env - 강제로 로드할 환경
 * @returns {EnvironmentConfig} 해당 환경의 설정 객체
 */
export const getConfigForEnvironment = (
  env: 'development' | 'staging' | 'production'
): EnvironmentConfig => {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

/**
 * 현재 환경이 개발 환경인지 확인하는 함수
 *
 * @returns {boolean} 개발 환경 여부
 */
export const isDevelopment = (): boolean => {
  return ENV_CONFIG.app.environment === 'development';
};

/**
 * 현재 환경이 프로덕션 환경인지 확인하는 함수
 *
 * @returns {boolean} 프로덕션 환경 여부
 */
export const isProduction = (): boolean => {
  return ENV_CONFIG.app.environment === 'production';
};

/**
 * 환경 설정 요약 정보를 문자열로 반환하는 함수
 *
 * @returns {string} 환경 설정 요약
 */
export const getEnvironmentSummary = (): string => {
  return `Environment: ${ENV_CONFIG.app.environment}, API: ${ENV_CONFIG.api.baseUrl}, Debug: ${ENV_CONFIG.app.debugMode}`;
};

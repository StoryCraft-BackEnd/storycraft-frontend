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
    debugMode: boolean; // 디버그 모드 여부
  };
}

// ===== 기본 설정 =====

/**
 * 기본 환경 설정
 */
const defaultConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://54.180.180.213:8080', // 개발 서버 전체 URL (Swagger 스펙에 맞춤)
    host: '54.180.180.213', // 개발 서버 호스트
    port: 8080, // 개발 서버 포트
    protocol: 'http', // HTTP 프로토콜 사용
    path: '', // API 기본 경로 없음 (Swagger에서 /api 경로 사용 안 함)
    timeout: 10000, // 10초 타임아웃
  },
  app: {
    debugMode: true, // 디버그 모드 활성화
  },
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
 * 최종 설정 객체
 *
 * 앱의 모든 부분에서 이 객체를 통해 환경 설정에 접근할 수 있습니다.
 */
export const ENV_CONFIG: EnvironmentConfig = defaultConfig;

// 환경 설정 검증 및 디버깅 정보 출력
console.log('\n🔧 ===== Environment Configuration Debug Info =====');
console.log('📋 API 설정:');
console.log(`   🌐 Base URL: ${ENV_CONFIG.api.baseUrl}`);
console.log(`   🏠 Host: ${ENV_CONFIG.api.host}`);
console.log(`   🔌 Port: ${ENV_CONFIG.api.port}`);
console.log(`   🔒 Protocol: ${ENV_CONFIG.api.protocol}`);
console.log(`   📂 Path: ${ENV_CONFIG.api.path}`);
console.log(`   ⏱️ Timeout: ${ENV_CONFIG.api.timeout}ms`);
console.log('📋 앱 설정:');
console.log(`   🐛 Debug Mode: ${ENV_CONFIG.app.debugMode}`);
console.log('🔧 =============================================\n');

// 설정 검증 실행
validateEnvironmentConfig(ENV_CONFIG);

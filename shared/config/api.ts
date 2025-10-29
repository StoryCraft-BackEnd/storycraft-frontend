/**
 * API 서버 설정 관리
 *
 * environment.ts에서 정의된 환경 설정을 기반으로 API 클라이언트 설정을 제공합니다.
 * TypeScript 환경 설정 파일을 사용하여 타입 안전성과 안정성을 보장합니다.
 *
 * @author StoryCraft Team
 * @version 4.0.0
 * @since 2025-01-01
 */

// ===== 환경 설정 import =====
// TypeScript 환경 설정 파일에서 설정을 가져옵니다
import { ENV_CONFIG } from './environment';

// ===== API 설정 타입 정의 =====

/**
 * API 클라이언트 설정 타입 정의
 *
 * Axios 클라이언트에서 사용되는 설정 정보의 구조를 정의합니다.
 */
interface ApiClientConfiguration {
  BASE_URL: string; // 완전한 API 기본 URL
  HOST: string; // API 서버 호스트 주소
  PORT: number; // API 서버 포트 번호
  PROTOCOL: string; // 통신 프로토콜
  API_PATH: string; // API 경로
  TIMEOUT: number; // 요청 타임아웃 (밀리초)
  ENVIRONMENT: string; // 환경 설정
}

// ===== 최종 API 설정 객체 생성 =====

/**
 * 최종 API 설정 객체
 *
 * environment.ts에서 로드된 환경 설정을 기반으로 API 클라이언트 설정을 생성합니다.
 * 이 객체는 앱의 모든 HTTP 통신에서 사용됩니다.
 */
export const API_CONFIG: ApiClientConfiguration = {
  BASE_URL: ENV_CONFIG.api.baseUrl, // 환경 설정에서 가져온 완전한 URL
  HOST: ENV_CONFIG.api.host, // 환경 설정에서 가져온 호스트
  PORT: ENV_CONFIG.api.port, // 환경 설정에서 가져온 포트
  PROTOCOL: ENV_CONFIG.api.protocol, // 환경 설정에서 가져온 프로토콜
  API_PATH: ENV_CONFIG.api.path, // 환경 설정에서 가져온 API 경로
  TIMEOUT: ENV_CONFIG.api.timeout, // 환경 설정에서 가져온 타임아웃
  ENVIRONMENT: 'development', // 기본 환경으로 설정
};

// ===== 유틸리티 함수들 =====

/**
 * 동적 URL 생성 함수
 *
 * 특정 엔드포인트나 다른 설정으로 URL을 동적으로 생성할 때 사용합니다.
 *
 * @param endpoint - API 엔드포인트 (예: '/users', '/auth/login')
 * @param customHost - 커스텀 호스트 (선택적)
 * @param customPort - 커스텀 포트 (선택적)
 * @returns {string} 완전한 API URL
 *
 * @example
 * ```typescript
 * // 기본 설정으로 URL 생성
 * buildApiUrl('/users/123')
 * // 결과: "https://dev.childstorycraft.com/api/users/123"
 *
 * // 커스텀 호스트와 포트로 URL 생성
 * buildApiUrl('/auth/login', 'localhost', 3000)
 * // 결과: "http://localhost:3000/api/auth/login"
 * ```
 */
export const buildApiUrl = (
  endpoint: string = '',
  customHost?: string,
  customPort?: number
): string => {
  // 사용할 호스트, 포트, 프로토콜 결정 (커스텀 값이 있으면 우선 사용)
  const host = customHost || API_CONFIG.HOST;
  const port = customPort || API_CONFIG.PORT;
  const protocol = API_CONFIG.PROTOCOL;

  // 엔드포인트가 /로 시작하지 않으면 추가
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 완전한 URL 조립
  const fullUrl = `${protocol}://${host}:${port}${API_CONFIG.API_PATH}${cleanEndpoint}`;

  // 디버깅 정보 출력 (개발 환경에서만)
  if (ENV_CONFIG.app.debugMode) {
    console.log('🔧 동적 URL 생성:', {
      endpoint: cleanEndpoint,
      host,
      port,
      protocol,
      result: fullUrl,
    });
  }

  return fullUrl;
};

/**
 * 설정 정보 요약 함수
 *
 * 현재 API 설정을 문자열로 포맷하여 로깅이나 디버깅에 사용할 수 있습니다.
 *
 * @returns {string} 포맷된 설정 정보
 *
 * @example
 * ```typescript
 * console.log(getConfigSummary());
 * // 출력: "API Config - URL: https://dev.childstorycraft.com/api, Timeout: 10000ms, Env: development"
 * ```
 */
export const getConfigSummary = (): string => {
  return `API Config - URL: ${API_CONFIG.BASE_URL}, Timeout: ${API_CONFIG.TIMEOUT}ms, Env: ${API_CONFIG.ENVIRONMENT}`;
};

/**
 * 현재 API 설정의 전체 정보를 반환하는 함수
 *
 * 디버깅이나 설정 확인 목적으로 사용됩니다.
 *
 * @returns {ApiClientConfiguration} 현재 API 설정 객체의 복사본
 */
export const getFullApiConfig = (): ApiClientConfiguration => {
  return { ...API_CONFIG };
};

// ===== 추가 유틸리티 exports =====

// 환경 설정 관련 유틸리티들을 re-export하여 편의성 제공
export {
  ENV_CONFIG, // 전체 환경 설정 객체
  type EnvironmentConfig, // 환경 설정 타입
} from './environment';

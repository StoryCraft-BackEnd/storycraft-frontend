/**
 * API 서버 설정 관리
 *
 * 환경 변수를 통해 다양한 환경에서 유연하게 API 서버 설정을 관리합니다.
 * .env 파일을 통해 환경별로 다른 설정을 적용할 수 있습니다.
 *
 * @author StoryCraft Team
 * @version 2.0.0
 */
import Constants from 'expo-constants';

// Metro Bundler의 IP 자동 감지 함수
function getDevServerIp() {
  // Expo Go 환경에서만 동작 (웹/프로덕션에서는 fallback)
  const debuggerHost = Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return 'localhost';
}

// 환경 변수에서 설정 읽기 (fallback 값 포함)
const getApiBaseUrl = (): string => {
  // 환경 변수에서 API URL 읽기
  const envApiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (envApiUrl) {
    return envApiUrl;
  }

  // 환경 변수가 없을 경우 기존 방식으로 fallback
  return process.env.NODE_ENV === 'production'
    ? 'https://api.storycraft.com/api'
    : `http://${getDevServerIp()}:8080/api`;
};

const getApiTimeout = (): number => {
  const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT;
  return envTimeout ? parseInt(envTimeout, 10) : 10000;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: getApiTimeout(),
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
};

// 디버깅을 위한 로깅 (개발 환경에서만)
if (__DEV__) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    TIMEOUT: API_CONFIG.TIMEOUT,
    ENVIRONMENT: API_CONFIG.ENVIRONMENT,
  });
}

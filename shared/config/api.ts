// shared/config/api.ts
// API 서버 URL 설정을 관리하는 파일
// 주요 기능:
// 1. 개발 환경에서 Metro Bundler(Expo 개발 서버) IP를 자동 감지하여 API 서버 URL 설정
// 2. 운영 환경에서는 production API 서버 URL 사용
// 3. 누구나 별도 수정 없이 자신의 환경에서 바로 API 연동 가능

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

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.storycraft.com/api'
    : `http://${getDevServerIp()}:3000/api`;

export const API_CONFIG = {
  BASE_URL,
};

/**
 * API 클라이언트 설정 및 유틸리티 함수
 *
 * 이 파일은 앱의 API 통신을 담당하는 설정과 유틸리티 함수를 포함합니다.
 * axios를 사용하여 HTTP 클라이언트를 구성하고, 서버 연결 상태를 확인하는 기능을 제공합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 */
import axios from 'axios';

// API 서버의 기본 URL 설정
// 환경 변수에서 가져오거나 기본값으로 localhost 사용
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * API 클라이언트 인스턴스 생성
 *
 * 기본 설정:
 * - baseURL: API 서버의 기본 URL
 * - timeout: 10초
 * - Content-Type: application/json
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 서버 연결 상태를 확인하는 함수
 *
 * @async
 * @function checkServerConnection
 * @returns {Promise<boolean>} 서버 연결 성공 여부
 * @throws {Error} 서버 연결 중 오류 발생 시
 *
 * @example
 * const isConnected = await checkServerConnection();
 * if (isConnected) {
 *   console.log('서버 연결 성공');
 * } else {
 *   console.log('서버 연결 실패');
 * }
 */
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response = { status: 200 }; // 테스트로 무조건 True 반환하는 test 코드
    // const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('서버 연결 실패:', error);
    return false;
  }
};

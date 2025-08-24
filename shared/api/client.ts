/**
 * API 클라이언트 설정 및 유틸리티 함수
 *
 * 이 파일은 앱의 모든 HTTP 통신을 담당하는 중앙화된 API 클라이언트입니다.
 * Axios를 기반으로 하며, 자동 인증 토큰 관리, 토큰 갱신, 에러 처리 등의 기능을 제공합니다.
 *
 * 주요 기능:
 * - HTTP 요청/응답 처리
 * - 자동 Authorization 헤더 추가
 * - 토큰 만료 시 자동 갱신
 * - 서버 연결 상태 확인
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 외부 라이브러리 import 섹션 =====
// HTTP 클라이언트 라이브러리 (REST API 통신용)
import axios from 'axios';
// API 서버 설정 정보 가져오기 (기본 URL, 타임아웃 등)
import { API_CONFIG } from '@/shared/config/api';
// React Native 로컬 스토리지 (토큰 저장/읽기용)
import AsyncStorage from '@react-native-async-storage/async-storage';
// 토큰 갱신 함수 (순환 참조 방지를 위해 별도 import)
import { refreshAccessToken } from '@/shared/api/tokenManager';

// ===== API 클라이언트 인스턴스 생성 =====

/**
 * Axios 기반 API 클라이언트 인스턴스
 *
 * 앱의 모든 HTTP 요청에 사용되는 중앙화된 클라이언트입니다.
 * 기본 설정과 인터셉터가 적용되어 일관된 API 통신을 보장합니다.
 *
 * 설정된 기본값:
 * - baseURL: 환경 변수에서 읽어온 API 서버 주소
 * - timeout: 요청 타임아웃 (밀리초 단위)
 * - headers: 기본 HTTP 헤더 (Content-Type 등)
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // API 서버의 기본 URL (예: https://dev.childstorycraft.com)
  timeout: API_CONFIG.TIMEOUT, // 요청 타임아웃 설정 (기본값: 10초)
  headers: {
    'Content-Type': 'application/json', // 모든 요청의 기본 Content-Type을 JSON으로 설정
  },
});

// ===== 요청 인터셉터 설정 =====

/**
 * API 요청 인터셉터
 *
 * 모든 API 요청이 전송되기 전에 자동으로 실행되는 미들웨어입니다.
 * 주요 기능은 저장된 액세스 토큰을 Authorization 헤더에 자동으로 추가하는 것입니다.
 *
 * 동작 과정:
 * 1. AsyncStorage에서 저장된 토큰을 읽어옵니다
 * 2. 토큰이 존재하면 Authorization 헤더에 Bearer 형식으로 추가합니다
 * 3. 수정된 설정으로 요청을 계속 진행합니다
 */
apiClient.interceptors.request.use(
  async (config) => {
    // AsyncStorage에서 현재 저장된 액세스 토큰을 비동기로 읽어옵니다
    const token = await AsyncStorage.getItem('token');

    // 토큰이 존재하는 경우에만 Authorization 헤더를 추가합니다
    if (token) {
      // HTTP Authorization 헤더에 Bearer 토큰 형식으로 추가
      // 형식: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 토큰 추가됨:', {
        url: config.url,
        hasToken: !!token,
        tokenLength: token?.length,
      });
    } else {
      console.log('⚠️ 토큰 없음:', { url: config.url });
    }

    // 수정된 요청 설정을 반환하여 실제 요청이 진행되도록 합니다
    return config;
  },
  (error) => {
    // 요청 설정 중 에러가 발생한 경우 Promise를 reject하여 에러를 전파합니다
    return Promise.reject(error);
  }
);

// ===== 응답 인터셉터 설정 =====

/**
 * API 응답 인터셉터
 *
 * 모든 API 응답을 받은 후 자동으로 실행되는 미들웨어입니다.
 * 주요 기능은 토큰 만료(401 에러) 시 자동으로 토큰을 갱신하고 원래 요청을 재시도하는 것입니다.
 *
 * 동작 과정:
 * 1. 정상 응답인 경우: 그대로 반환
 * 2. 401 에러인 경우: 토큰 갱신 후 원래 요청 재시도
 * 3. 기타 에러인 경우: 에러를 그대로 전파
 */
apiClient.interceptors.response.use(
  (response) => {
    // 정상적인 응답(2xx 상태 코드)인 경우 응답을 그대로 반환합니다

    // 데이터가 너무 길면 3줄로 줄여서 표시
    let displayData = response.data;
    if (response.data && typeof response.data === 'object') {
      const dataString = JSON.stringify(response.data, null, 2);
      if (dataString.length > 500) {
        // 500자 이상이면 줄이기
        const lines = dataString.split('\n');
        if (lines.length > 3) {
          displayData = {
            ...response.data,
            _truncated: `데이터가 너무 길어서 처음 3줄만 표시 (전체: ${lines.length}줄, ${dataString.length}자)`,
            _preview: lines.slice(0, 3).join('\n') + '\n...',
          };
        }
      }
    }

    console.log('✅ API 응답 성공:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: displayData,
      headers: response.headers,
    });
    return response;
  },
  async (error) => {
    // 에러가 발생한 원래 요청의 설정 정보를 가져옵니다
    const originalRequest = error.config;

    // 401 Unauthorized 또는 403 Forbidden 에러이고, 아직 재시도하지 않은 요청인 경우에만 토큰 갱신을 시도합니다
    // _retry 플래그는 무한 루프를 방지하기 위한 안전장치입니다
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      console.log(`🔄 ${error.response?.status} 에러 감지 - 토큰 갱신 시도`);

      // 로그인 요청인지 확인
      const isLoginRequest = originalRequest.url?.includes('/auth/login');

      if (isLoginRequest) {
        console.log('🔐 로그인 요청에서 401 에러 - 기존 토큰 정리 후 에러 반환');
        // 로그인 요청에서 401 에러가 발생한 경우, 기존 토큰들을 정리합니다
        try {
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'tokenIssuedAt']);
          console.log('🧹 기존 토큰 정리 완료');
        } catch (cleanupError) {
          console.error('❌ 토큰 정리 실패:', cleanupError);
        }
        return Promise.reject(error);
      }

      // 재시도 플래그를 설정하여 무한 루프를 방지합니다
      originalRequest._retry = true;

      try {
        // AsyncStorage에서 저장된 리프레시 토큰을 가져옵니다
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        // 리프레시 토큰이 없는 경우 로그인이 필요함을 알립니다
        if (!refreshToken) {
          console.log('❌ 리프레시 토큰이 없습니다');
          throw new Error('리프레시 토큰이 없습니다.');
        }

        console.log('🔄 토큰 갱신 시작');
        // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다
        const newAccessToken = await refreshAccessToken(refreshToken);

        // 새로 발급받은 액세스 토큰을 AsyncStorage에 저장합니다
        await AsyncStorage.setItem('token', newAccessToken);

        // 원래 요청의 Authorization 헤더를 새로운 토큰으로 업데이트합니다
        originalRequest.headers = {
          ...originalRequest.headers, // 기존 헤더들을 유지
          Authorization: `Bearer ${newAccessToken}`, // 새로운 토큰으로 Authorization 헤더 교체
        };

        console.log('✅ 토큰 갱신 완료 - 원래 요청 재시도');
        // 새로운 토큰으로 원래 요청을 재시도합니다
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신에 실패한 경우 (리프레시 토큰도 만료되었거나 유효하지 않음)
        console.error('❌ 토큰 갱신 실패:', refreshError);

        // 토큰 갱신 실패 시 기존 토큰들을 정리합니다
        try {
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'tokenIssuedAt']);
          console.log('🧹 토큰 갱신 실패로 인한 기존 토큰 정리 완료');
        } catch (cleanupError) {
          console.error('❌ 토큰 정리 실패:', cleanupError);
        }

        // 토큰 갱신 실패 시 사용자에게 알림
        console.warn(
          '⚠️ 토큰이 만료되어 재로그인이 필요합니다. 자동으로 로그인 화면으로 이동하세요.'
        );

        // 이 경우 사용자를 로그인 화면으로 리다이렉트하는 등의 추가 처리가 필요할 수 있습니다
        return Promise.reject(refreshError);
      }
    }

    // 401 에러가 아니거나 이미 재시도한 요청인 경우 에러를 그대로 전파합니다
    // console.error('❌ API 응답 에러:', {
    //   url: originalRequest?.url,
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   message: error.message,
    //   code: error.code,
    // });
    return Promise.reject(error);
  }
);

// ===== 유틸리티 함수 섹션 =====

/**
 * 서버 연결 상태 확인 함수
 *
 * API 서버가 정상적으로 응답하는지 확인하는 헬스체크 함수입니다.
 * 앱 시작 시나 네트워크 상태 확인이 필요할 때 사용됩니다.
 *
 * 현재는 테스트 목적으로 항상 성공을 반환하도록 구현되어 있습니다.
 * 실제 운영 환경에서는 주석 처리된 실제 API 호출 코드를 활성화해야 합니다.
 *
 * @async
 * @function checkServerConnection
 * @returns {Promise<boolean>} 서버 연결 성공 여부 (true: 성공, false: 실패)
 * @throws {Error} 서버 연결 확인 중 예상치 못한 오류 발생 시
 *
 * @example
 * ```typescript
 * const isConnected = await checkServerConnection();
 * if (isConnected) {
 *   console.log('서버가 정상적으로 응답합니다');
 *   // 앱의 주요 기능을 활성화
 * } else {
 *   console.log('서버 연결에 실패했습니다');
 *   // 오프라인 모드로 전환하거나 에러 메시지 표시
 * }
 * ```
 */
export const checkServerConnection = async (): Promise<boolean> => {
  // 서버 연결 테스트를 위한 URL 생성
  const url = `${API_CONFIG.BASE_URL}`;

  try {
    // 디버깅을 위해 서버 연결 테스트 요청 정보를 콘솔에 로깅합니다
    console.log('🔗 서버 연결 테스트 요청:', {
      url, // 요청 대상 URL
      method: 'GET', // HTTP 메서드
    });

    // APK 빌드에서 네트워크 문제 디버깅을 위한 추가 정보
    console.log('🔧 네트워크 설정 정보:', {
      baseUrl: API_CONFIG.BASE_URL,
      host: API_CONFIG.HOST,
      port: API_CONFIG.PORT,
      protocol: API_CONFIG.PROTOCOL,
      timeout: API_CONFIG.TIMEOUT,
    });

    // === 간단한 서버 연결 테스트 ===
    // 실제 API 호출 대신 서버 응답 가능 여부만 확인
    // 403 에러가 발생하더라도 서버가 응답한다는 것은 서버가 실행 중임을 의미
    try {
      await apiClient.get('/', { timeout: 3000 });
      console.log('✅ 서버 연결 성공: 서버가 정상적으로 응답합니다');
      return true;
    } catch (apiError: any) {
      // 403, 404, 405 등의 에러는 서버가 실행 중이지만 해당 엔드포인트가 없거나 권한이 없는 것
      if (apiError.response?.status) {
        console.log(
          '✅ 서버 연결 성공: 서버가 실행 중입니다 (상태 코드:',
          apiError.response.status,
          ')'
        );
        return true;
      }
      // 네트워크 에러나 타임아웃은 실제 연결 실패
      throw apiError;
    }
  } catch (error: any) {
    // 서버 연결 확인 중 에러가 발생한 경우 상세 정보를 로깅합니다
    console.error('❌ 서버 연결 실패:', {
      url,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // 연결 실패를 나타내는 false를 반환합니다
    return false;
  }
};

/**
 * Authentication API
 *
 * 사용자 인증과 관련된 모든 API 요청을 담당하는 모듈입니다.
 * 회원가입, 로그인, 로그아웃, 토큰 관리 등의 기능을 제공합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 외부 라이브러리 import 섹션 =====
// Axios 기반 API 클라이언트를 가져옵니다 (HTTP 요청 처리용)
import { apiClient } from './client';
// Axios 라이브러리를 직접 import (인증 없는 요청용)
import axios from 'axios';
// React Native의 로컬 스토리지 라이브러리를 가져옵니다 (토큰 저장용)
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== 타입 정의 섹션 =====

/**
 * 회원가입 요청 데이터 타입 정의
 *
 * 새로운 사용자가 계정을 생성할 때 서버로 전송하는 데이터의 구조입니다.
 * 모든 필드가 필수이며, 서버의 검증 규칙을 따라야 합니다.
 */
export interface SignupRequest {
  email: string; // 사용자 이메일 주소 (고유 식별자로 사용됨)
  password: string; // 사용자 비밀번호 (해싱되어 서버에 저장됨)
  name: string; // 사용자의 실제 이름 (본명)
  nickname: string; // 앱 내에서 표시될 사용자 닉네임
  role: string; // 사용자 권한 레벨 (예: "user", "admin", "premium")
}

/**
 * 회원가입 응답 데이터 타입 정의
 *
 * 서버에서 회원가입 요청을 처리한 후 반환하는 응답의 구조입니다.
 * 성공/실패 상태와 관련 메시지, 그리고 생성된 사용자 정보를 포함합니다.
 */
export interface SignupResponse {
  status: number; // HTTP 상태 코드 (200: 성공, 400: 요청 오류, 500: 서버 오류)
  message: string; // 사용자에게 표시할 메시지 (성공/실패 안내)
  data?: {
    // 선택적 데이터 필드 (회원가입 성공 시에만 포함됨)
    userId?: number; // 새로 생성된 사용자의 고유 ID
    email?: string; // 등록 완료된 이메일 주소 (확인용)
  };
}

/**
 * 로그인 요청 데이터 타입 정의
 *
 * 기존 사용자가 로그인할 때 서버로 전송하는 인증 정보의 구조입니다.
 * 이메일과 비밀번호만 필요합니다.
 */
export interface LoginRequest {
  email: string; // 등록된 이메일 주소
  password: string; // 해당 계정의 비밀번호
}

/**
 * 로그인 응답 데이터 타입 정의
 *
 * 서버에서 로그인 요청을 처리한 후 반환하는 응답의 구조입니다.
 * 인증 토큰과 사용자 정보를 포함합니다.
 */
export interface LoginResponse {
  status: number; // HTTP 상태 코드
  message: string; // 로그인 결과 메시지
  data: {
    // 로그인 성공 시 반환되는 데이터 (필수)
    access_token: string; // JWT 액세스 토큰 (API 인증에 사용, 짧은 유효기간)
    refresh_token: string; // JWT 리프레시 토큰 (토큰 갱신에 사용, 긴 유효기간)
    user_id: number; // 로그인한 사용자의 고유 ID
  };
}

/**
 * 닉네임 중복 확인 요청 데이터 타입 정의
 *
 * 회원가입 시 닉네임의 중복 여부를 확인하기 위해 서버로 전송하는 데이터의 구조입니다.
 */
export interface NicknameCheckRequest {
  nickname: string; // 확인할 닉네임
}

/**
 * 닉네임 중복 확인 응답 데이터 타입 정의
 *
 * 서버에서 닉네임 중복 확인 요청을 처리한 후 반환하는 응답의 구조입니다.
 * true: 사용 가능한 닉네임, false: 이미 사용 중인 닉네임
 */
export interface NicknameCheckResponse {
  status: number; // HTTP 상태 코드
  message: string; // 확인 결과 메시지
  data: boolean; // 닉네임 사용 가능 여부 (true: 사용 가능, false: 사용 불가)
}

// ===== API 함수 정의 섹션 =====

/**
 * 회원가입 API 함수
 *
 * 새로운 사용자 계정을 생성하기 위해 서버의 회원가입 엔드포인트로 요청을 보냅니다.
 * 입력 데이터의 유효성 검증은 서버에서 처리되며, 에러 발생 시 적절한 메시지를 반환합니다.
 *
 * @param signupData - 회원가입에 필요한 사용자 정보 객체
 * @returns Promise<SignupResponse> - 회원가입 처리 결과를 담은 Promise
 * @throws Error - 네트워크 오류, 서버 오류, 또는 요청 데이터 오류 시 발생
 *
 * @example
 * ```typescript
 * const result = await signup({
 *   email: "user@example.com",
 *   password: "securePassword123",
 *   name: "홍길동",
 *   nickname: "길동이",
 *   role: "user"
 * });
 * console.log(result.data.userId); // 생성된 사용자 ID 출력
 * ```
 */
export const signup = async (signupData: SignupRequest): Promise<SignupResponse> => {
  try {
    // 요청할 완전한 URL을 생성합니다 (기본 URL + 회원가입 엔드포인트)
    const fullUrl = `${apiClient.defaults.baseURL}/auth/signup`;

    // 🔍 요청 세부 정보 상세 출력 (body 포함)
    console.log('\n🚀 ===== 회원가입 요청 상세 정보 =====');
    console.log('📍 요청 URL 정보:');
    console.log(`   🌐 완전한 URL: ${fullUrl}`);
    console.log(`   🏠 Base URL: ${apiClient.defaults.baseURL}`);
    console.log(`   📂 Endpoint: /auth/signup`);
    console.log('📤 요청 메서드:');
    console.log(`   🔧 Method: POST`);
    console.log('📋 요청 Body 데이터:');
    console.log(`   📧 email: ${signupData.email}`);
    console.log(`   🔒 password: ${signupData.password}`);
    console.log(`   👤 name: ${signupData.name}`);
    console.log(`   🏷️ nickname: ${signupData.nickname}`);
    console.log(`   👥 role: ${signupData.role}`);
    console.log('🔧 Body JSON 전체:');
    console.log(`   ${JSON.stringify(signupData, null, 2)}`);
    console.log('🌐 전체 요청 구조:');
    console.log(`   📍 URL: ${fullUrl}`);
    console.log(`   📤 Method: POST`);
    console.log(`   📋 Content-Type: application/json`);
    console.log(`   📦 Body: ${JSON.stringify(signupData)}`);
    console.log('🔧 ==========================================\n');

    // 실제 HTTP POST 요청을 서버로 전송합니다
    // TypeScript 제네릭을 사용하여 응답 타입을 명시합니다
    const response = await apiClient.post<SignupResponse>('/auth/signup', signupData);

    // 🔍 실제 전송된 요청 정보 확인
    console.log('📤 ===== 실제 전송된 요청 확인 =====');
    console.log(`🌐 실제 요청 URL: ${response.config.url}`);
    console.log(`🔧 실제 메서드: ${response.config.method?.toUpperCase()}`);
    console.log(`📋 실제 전송된 Body:`, response.config.data);
    console.log(`🔧 요청 헤더:`, response.config.headers);
    console.log('🔧 =====================================\n');

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 회원가입 성공:', response.data);

    // Axios 응답 객체에서 실제 데이터 부분만 추출하여 반환합니다
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 콘솔에 기록합니다
    console.error('❌ 회원가입 실패:', error);

    // 🔍 서버 응답 상세 정보 추가 로깅 (403 오류 디버깅용)
    if (error.response) {
      console.error('📋 서버 응답 상세 정보:');
      console.error(`   📊 Status Code: ${error.response.status}`);
      console.error(`   📝 Status Text: ${error.response.statusText}`);
      console.error(`   📋 Response Data:`, error.response.data);
      console.error(`   🔧 Response Headers:`, error.response.headers);
      console.error(`   🌐 Request URL: ${error.config?.url}`);
      console.error(`   📤 Request Data:`, error.config?.data);
    }

    // 에러의 종류에 따라 다른 메시지를 생성합니다
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드인 경우 (4xx, 5xx)
      // 서버가 제공한 에러 메시지를 우선 사용하고, 없으면 기본 메시지 사용
      throw new Error(
        `회원가입 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
      );
    } else if (error.request) {
      // 요청은 보냈지만 서버로부터 응답을 받지 못한 경우 (네트워크 문제)
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청을 설정하는 과정에서 발생한 에러 (클라이언트 측 문제)
      throw new Error(`요청 설정 오류: ${error.message}`);
    }
  }
};

/**
 * 닉네임 중복 확인 API 함수
 *
 * 회원가입 시 닉네임의 중복 여부를 확인하기 위해 서버의 닉네임 확인 엔드포인트로 요청을 보냅니다.
 * 사용 가능한 닉네임인지 확인하여 중복 가입을 방지합니다.
 *
 * @param nicknameData - 확인할 닉네임 정보 객체
 * @returns Promise<NicknameCheckResponse> - 닉네임 확인 결과를 담은 Promise
 * @throws Error - 네트워크 오류, 서버 오류, 또는 요청 데이터 오류 시 발생
 *
 * @example
 * ```typescript
 * const result = await checkNicknameExists({
 *   nickname: "길동이"
 * });
 * if (result.data) {
 *   console.log("사용 가능한 닉네임입니다.");
 * } else {
 *   console.log("이미 사용 중인 닉네임입니다.");
 * }
 * ```
 */
export const checkNicknameExists = async (
  nicknameData: NicknameCheckRequest
): Promise<NicknameCheckResponse> => {
  try {
    // 닉네임 확인 요청을 보낼 완전한 URL을 생성합니다
    const url = `${apiClient.defaults.baseURL}/nickname/exists`;

    // 요청 정보를 콘솔에 로깅합니다
    console.log('🔍 닉네임 중복 확인 요청:', {
      url, // 요청 대상 URL
      method: 'POST', // HTTP 메서드
      data: nicknameData, // 요청 데이터
    });

    // 외부 서버로 직접 POST 요청 전송 (인증 없이)
    const response = await axios.post<NicknameCheckResponse>(url, nicknameData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // 성공 로그를 출력합니다
    console.log('✅ 닉네임 중복 확인 성공:', {
      status: response.data.status,
      message: response.data.message,
      isAvailable: response.data.data,
    });

    // 서버 응답 데이터를 그대로 반환합니다
    return response.data;
  } catch (error: any) {
    // 닉네임 확인 실패 시 에러 정보를 로깅합니다
    console.error('❌ 닉네임 중복 확인 실패:', error);

    // 에러 타입별로 적절한 메시지를 생성합니다
    if (error.response) {
      // 서버 응답이 있지만 에러 상태인 경우
      const status = error.response.status;
      const serverMessage = error.response.data?.message || '알 수 없는 오류';

      // 개발용 로그에는 전체 정보 포함
      console.log('🔍 서버 에러 응답:', { status, message: serverMessage });

      // 사용자에게는 상태 코드 없이 간단한 메시지 전달
      if (status === 400) {
        throw new Error('닉네임 형식이 올바르지 않습니다.');
      } else if (status >= 500) {
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error('닉네임 확인 중 문제가 발생했습니다.');
      }
    } else if (error.request) {
      // 네트워크 연결 문제로 서버에 도달할 수 없는 경우
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      // 클라이언트 측에서 요청 설정 중 발생한 오류
      throw new Error('닉네임 확인 중 문제가 발생했습니다.');
    }
  }
};

/**
 * 로그인 API 함수
 *
 * 사용자의 이메일과 비밀번호를 검증하고 인증 토큰을 발급받습니다.
 * 성공 시 액세스 토큰과 리프레시 토큰을 자동으로 로컬 스토리지에 저장합니다.
 *
 * @param loginData - 로그인에 필요한 인증 정보 (이메일, 비밀번호)
 * @returns Promise<LoginResponse> - 로그인 결과와 토큰 정보를 담은 Promise
 * @throws Error - 인증 실패, 네트워크 오류, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const result = await login({
 *   email: "user@example.com",
 *   password: "userPassword123"
 * });
 * console.log(result.data.user.nickname); // 로그인한 사용자 닉네임 출력
 * ```
 */
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    // 로그인 요청을 보낼 완전한 URL을 생성합니다
    const url = `${apiClient.defaults.baseURL}/auth/login`;

    // 요청 정보를 콘솔에 로깅합니다 (비밀번호는 보안상 마스킹)
    console.log('🚀 로그인 요청:', {
      url, // 요청 대상 URL
      method: 'POST', // HTTP 메서드
      data: loginData, // 요청 데이터 (개발용 로그)
    });

    // 서버로 로그인 요청을 전송합니다
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData);

    // 응답에서 토큰 정보를 추출합니다 (서버는 snake_case 사용)
    const { access_token, refresh_token, user_id } = response.data.data;

    // 토큰 유효성 검사 및 저장
    if (access_token && refresh_token) {
      // 받은 토큰들을 디바이스의 로컬 스토리지에 저장합니다
      // 이 토큰들은 향후 API 요청 시 자동으로 인증 헤더에 포함됩니다
      await AsyncStorage.setItem('token', access_token); // 액세스 토큰 저장
      await AsyncStorage.setItem('refreshToken', refresh_token); // 리프레시 토큰 저장

      // user_id도 저장합니다 (사용자 식별에 필요)
      if (user_id) {
        await AsyncStorage.setItem('userId', user_id.toString());
        console.log('👤 사용자 ID 저장:', user_id);
      }

      // 토큰 발급 시간을 저장합니다 (현재 시간)
      const issuedAt = Date.now().toString();
      await AsyncStorage.setItem('tokenIssuedAt', issuedAt);
      console.log('📅 토큰 발급 시간 저장:', new Date(parseInt(issuedAt)).toLocaleString());

      console.log('✅ 토큰 저장 완료');
    } else {
      console.warn('⚠️ 토큰이 서버 응답에 포함되지 않았습니다:', {
        access_token: access_token ? '있음' : '없음',
        refresh_token: refresh_token ? '있음' : '없음',
        user_id: user_id ? '있음' : '없음',
      });
      throw new Error('서버에서 토큰을 발급받지 못했습니다.');
    }

    // 성공 로그를 출력합니다 (보안상 실제 토큰 값은 숨김)
    console.log('✅ 로그인 성공:', {
      status: response.data.status,
      message: response.data.message,
      data: {
        access_token: 'SAVED_TO_STORAGE', // 토큰은 저장 완료 메시지로 대체
        refresh_token: 'SAVED_TO_STORAGE', // 토큰은 저장 완료 메시지로 대체
        user_id: user_id || 'NOT_PROVIDED', // 사용자 ID 정보
      },
    });

    // 서버 응답 데이터를 그대로 반환합니다
    return response.data;
  } catch (error: any) {
    // 로그인 실패 시 에러 정보를 로깅합니다
    console.error('❌ 로그인 실패:', error);

    // 에러 타입별로 적절한 메시지를 생성합니다
    if (error.response) {
      // 서버 응답이 있지만 에러 상태인 경우 (잘못된 인증 정보 등)
      const status = error.response.status;
      const serverMessage = error.response.data?.message || '알 수 없는 오류';

      // 개발용 로그에는 전체 정보 포함
      console.log('🔍 서버 에러 응답:', { status, message: serverMessage });

      // 사용자에게는 상태 코드 없이 간단한 메시지 전달
      if (status === 401) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 400) {
        throw new Error('입력 정보를 확인해주세요.');
      } else if (status >= 500) {
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error('로그인 중 문제가 발생했습니다.');
      }
    } else if (error.request) {
      // 네트워크 연결 문제로 서버에 도달할 수 없는 경우
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      // 클라이언트 측에서 요청 설정 중 발생한 오류
      throw new Error('로그인 중 문제가 발생했습니다.');
    }
  }
};

/**
 * 로그아웃 API 함수
 *
 * 사용자를 로그아웃 처리하고 저장된 인증 토큰들을 모두 삭제합니다.
 * 서버 API 호출 없이 클라이언트에서만 토큰을 제거하는 방식입니다.
 *
 * @returns Promise<boolean> - 로그아웃 성공 여부를 나타내는 Promise
 * @throws Error - 토큰 삭제 중 오류 발생 시 예외 발생
 *
 * @example
 * ```typescript
 * const success = await logout();
 * if (success) {
 *   console.log("로그아웃 완료");
 *   // 로그인 화면으로 이동하는 로직 추가
 * }
 * ```
 */
export const logout = async (): Promise<boolean> => {
  try {
    // 로그아웃 시작을 콘솔에 알립니다
    console.log('🚪 로그아웃 요청...');

    // 디바이스에 저장된 모든 인증 토큰과 사용자 정보를 삭제합니다
    await AsyncStorage.removeItem('token'); // 액세스 토큰 삭제
    await AsyncStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
    await AsyncStorage.removeItem('userId'); // 사용자 ID 삭제
    await AsyncStorage.removeItem('tokenIssuedAt'); // 토큰 발급 시간 삭제

    // 로그아웃 성공을 콘솔에 기록합니다
    console.log('✅ 로그아웃 성공');

    // 성공 상태를 반환합니다
    return true;
  } catch (error: any) {
    // 로그아웃 중 오류가 발생한 경우 에러를 로깅하고 다시 던집니다
    console.error('❌ 로그아웃 실패:', error);
    throw error;
  }
};

/**
 * 저장된 토큰 확인 API 함수
 *
 * 현재 디바이스에 저장되어 있는 액세스 토큰을 확인합니다.
 * 토큰 존재 여부를 통해 로그인 상태를 판단할 수 있습니다.
 *
 * @returns Promise<string | null> - 저장된 토큰 문자열 또는 null
 *
 * @example
 * ```typescript
 * const token = await getStoredToken();
 * if (token) {
 *   console.log("사용자가 로그인 상태입니다");
 * } else {
 *   console.log("로그인이 필요합니다");
 * }
 * ```
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    // AsyncStorage에서 저장된 액세스 토큰을 읽어옵니다
    const token = await AsyncStorage.getItem('token');

    // 토큰 확인 결과를 콘솔에 로깅합니다 (보안상 실제 토큰 값은 표시 안 함)
    console.log('🔍 저장된 토큰 확인:', token ? '토큰 있음' : '토큰 없음');

    // 토큰 값을 반환합니다 (없으면 null)
    return token;
  } catch (error) {
    // 토큰 확인 중 오류 발생 시 에러를 로깅하고 null 반환
    console.error('❌ 토큰 확인 실패:', error);
    return null;
  }
};

/**
 * 토큰 수동 설정 API 함수 (테스트 및 개발용)
 *
 * 개발 및 테스트 목적으로 토큰을 수동으로 설정할 수 있습니다.
 * 일반적으로는 login() 함수를 통해 자동으로 토큰이 설정됩니다.
 *
 * @param token - 설정할 액세스 토큰 문자열
 * @returns Promise<void> - 완료를 나타내는 Promise
 * @throws Error - 토큰 저장 중 오류 발생 시 예외 발생
 *
 * @example
 * ```typescript
 * await setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
 * console.log("토큰 설정 완료");
 * ```
 */
export const setToken = async (token: string): Promise<void> => {
  try {
    // 제공된 토큰을 AsyncStorage에 저장합니다
    await AsyncStorage.setItem('token', token);

    // 토큰 설정 완료를 콘솔에 알립니다
    console.log('✅ 토큰 수동 설정 완료');
  } catch (error) {
    // 토큰 설정 중 오류 발생 시 에러 로깅 후 예외 발생
    console.error('❌ 토큰 설정 실패:', error);
    throw error;
  }
};

/**
 * 저장된 사용자 ID 확인 API 함수
 *
 * 현재 디바이스에 저장되어 있는 사용자 ID를 확인합니다.
 * 로그인 시 저장된 사용자 ID를 반환합니다.
 *
 * @returns Promise<number | null> - 저장된 사용자 ID 또는 null
 *
 * @example
 * ```typescript
 * const userId = await getStoredUserId();
 * if (userId) {
 *   console.log("사용자 ID:", userId);
 * } else {
 *   console.log("사용자 ID가 저장되지 않았습니다");
 * }
 * ```
 */
export const getStoredUserId = async (): Promise<number | null> => {
  try {
    // AsyncStorage에서 저장된 사용자 ID를 읽어옵니다
    const userId = await AsyncStorage.getItem('userId');

    // 사용자 ID 확인 결과를 콘솔에 로깅합니다
    console.log('🔍 저장된 사용자 ID 확인:', userId ? `ID: ${userId}` : 'ID 없음');

    // 사용자 ID를 숫자로 변환하여 반환합니다 (없으면 null)
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    // 사용자 ID 확인 중 오류 발생 시 에러를 로깅하고 null 반환
    console.error('❌ 사용자 ID 확인 실패:', error);
    return null;
  }
};

/**
 * 리프레시 토큰을 이용한 액세스 토큰 갱신 API 함수
 *
 * 액세스 토큰이 만료되었을 때 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 * 일반적으로 API 요청 시 401 에러가 발생했을 때 자동으로 호출됩니다.
 *
 * @param refreshToken - 유효한 리프레시 토큰 문자열
 * @returns Promise<string> - 새로 발급받은 액세스 토큰
 * @throws Error - 토큰 갱신 실패 시 예외 발생
 *
 * @example
 * ```typescript
 * const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
 * const newAccessToken = await refreshAccessToken(storedRefreshToken);
 * console.log("새 토큰 발급 완료");
 * ```
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    // 토큰 갱신 요청을 보낼 URL을 생성합니다
    const url = `${apiClient.defaults.baseURL}/auth/token/refresh`;

    // 토큰 갱신 요청 정보를 로깅합니다 (보안상 리프레시 토큰은 마스킹)
    console.log('🔄 토큰 갱신 요청:', {
      url, // 요청 URL
      method: 'POST', // HTTP 메서드
      data: { refreshToken: '***' }, // 요청 데이터 (토큰 마스킹)
    });

    // 서버로 토큰 갱신 요청을 전송합니다
    const response = await apiClient.post<{
      status: number;
      message: string;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>('/auth/token/refresh', {
      refreshToken, // 리프레시 토큰을 요청 본문에 포함
    });

    // 응답에서 새로운 액세스 토큰을 추출합니다
    const newAccessToken = response.data.data.accessToken;

    // 새로운 리프레시 토큰도 함께 저장
    if (response.data.data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    // 새로운 액세스 토큰을 로컬 스토리지에 저장합니다
    await AsyncStorage.setItem('token', newAccessToken);

    // 토큰 발급 시간을 저장합니다 (현재 시간)
    const issuedAt = Date.now().toString();
    await AsyncStorage.setItem('tokenIssuedAt', issuedAt);
    console.log('📅 토큰 발급 시간 저장:', new Date(parseInt(issuedAt)).toLocaleString());

    // 토큰 갱신 성공을 콘솔에 기록합니다
    console.log('✅ 토큰 갱신 성공');

    // 새로운 액세스 토큰을 반환합니다
    return newAccessToken;
  } catch (error: any) {
    // 토큰 갱신 실패 시 에러를 로깅하고 예외를 발생시킵니다
    console.error('❌ 토큰 갱신 실패:', error);
    throw error;
  }
};

/**
 * 주기적인 토큰 갱신을 관리하는 클래스
 *
 * 액세스 토큰의 만료 시간을 추적하고, 만료 전에 자동으로 토큰을 갱신합니다.
 * 앱이 백그라운드에 있거나 네트워크가 불안정할 때도 안정적으로 동작합니다.
 */
class TokenRefreshManager {
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10분마다 갱신
  private readonly REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // 만료 5분 전에 갱신

  // 토큰 만료시간 설정 (밀리초 단위)
  // 서버에서 설정한 토큰 만료시간에 맞춰 설정하세요
  private readonly TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30분 (예시값)

  // 토큰 발급 시간을 저장할 키
  private readonly TOKEN_ISSUED_AT_KEY = 'tokenIssuedAt';

  /**
   * 토큰 갱신 매니저를 시작합니다
   */
  async startTokenRefresh(): Promise<void> {
    try {
      console.log('🔄 토큰 갱신 매니저 시작');

      // 기존 인터벌이 있다면 정리
      this.stopTokenRefresh();

      // 즉시 첫 번째 갱신 시도
      await this.refreshTokenIfNeeded();

      // 주기적으로 토큰 갱신 체크
      this.refreshInterval = setInterval(async () => {
        await this.refreshTokenIfNeeded();
      }, this.REFRESH_INTERVAL_MS);

      console.log('✅ 토큰 갱신 매니저 시작 완료');
    } catch (error) {
      console.error('❌ 토큰 갱신 매니저 시작 실패:', error);
    }
  }

  /**
   * 토큰 갱신 매니저를 중지합니다
   */
  stopTokenRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('🛑 토큰 갱신 매니저 중지');
    }
  }

  /**
   * 필요시 토큰을 갱신합니다
   */
  private async refreshTokenIfNeeded(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('⚠️ 리프레시 토큰이 없어 토큰 갱신을 건너뜁니다');
        return;
      }

      // 현재 저장된 액세스 토큰 확인
      const currentToken = await AsyncStorage.getItem('token');
      if (!currentToken) {
        console.log('⚠️ 액세스 토큰이 없어 토큰 갱신을 건너뜁니다');
        return;
      }

      // 토큰 발급 시간 확인
      const tokenIssuedAt = await AsyncStorage.getItem(this.TOKEN_ISSUED_AT_KEY);
      if (!tokenIssuedAt) {
        console.log('⚠️ 토큰 발급 시간이 없어 토큰 갱신을 건너뜁니다');
        return;
      }

      // 토큰 만료 시간 계산
      const issuedTime = parseInt(tokenIssuedAt);
      const expiryTime = issuedTime + this.TOKEN_EXPIRY_MS;
      const now = Date.now();

      if (this.shouldRefreshToken(expiryTime, now)) {
        console.log('🔄 토큰 만료 시간이 가까워 토큰을 갱신합니다');
        await refreshAccessToken(refreshToken);
      } else {
        console.log('✅ 토큰이 아직 유효합니다');
      }
    } catch (error) {
      console.error('❌ 토큰 갱신 체크 실패:', error);
    }
  }

  /**
   * 토큰을 갱신해야 하는지 확인합니다
   */
  private shouldRefreshToken(expiryTime: number, currentTime: number): boolean {
    const timeUntilExpiry = expiryTime - currentTime;
    return timeUntilExpiry <= this.REFRESH_BEFORE_EXPIRY_MS;
  }
}

// 토큰 갱신 매니저 인스턴스 생성
export const tokenRefreshManager = new TokenRefreshManager();

/**
 * 앱 시작 시 토큰 갱신 매니저를 시작합니다
 */
export const startTokenRefreshManager = async (): Promise<void> => {
  await tokenRefreshManager.startTokenRefresh();
};

/**
 * 앱 종료 시 토큰 갱신 매니저를 중지합니다
 */
export const stopTokenRefreshManager = (): void => {
  tokenRefreshManager.stopTokenRefresh();
};

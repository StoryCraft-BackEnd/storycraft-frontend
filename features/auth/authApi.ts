/**
 * 인증 관련 API 호출을 담당하는 파일
 * 프론트엔드에서 백엔드로 요청을 보내고 응답을 받는 기능을 담당합니다.
 */
import axios from 'axios';
import { API_CONFIG } from '@/shared/config/api';
import { apiClient } from '@/shared/api/client';
import {
  LoginRequest,
  LoginResponse,
  ErrorResponse,
  ApiResponse,
  SignupRequest,
  SignupResponse,
  EmailCheckRequest,
  EmailCheckResponse,
  NicknameCheckRequest,
  NicknameCheckResponse,
  EmailVerificationSendRequest,
  EmailVerificationSendResponse,
  EmailVerificationCheckRequest,
  EmailVerificationCheckResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './types';

/**
 * 로그인 API 호출 함수
 * @param data 로그인 요청 데이터
 * @returns 로그인 응답 데이터
 * @throws 로그인 실패 시 에러
 */
export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    console.log('로그인 시도:', data);
    const response = await axios.post<LoginResponse>(`${API_CONFIG.BASE_URL}/auth/login`, data);
    console.log('로그인 응답:', response.data);
    return {
      status: response.status,
      data: response.data,
      message: '로그인 성공',
    };
  } catch (error) {
    console.error('로그인 에러:', error);
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data as ErrorResponse;
      throw new Error(errorResponse?.message || '로그인 중 오류가 발생했습니다.');
    }
    throw error;
  }
};

/**
 * 회원가입 API 호출 함수
 *
 * 새로운 사용자 계정을 생성하기 위해 서버의 회원가입 엔드포인트로 요청을 보냅니다.
 * 사용자 입력 데이터를 서버로 전송하고 회원가입 결과를 반환합니다.
 *
 * @param data 회원가입 요청 데이터 (이메일, 비밀번호, 이름, 닉네임, 역할)
 * @returns 회원가입 응답 데이터 (성공 시 상태, 메시지, 사용자 정보)
 * @throws 회원가입 실패 시 에러 (네트워크 오류, 서버 오류, 중복 데이터 등)
 *
 * @example
 * ```typescript
 * const userData = {
 *   email: "user@example.com",
 *   password: "password123",
 *   name: "홍길동",
 *   nickname: "hong",
 *   role: "parent"
 * };
 * const result = await signup(userData);
 * console.log(result.message); // "회원가입이 완료되었습니다."
 * ```
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    // 회원가입 요청 정보를 콘솔에 출력 (개발 시 디버깅용)
    console.log('🚀 회원가입 요청 시작:', {
      url: `${API_CONFIG.BASE_URL}/auth/signup`,
      method: 'POST',
      data: data, // 개발용 로그 - 전체 데이터 표시
    });

    // apiClient를 사용하여 서버로 POST 요청 전송
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);

    // 성공적인 응답을 받았을 때 결과를 로깅
    console.log('✅ 회원가입 성공:', response.data);

    // 서버 응답 데이터를 반환
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 로깅
    console.error('❌ 회원가입 실패:', error);

    // Axios 에러인지 확인하고 적절한 에러 메시지 생성
    if (axios.isAxiosError(error)) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || '알 수 없는 오류';

        // 상세한 에러 정보 로깅
        console.error('📋 서버 응답 에러:', {
          status: statusCode,
          message: errorMessage,
          data: error.response.data,
        });

        // 사용자에게 보여줄 에러 메시지 생성
        throw new Error(`회원가입 실패 (${statusCode}): ${errorMessage}`);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('📡 네트워크 오류: 서버에 연결할 수 없습니다');
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('⚙️ 요청 설정 오류:', error.message);
        throw new Error(`요청 설정 오류: ${error.message}`);
      }
    } else {
      // Axios 에러가 아닌 기타 에러
      console.error('🔧 예상치 못한 오류:', error);
      throw new Error('회원가입 중 예상치 못한 오류가 발생했습니다.');
    }
  }
};

/**
 * 이메일 중복확인 API 호출 함수
 * @param data 이메일 중복확인 요청 데이터
 * @returns 이메일 중복확인 응답 데이터
 */
/**
 * 이메일 중복확인 API 호출 함수
 *
 * 입력된 이메일이 이미 사용 중인지 서버에서 확인합니다.
 * 회원가입 시 이메일 중복을 방지하기 위해 사용됩니다.
 *
 * @param data 이메일 중복확인 요청 데이터 (이메일 주소)
 * @returns 이메일 중복확인 응답 데이터 (사용 가능 여부)
 * @throws 중복확인 실패 시 에러 (네트워크 오류, 서버 오류 등)
 *
 * @example
 * ```typescript
 * const result = await checkEmail({ email: "user@example.com" });
 * if (result.data) {
 *   console.log("사용 가능한 이메일입니다");
 * } else {
 *   console.log("이미 사용 중인 이메일입니다");
 * }
 * ```
 */
export const checkEmail = async (data: EmailCheckRequest): Promise<EmailCheckResponse> => {
  try {
    // 이메일 중복 확인 요청 정보를 콘솔에 출력 (개발 시 디버깅용)
    console.log('📧 이메일 중복 확인 요청:', {
      url: `${API_CONFIG.BASE_URL}/email/verification/exists`,
      method: 'POST',
      data: data,
    });

    // apiClient를 사용하여 서버로 POST 요청 전송
    const response = await apiClient.post<EmailCheckResponse>('/email/verification/exists', data);

    // 성공적인 응답을 받았을 때 결과를 로깅
    console.log('✅ 이메일 중복 확인 성공:', response.data);

    // 서버 응답 데이터를 반환
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 로깅
    console.error('❌ 이메일 중복 확인 실패:', error);

    // Axios 에러인지 확인하고 적절한 에러 메시지 생성
    if (axios.isAxiosError(error)) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || '알 수 없는 오류';

        // 상세한 에러 정보 로깅
        console.error('📋 서버 응답 에러:', {
          status: statusCode,
          message: errorMessage,
          data: error.response.data,
        });

        // 사용자에게 보여줄 에러 메시지 생성
        throw new Error(`이메일 중복 확인 실패 (${statusCode}): ${errorMessage}`);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('📡 네트워크 오류: 서버에 연결할 수 없습니다');
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('⚙️ 요청 설정 오류:', error.message);
        throw new Error(`요청 설정 오류: ${error.message}`);
      }
    } else {
      // Axios 에러가 아닌 기타 에러
      console.error('🔧 예상치 못한 오류:', error);
      throw new Error('이메일 중복 확인 중 예상치 못한 오류가 발생했습니다.');
    }
  }
};

/**
 * 닉네임 중복확인 API 호출 함수
 * @param data 닉네임 중복확인 요청 데이터
 * @returns 닉네임 중복확인 응답 데이터
 */
/**
 * 닉네임 중복확인 API 호출 함수
 *
 * 입력된 닉네임이 이미 사용 중인지 서버에서 확인합니다.
 * 회원가입 시 닉네임 중복을 방지하기 위해 사용됩니다.
 *
 * @param data 닉네임 중복확인 요청 데이터 (닉네임)
 * @returns 닉네임 중복확인 응답 데이터 (사용 가능 여부)
 * @throws 중복확인 실패 시 에러 (네트워크 오류, 서버 오류 등)
 *
 * @example
 * ```typescript
 * const result = await checkNickname({ nickname: "hong" });
 * if (result.data) {
 *   console.log("사용 가능한 닉네임입니다");
 * } else {
 *   console.log("이미 사용 중인 닉네임입니다");
 * }
 * ```
 */
export const checkNickname = async (data: NicknameCheckRequest): Promise<NicknameCheckResponse> => {
  try {
    // 닉네임 중복 확인 요청 정보를 콘솔에 출력 (개발 시 디버깅용)
    console.log('🏷️ 닉네임 중복 확인 요청:', {
      url: `${API_CONFIG.BASE_URL}/nickname/exists`,
      method: 'POST',
      data: data,
    });

    // apiClient를 사용하여 서버로 POST 요청 전송
    const response = await apiClient.post<NicknameCheckResponse>('/nickname/exists', data);

    // 성공적인 응답을 받았을 때 결과를 로깅
    console.log('✅ 닉네임 중복 확인 성공:', response.data);

    // 서버 응답 데이터를 반환
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 로깅
    console.error('❌ 닉네임 중복 확인 실패:', error);

    // Axios 에러인지 확인하고 적절한 에러 메시지 생성
    if (axios.isAxiosError(error)) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || '알 수 없는 오류';

        // 상세한 에러 정보 로깅
        console.error('📋 서버 응답 에러:', {
          status: statusCode,
          message: errorMessage,
          data: error.response.data,
        });

        // 사용자에게 보여줄 에러 메시지 생성
        throw new Error(`닉네임 중복 확인 실패 (${statusCode}): ${errorMessage}`);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error('📡 네트워크 오류: 서버에 연결할 수 없습니다');
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('⚙️ 요청 설정 오류:', error.message);
        throw new Error(`요청 설정 오류: ${error.message}`);
      }
    } else {
      // Axios 에러가 아닌 기타 에러
      console.error('🔧 예상치 못한 오류:', error);
      throw new Error('닉네임 중복 확인 중 예상치 못한 오류가 발생했습니다.');
    }
  }
};

/**
 * 이메일 인증 코드 전송 API 호출 함수
 * @param data 이메일 인증 코드 전송 요청 데이터
 * @returns 이메일 인증 코드 전송 응답 데이터
 */
export const sendEmailVerificationCode = async (
  data: EmailVerificationSendRequest
): Promise<EmailVerificationSendResponse> => {
  const response = await axios.post<EmailVerificationSendResponse>(
    `${API_CONFIG.BASE_URL}/auth/request-reset-code`,
    data
  );
  return response.data;
};

/**
 * 이메일 인증번호 확인 API 호출 함수
 * @param data 이메일 인증번호 확인 요청 데이터
 * @returns 이메일 인증번호 확인 응답 데이터
 */
export const verifyEmailCode = async (
  data: EmailVerificationCheckRequest
): Promise<EmailVerificationCheckResponse> => {
  const response = await axios.post<EmailVerificationCheckResponse>(
    `${API_CONFIG.BASE_URL}/auth/verify-reset-code`,
    data
  );
  return response.data;
};

/**
 * 비밀번호 재설정 API 호출 함수
 * @param data 비밀번호 재설정 요청 데이터
 * @returns 비밀번호 재설정 응답 데이터
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await axios.post<ResetPasswordResponse>(
    `${API_CONFIG.BASE_URL}/auth/reset-password`,
    data
  );
  return response.data;
};

/**
 * 액세스 토큰 재발급 API 호출 함수
 * @param refreshToken 리프레시 토큰
 * @returns 새 액세스 토큰
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axios.post<{ data: { access_token: string } }>(
      `${API_CONFIG.BASE_URL}/auth/token/refresh`,
      { refreshToken }
    );
    return response.data.data.access_token;
  } catch {
    throw new Error('액세스 토큰 재발급에 실패했습니다.');
  }
};

/**
 * 로그아웃 API 호출 함수
 * @param accessToken 액세스 토큰
 * @returns 로그아웃 결과
 */
export const logout = async (
  accessToken: string
): Promise<{ status: number; message: string; data: boolean }> => {
  try {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch {
    throw new Error('로그아웃에 실패했습니다.');
  }
};

/**
 * 회원 탈퇴 API 호출 함수
 * @param accessToken 액세스 토큰
 * @returns 회원 탈퇴 결과
 */
export const withdraw = async (
  accessToken: string
): Promise<{ status: number; message: string; data: boolean }> => {
  try {
    const response = await axios.delete(`${API_CONFIG.BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch {
    throw new Error('회원 탈퇴에 실패했습니다.');
  }
};

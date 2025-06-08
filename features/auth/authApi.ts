/**
 * 인증 관련 API 호출을 담당하는 파일
 * 프론트엔드에서 백엔드로 요청을 보내고 응답을 받는 기능을 담당합니다.
 */
import axios from 'axios';
import { API_CONFIG } from '@/shared/config/api';
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
 * @param data 회원가입 요청 데이터
 * @returns 회원가입 응답 데이터
 * @throws 회원가입 실패 시 에러
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(`${API_CONFIG.BASE_URL}/auth/signup`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
    throw error;
  }
};

/**
 * 이메일 중복확인 API 호출 함수
 * @param data 이메일 중복확인 요청 데이터
 * @returns 이메일 중복확인 응답 데이터
 */
export const checkEmail = async (data: EmailCheckRequest): Promise<EmailCheckResponse> => {
  const response = await axios.post<EmailCheckResponse>(
    `${API_CONFIG.BASE_URL}/auth/email/verification/exists`,
    data
  );
  return response.data;
};

/**
 * 닉네임 중복확인 API 호출 함수
 * @param data 닉네임 중복확인 요청 데이터
 * @returns 닉네임 중복확인 응답 데이터
 */
export const checkNickname = async (data: NicknameCheckRequest): Promise<NicknameCheckResponse> => {
  const response = await axios.post<NicknameCheckResponse>(
    `${API_CONFIG.BASE_URL}/auth/nickname/exists`,
    data
  );
  return response.data;
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

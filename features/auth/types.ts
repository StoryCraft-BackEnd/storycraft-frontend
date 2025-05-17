/**
 * 인증 관련 타입 정의
 * API 요청/응답 데이터의 인터페이스를 정의합니다.
 */

// 로그인 요청 데이터 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// 에러 응답 데이터 타입
export interface ErrorResponse {
  message: string;
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

// 회원가입 요청 데이터 타입
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  role: 'admin' | 'parent';
}

// 회원가입 응답 데이터 타입
export interface SignupResponse {
  status: number;
  message: string;
  data: boolean;
}

// 이메일 중복확인 요청/응답 타입
export interface EmailCheckRequest {
  email: string;
}
export interface EmailCheckResponse {
  status: number;
  message: string;
  data: boolean;
}

// 닉네임 중복확인 요청/응답 타입
export interface NicknameCheckRequest {
  nickname: string;
}
export interface NicknameCheckResponse {
  status: number;
  message: string;
  data: boolean;
}

// 이메일 인증 코드 전송 요청/응답 타입
export interface EmailVerificationSendRequest {
  email: string;
}
export interface EmailVerificationSendResponse {
  status: number;
  message: string;
  data: boolean;
}

// 이메일 인증번호 확인 요청/응답 타입
export interface EmailVerificationCheckRequest {
  email: string;
  code: string;
}
export interface EmailVerificationCheckResponse {
  status: number;
  message: string;
  data: boolean;
}

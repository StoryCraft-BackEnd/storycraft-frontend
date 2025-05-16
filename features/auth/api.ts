// features/auth/api.ts
// 인증 관련 API 호출을 담당하는 파일
// 프론트에서 백엔드로 요청을 보내고 응답을 받는 기능을 담당
// 주요 기능:
// 1. 로그인 API 호출 함수 정의
// 2. API 요청/응답 타입 정의
// 3. 에러 처리 로직 구현

import axios from 'axios';
import { API_CONFIG } from '@/shared/config/api';

// 로그인 요청 데이터 타입 정의
interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터 타입 정의
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// 에러 응답 데이터 타입 정의
interface ErrorResponse {
  message: string;
}

// 로그인 API 호출 함수
// 실제 API 호출을 수행하고 응답을 처리
export const login = async (data: LoginRequest) => {
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

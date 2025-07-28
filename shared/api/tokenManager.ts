import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/shared/config/api';

/**
 * 액세스 토큰 재발급 API 호출 함수
 * @param refreshToken 리프레시 토큰
 * @returns 새 액세스 토큰
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    console.log('🔄 토큰 갱신 시도:', { refreshToken: refreshToken ? '있음' : '없음' });

    // 직접 axios를 사용하여 순환 참조 방지
    const response = await axios.post<{
      status: number;
      message: string;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>(
      `${API_CONFIG.BASE_URL}/auth/token/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    console.log('✅ 토큰 갱신 응답:', response.data);

    if (response.data.data?.accessToken) {
      // 새로운 리프레시 토큰도 함께 저장
      if (response.data.data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data.data.accessToken;
    } else {
      throw new Error('서버에서 액세스 토큰을 받지 못했습니다.');
    }
  } catch (error: any) {
    console.error('❌ 토큰 갱신 실패:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('액세스 토큰 재발급에 실패했습니다.');
  }
};

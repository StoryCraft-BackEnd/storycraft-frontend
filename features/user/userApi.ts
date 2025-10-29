import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/shared/api/client';

/**
 * 사용자 정보 인터페이스
 */
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: string;
  signup_date: string;
  profileImage?: string; // 프로필 이미지 ID (선택적 속성)
}

/**
 * 현재 로그인한 사용자의 정보를 조회합니다.
 * @returns {Promise<UserInfo>} 사용자 정보
 */
export const getMyInfo = async (): Promise<UserInfo> => {
  try {
    console.log('🔍 getMyInfo API 호출 시작...');

    // 토큰 확인
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('❌ 토큰이 없습니다.');
      throw new Error('로그인이 필요합니다.');
    }
    console.log('✅ 토큰 확인됨:', token.substring(0, 20) + '...');

    // API 호출
    console.log('🌐 API 요청 시작: /users/me');
    const response = await apiClient.get('/users/me');

    console.log('📊 API 응답 상태:', response.status);
    console.log('📋 API 응답 데이터:', response.data);

    if (!response.data || !response.data.data) {
      console.error('❌ 응답 데이터 구조가 올바르지 않습니다:', response.data);
      throw new Error('서버 응답 데이터가 올바르지 않습니다.');
    }

    console.log('✅ 사용자 정보 조회 성공:', response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ getMyInfo API 호출 실패:', error);

    if (error.response) {
      console.error('🔍 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 401) {
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response.status === 404) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      } else if (error.response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(
          `사용자 정보 조회 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
        );
      }
    } else if (error.request) {
      console.error('🔍 네트워크 요청 에러:', error.request);
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      console.error('🔍 기타 에러:', error.message);
      throw error;
    }
  }
};

/**
 * 사용자의 닉네임을 업데이트합니다.
 * @param {string} nickname 새로운 닉네임
 * @returns {Promise<boolean>} 업데이트 성공 여부
 */
export const updateNickname = async (nickname: string): Promise<boolean> => {
  console.log('updateNickname 호출:', nickname);

  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');

  console.log('토큰 확인됨, API 호출 시작...');

  try {
    const response = await apiClient.patch(
      '/users',
      { nickname },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('API 응답:', response.data);
    const result = response.data?.data === true;
    console.log('결과:', result);

    return result;
  } catch (error) {
    console.error('updateNickname 에러:', error);
    throw error;
  }
};

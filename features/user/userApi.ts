import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/shared/api/client';

/**
 * 사용자 정보 인터페이스
 */
export interface UserInfo {
  email: string;
  name: string;
  nickname: string;
  role: string;
  signup_date: string;
}

/**
 * 현재 로그인한 사용자의 정보를 조회합니다.
 * @returns {Promise<UserInfo>} 사용자 정보
 */
export const getMyInfo = async (): Promise<UserInfo> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');
  const response = await apiClient.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
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

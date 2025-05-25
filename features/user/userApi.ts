import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/shared/api/client';

export interface UserInfo {
  email: string;
  name: string;
  nickname: string;
  role: string;
  signup_date: string;
}

export const getMyInfo = async (): Promise<UserInfo> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');
  const response = await apiClient.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const updateNickname = async (nickname: string): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('로그인이 필요합니다.');
  const response = await apiClient.patch(
    '/users',
    { nickname },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data?.data === true;
};

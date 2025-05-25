import { ProfileResponse, ChildProfile } from './types';
import { API_CONFIG } from '@/shared/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 자녀 프로필 목록을 조회합니다.
 * @returns {Promise<ProfileResponse>} 프로필 목록 응답
 */
export const getProfiles = async (): Promise<ProfileResponse> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/profiles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('프로필 조회에 실패했습니다.');
    }

    const data: ProfileResponse = await response.json();
    return data;
  } catch (error) {
    console.error('프로필 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 새로운 자녀 프로필을 생성합니다.
 * @param {Omit<ChildProfile, 'child_id'>} profileData 생성할 프로필 데이터
 * @returns {Promise<{ status: number; message: string; data: { child_id: number } }>} 생성된 프로필 응답
 */
export const createProfile = async (profileData: Omit<ChildProfile, 'child_id'>) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('프로필 생성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 자녀 프로필을 수정합니다.
 * @param {number} childId 수정할 프로필 ID
 * @param {Partial<ChildProfile>} profileData 수정할 프로필 데이터
 * @returns {Promise<{ status: number; message: string; data: ChildProfile }>} 수정된 프로필 응답
 */
export const updateProfile = async (childId: number, profileData: Partial<ChildProfile>) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/profiles/${childId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('프로필 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 수정 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 자녀 프로필을 삭제합니다.
 * @param {number} childId 삭제할 프로필 ID
 * @returns {Promise<{ status: number; message: string; data: { child_id: number } }>} 삭제된 프로필 응답
 */
export const deleteProfile = async (childId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/profiles/${childId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('프로필 삭제에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('프로필 삭제 중 오류 발생:', error);
    throw error;
  }
};

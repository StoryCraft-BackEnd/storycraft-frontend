import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChildProfile } from './types';

const PROFILES_STORAGE_KEY = '@storycraft_profiles';

// 프로필 목록을 로컬에 저장
export const saveProfiles = async (profiles: ChildProfile[]) => {
  try {
    await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('프로필 저장 실패:', error);
  }
};

// 로컬에서 프로필 목록 불러오기
export const loadProfilesFromStorage = async (): Promise<ChildProfile[] | null> => {
  try {
    const profilesJson = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
    return profilesJson ? JSON.parse(profilesJson) : null;
  } catch (error) {
    console.error('프로필 불러오기 실패:', error);
    return null;
  }
};

// 프로필 추가
export const addProfileToStorage = async (profile: ChildProfile) => {
  try {
    const profiles = (await loadProfilesFromStorage()) || [];
    profiles.push(profile);
    await saveProfiles(profiles);
  } catch (error) {
    console.error('프로필 추가 실패:', error);
  }
};

// 프로필 삭제
export const removeProfileFromStorage = async (profileId: number) => {
  try {
    const profiles = (await loadProfilesFromStorage()) || [];
    const updatedProfiles = profiles.filter((p) => p.child_id !== profileId);
    await saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('프로필 삭제 실패:', error);
  }
};

// 프로필 업데이트
export const updateProfileInStorage = async (updatedProfile: ChildProfile) => {
  try {
    const profiles = (await loadProfilesFromStorage()) || [];
    const updatedProfiles = profiles.map((p) =>
      p.child_id === updatedProfile.child_id ? updatedProfile : p
    );
    await saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
  }
};

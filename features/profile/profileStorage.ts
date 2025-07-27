import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChildProfile } from './types';

const PROFILES_KEY = 'profiles';
const SELECTED_PROFILE_KEY = 'selectedProfile';

// 프로필 목록을 로컬 스토리지에 저장
export const saveProfiles = async (profiles: ChildProfile[] | null): Promise<void> => {
  try {
    // null인 경우 빈 배열로 저장
    const profilesToSave = profiles || [];
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profilesToSave));
  } catch (error) {
    console.error('프로필 저장 실패:', error);
  }
};

// 로컬 스토리지에서 프로필 목록 불러오기
export const loadProfilesFromStorage = async (): Promise<ChildProfile[] | null> => {
  try {
    const profilesJson = await AsyncStorage.getItem(PROFILES_KEY);
    return profilesJson ? JSON.parse(profilesJson) : null;
  } catch (error) {
    console.error('프로필 불러오기 실패:', error);
    return null;
  }
};

// 선택된 프로필을 로컬 스토리지에 저장
export const saveSelectedProfile = async (profile: ChildProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(SELECTED_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('선택된 프로필 저장 실패:', error);
  }
};

// 로컬 스토리지에서 선택된 프로필 불러오기
export const loadSelectedProfile = async (): Promise<ChildProfile | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(SELECTED_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error('선택된 프로필 불러오기 실패:', error);
    return null;
  }
};

// 선택된 프로필 삭제 (로그아웃 시 사용)
export const clearSelectedProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SELECTED_PROFILE_KEY);
  } catch (error) {
    console.error('선택된 프로필 삭제 실패:', error);
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
    const updatedProfiles = profiles.filter((p) => p.childId !== profileId);
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
      p.childId === updatedProfile.childId ? updatedProfile : p
    );
    await saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
  }
};

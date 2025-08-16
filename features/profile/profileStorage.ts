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
    // profile.childId 검증 추가
    if (!profile.childId || typeof profile.childId !== 'number' || profile.childId <= 0) {
      console.error('❌ saveSelectedProfile: 유효하지 않은 profile.childId:', {
        profileChildId: profile.childId,
        type: typeof profile.childId,
        profileName: profile.name,
      });
      throw new Error(`유효하지 않은 profile.childId입니다: ${profile.childId}`);
    }

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
    // profile.childId 검증 추가
    if (!profile.childId || typeof profile.childId !== 'number' || profile.childId <= 0) {
      console.error('❌ addProfileToStorage: 유효하지 않은 profile.childId:', {
        profileChildId: profile.childId,
        type: typeof profile.childId,
        profileName: profile.name,
      });
      throw new Error(`유효하지 않은 profile.childId입니다: ${profile.childId}`);
    }

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
    // profileId 파라미터 검증 추가
    if (!profileId || typeof profileId !== 'number' || profileId <= 0) {
      console.error('❌ removeProfileFromStorage: 유효하지 않은 profileId:', {
        profileId,
        type: typeof profileId,
        isNull: profileId === null,
        isUndefined: profileId === undefined,
      });
      throw new Error(`유효하지 않은 profileId입니다: ${profileId}`);
    }

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
    // updatedProfile.childId 검증 추가
    if (
      !updatedProfile.childId ||
      typeof updatedProfile.childId !== 'number' ||
      updatedProfile.childId <= 0
    ) {
      console.error('❌ updateProfileInStorage: 유효하지 않은 updatedProfile.childId:', {
        profileChildId: updatedProfile.childId,
        type: typeof updatedProfile.childId,
        profileName: updatedProfile.name,
      });
      throw new Error(`유효하지 않은 updatedProfile.childId입니다: ${updatedProfile.childId}`);
    }

    const profiles = (await loadProfilesFromStorage()) || [];
    const updatedProfiles = profiles.map((p) =>
      p.childId === updatedProfile.childId ? updatedProfile : p
    );
    await saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
  }
};

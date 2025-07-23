import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story } from './types';

/**
 * 프로필별 폴더 구조를 위한 키 생성 함수들
 */
const createProfileKey = (childId: number, folder: string, item?: string): string => {
  if (item) {
    return `profile_${childId}/${folder}/${item}`;
  }
  return `profile_${childId}/${folder}`;
};

/**
 * 프로필별 동화 폴더 키 생성
 */
const getStoriesKey = (childId: number): string => {
  return createProfileKey(childId, 'stories');
};

/**
 * 프로필별 즐겨찾기 단어 폴더 키 생성
 */
const getFavoritesKey = (childId: number): string => {
  return createProfileKey(childId, 'favorites');
};

/**
 * 프로필별 학습 진행도 폴더 키 생성
 */
const getProgressKey = (childId: number): string => {
  return createProfileKey(childId, 'progress');
};

/**
 * 프로필별 설정 폴더 키 생성
 */
const getSettingsKey = (childId: number): string => {
  return createProfileKey(childId, 'settings');
};

/**
 * 프로필별 동화 목록을 로컬 스토리지에 저장
 */
export const saveStories = async (childId: number, stories: Story[]): Promise<void> => {
  try {
    const key = getStoriesKey(childId);
    await AsyncStorage.setItem(key, JSON.stringify(stories));
    console.log(`프로필 ${childId} 동화 목록 저장 완료:`, stories.length, '개');
  } catch (error) {
    console.error(`프로필 ${childId} 동화 목록 저장 실패:`, error);
  }
};

/**
 * 프로필별 로컬 스토리지에서 동화 목록 불러오기
 */
export const loadStoriesFromStorage = async (childId: number): Promise<Story[]> => {
  try {
    const key = getStoriesKey(childId);
    const storiesJson = await AsyncStorage.getItem(key);
    const stories = storiesJson ? JSON.parse(storiesJson) : [];
    console.log(`프로필 ${childId} 동화 목록 불러오기 완료:`, stories.length, '개');
    return stories;
  } catch (error) {
    console.error(`프로필 ${childId} 동화 목록 불러오기 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 새로운 동화를 로컬에 추가
 */
export const addStoryToStorage = async (newStory: Story): Promise<void> => {
  try {
    const existingStories = await loadStoriesFromStorage(newStory.childId);
    const updatedStories = [newStory, ...existingStories]; // 최신 동화를 맨 앞에 추가
    await saveStories(newStory.childId, updatedStories);
    console.log(`프로필 ${newStory.childId} 새 동화 추가 완료:`, newStory.title);
  } catch (error) {
    console.error(`프로필 ${newStory.childId} 동화 추가 실패:`, error);
  }
};

/**
 * 프로필별 특정 동화를 로컬에서 삭제
 */
export const removeStoryFromStorage = async (childId: number, storyId: number): Promise<void> => {
  try {
    const existingStories = await loadStoriesFromStorage(childId);
    const updatedStories = existingStories.filter((story) => story.storyId !== storyId);
    await saveStories(childId, updatedStories);
    console.log(`프로필 ${childId} 동화 삭제 완료:`, storyId);
  } catch (error) {
    console.error(`프로필 ${childId} 동화 삭제 실패:`, error);
  }
};

/**
 * 프로필별 즐겨찾기 단어 목록 저장
 */
export const saveFavoriteWords = async (childId: number, words: string[]): Promise<void> => {
  try {
    const key = getFavoritesKey(childId);
    await AsyncStorage.setItem(key, JSON.stringify(words));
    console.log(`프로필 ${childId} 즐겨찾기 단어 저장 완료:`, words.length, '개');
  } catch (error) {
    console.error(`프로필 ${childId} 즐겨찾기 단어 저장 실패:`, error);
  }
};

/**
 * 프로필별 즐겨찾기 단어 목록 불러오기
 */
export const loadFavoriteWords = async (childId: number): Promise<string[]> => {
  try {
    const key = getFavoritesKey(childId);
    const wordsJson = await AsyncStorage.getItem(key);
    const words = wordsJson ? JSON.parse(wordsJson) : [];
    console.log(`프로필 ${childId} 즐겨찾기 단어 불러오기 완료:`, words.length, '개');
    return words;
  } catch (error) {
    console.error(`프로필 ${childId} 즐겨찾기 단어 불러오기 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 즐겨찾기 단어 추가
 */
export const addFavoriteWord = async (childId: number, word: string): Promise<void> => {
  try {
    const existingWords = await loadFavoriteWords(childId);
    if (!existingWords.includes(word)) {
      const updatedWords = [...existingWords, word];
      await saveFavoriteWords(childId, updatedWords);
      console.log(`프로필 ${childId} 즐겨찾기 단어 추가 완료:`, word);
    }
  } catch (error) {
    console.error(`프로필 ${childId} 즐겨찾기 단어 추가 실패:`, error);
  }
};

/**
 * 프로필별 즐겨찾기 단어 제거
 */
export const removeFavoriteWord = async (childId: number, word: string): Promise<void> => {
  try {
    const existingWords = await loadFavoriteWords(childId);
    const updatedWords = existingWords.filter((w) => w !== word);
    await saveFavoriteWords(childId, updatedWords);
    console.log(`프로필 ${childId} 즐겨찾기 단어 제거 완료:`, word);
  } catch (error) {
    console.error(`프로필 ${childId} 즐겨찾기 단어 제거 실패:`, error);
  }
};

/**
 * 프로필별 학습 진행도 저장
 */
export const saveLearningProgress = async (childId: number, progress: any): Promise<void> => {
  try {
    const key = getProgressKey(childId);
    await AsyncStorage.setItem(key, JSON.stringify(progress));
    console.log(`프로필 ${childId} 학습 진행도 저장 완료`);
  } catch (error) {
    console.error(`프로필 ${childId} 학습 진행도 저장 실패:`, error);
  }
};

/**
 * 프로필별 학습 진행도 불러오기
 */
export const loadLearningProgress = async (childId: number): Promise<any> => {
  try {
    const key = getProgressKey(childId);
    const progressJson = await AsyncStorage.getItem(key);
    const progress = progressJson ? JSON.parse(progressJson) : {};
    console.log(`프로필 ${childId} 학습 진행도 불러오기 완료`);
    return progress;
  } catch (error) {
    console.error(`프로필 ${childId} 학습 진행도 불러오기 실패:`, error);
    return {};
  }
};

/**
 * 프로필별 설정 저장
 */
export const saveProfileSettings = async (childId: number, settings: any): Promise<void> => {
  try {
    const key = getSettingsKey(childId);
    await AsyncStorage.setItem(key, JSON.stringify(settings));
    console.log(`프로필 ${childId} 설정 저장 완료`);
  } catch (error) {
    console.error(`프로필 ${childId} 설정 저장 실패:`, error);
  }
};

/**
 * 프로필별 설정 불러오기
 */
export const loadProfileSettings = async (childId: number): Promise<any> => {
  try {
    const key = getSettingsKey(childId);
    const settingsJson = await AsyncStorage.getItem(key);
    const settings = settingsJson ? JSON.parse(settingsJson) : {};
    console.log(`프로필 ${childId} 설정 불러오기 완료`);
    return settings;
  } catch (error) {
    console.error(`프로필 ${childId} 설정 불러오기 실패:`, error);
    return {};
  }
};

/**
 * 특정 프로필의 모든 데이터 삭제
 */
export const clearProfileData = async (childId: number): Promise<void> => {
  try {
    const keys = [
      getStoriesKey(childId),
      getFavoritesKey(childId),
      getProgressKey(childId),
      getSettingsKey(childId),
    ];

    await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
    console.log(`프로필 ${childId} 모든 데이터 삭제 완료`);
  } catch (error) {
    console.error(`프로필 ${childId} 데이터 삭제 실패:`, error);
  }
};

/**
 * 모든 프로필 데이터 삭제 (로그아웃 시 사용)
 */
export const clearAllProfileData = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const profileKeys = allKeys.filter((key) => key.startsWith('profile_'));
    await Promise.all(profileKeys.map((key) => AsyncStorage.removeItem(key)));
    console.log('모든 프로필 데이터 삭제 완료');
  } catch (error) {
    console.error('모든 프로필 데이터 삭제 실패:', error);
  }
};

/**
 * 프로필별 폴더 구조 정보 출력 (디버깅용)
 */
export const logProfileStructure = async (childId: number): Promise<void> => {
  try {
    console.log(`\n📁 프로필 ${childId} 폴더 구조:`);

    const stories = await loadStoriesFromStorage(childId);
    console.log(`   📚 stories/: ${stories.length}개 동화`);

    const favorites = await loadFavoriteWords(childId);
    console.log(`   ⭐ favorites/: ${favorites.length}개 즐겨찾기 단어`);

    const progress = await loadLearningProgress(childId);
    console.log(`   📊 progress/: 학습 진행도 데이터`);

    const settings = await loadProfileSettings(childId);
    console.log(`   ⚙️ settings/: 프로필 설정 데이터`);

    console.log('📁 ================================\n');
  } catch (error) {
    console.error('프로필 구조 로깅 실패:', error);
  }
};

// 기존 함수들과의 호환성을 위한 래퍼 함수들
export const loadStoriesByChildId = async (childId: number): Promise<Story[]> => {
  return await loadStoriesFromStorage(childId);
};

export const clearAllStories = async (): Promise<void> => {
  return await clearAllProfileData();
};

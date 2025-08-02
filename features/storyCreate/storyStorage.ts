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
export const addStoryToStorage = async (story: Story): Promise<void> => {
  try {
    const key = getStoriesKey(story.childId);
    const existingStoriesJson = await AsyncStorage.getItem(key);
    const existingStories: Story[] = existingStoriesJson ? JSON.parse(existingStoriesJson) : [];

    // 중복 확인 (storyId로)
    const existingIndex = existingStories.findIndex((s) => s.storyId === story.storyId);

    if (existingIndex >= 0) {
      // 기존 동화 업데이트
      existingStories[existingIndex] = story;
      console.log(`프로필 ${story.childId} 동화 업데이트 완료: ${story.title}`);
    } else {
      // 새 동화 추가
      existingStories.push(story);
      console.log(`프로필 ${story.childId} 새 동화 추가 완료: ${story.title}`);
    }

    await AsyncStorage.setItem(key, JSON.stringify(existingStories));

    // 개별 저장 로그는 제거하고 전체 저장 완료 로그만 유지
    // console.log(`프로필 ${story.childId} 동화 목록 저장 완료: ${existingStories.length} 개`);
  } catch (error) {
    console.error(`프로필 ${story.childId} 동화 저장 실패:`, error);
    throw error;
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

/**
 * 프로필별 특정 동화를 로컬에서 업데이트
 */
export const updateStoryInStorage = async (childId: number, updatedStory: Story): Promise<void> => {
  try {
    const existingStories = await loadStoriesFromStorage(childId);
    const storyIndex = existingStories.findIndex((story) => story.storyId === updatedStory.storyId);

    if (storyIndex !== -1) {
      // 기존 스토리의 북마크/좋아요 상태 유지
      const existingStory = existingStories[storyIndex];
      const mergedStory = {
        ...updatedStory,
        isBookmarked: existingStory.isBookmarked,
        isLiked: existingStory.isLiked,
      };

      existingStories[storyIndex] = mergedStory;
      await saveStories(childId, existingStories);
      console.log(`프로필 ${childId} 동화 업데이트 완료:`, updatedStory.storyId);
    } else {
      // 새로운 동화로 추가
      await addStoryToStorage(updatedStory);
    }
  } catch (error) {
    console.error(`프로필 ${childId} 동화 업데이트 실패:`, error);
  }
};

/**
 * 프로필별 동화 북마크 상태 토글
 */
export const toggleStoryBookmark = async (childId: number, storyId: number): Promise<void> => {
  try {
    const existingStories = await loadStoriesFromStorage(childId);
    const storyIndex = existingStories.findIndex((story) => story.storyId === storyId);

    if (storyIndex !== -1) {
      existingStories[storyIndex].isBookmarked = !existingStories[storyIndex].isBookmarked;
      await saveStories(childId, existingStories);
      console.log(
        `프로필 ${childId} 동화 북마크 토글 완료:`,
        storyId,
        existingStories[storyIndex].isBookmarked
      );
    }
  } catch (error) {
    console.error(`프로필 ${childId} 동화 북마크 토글 실패:`, error);
  }
};

/**
 * 프로필별 동화 좋아요 상태 토글
 */
export const toggleStoryLike = async (childId: number, storyId: number): Promise<void> => {
  try {
    const existingStories = await loadStoriesFromStorage(childId);
    const storyIndex = existingStories.findIndex((story) => story.storyId === storyId);

    if (storyIndex !== -1) {
      existingStories[storyIndex].isLiked = !existingStories[storyIndex].isLiked;
      await saveStories(childId, existingStories);
      console.log(
        `프로필 ${childId} 동화 좋아요 토글 완료:`,
        storyId,
        existingStories[storyIndex].isLiked
      );
    }
  } catch (error) {
    console.error(`프로필 ${childId} 동화 좋아요 토글 실패:`, error);
  }
};

/**
 * 프로필별 북마크된 동화만 조회
 */
export const loadBookmarkedStories = async (childId: number): Promise<Story[]> => {
  try {
    const allStories = await loadStoriesFromStorage(childId);
    const bookmarkedStories = allStories.filter((story) => story.isBookmarked);
    console.log(`프로필 ${childId} 북마크 동화 조회 완료:`, bookmarkedStories.length, '개');
    return bookmarkedStories;
  } catch (error) {
    console.error(`프로필 ${childId} 북마크 동화 조회 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 좋아요한 동화만 조회
 */
export const loadLikedStories = async (childId: number): Promise<Story[]> => {
  try {
    const allStories = await loadStoriesFromStorage(childId);
    const likedStories = allStories.filter((story) => story.isLiked);
    console.log(`프로필 ${childId} 좋아요 동화 조회 완료:`, likedStories.length, '개');
    return likedStories;
  } catch (error) {
    console.error(`프로필 ${childId} 좋아요 동화 조회 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 동화 검색 (제목, 키워드 기반)
 */
export const searchStories = async (childId: number, searchTerm: string): Promise<Story[]> => {
  try {
    const allStories = await loadStoriesFromStorage(childId);
    const searchLower = searchTerm.toLowerCase();

    const filteredStories = allStories.filter((story) => {
      const titleMatch = story.title.toLowerCase().includes(searchLower);
      const keywordMatch = story.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );
      const contentMatch = story.content.toLowerCase().includes(searchLower);
      const contentKrMatch = story.contentKr?.toLowerCase().includes(searchLower);

      return titleMatch || keywordMatch || contentMatch || contentKrMatch;
    });

    console.log(`프로필 ${childId} 동화 검색 완료:`, searchTerm, filteredStories.length, '개');
    return filteredStories;
  } catch (error) {
    console.error(`프로필 ${childId} 동화 검색 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 동화 캐시 정리 (오래된 동화 삭제)
 */
export const cleanupOldStories = async (
  childId: number,
  daysToKeep: number = 30
): Promise<void> => {
  try {
    const allStories = await loadStoriesFromStorage(childId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const recentStories = allStories.filter((story) => {
      const storyDate = new Date(story.createdAt);
      return storyDate > cutoffDate;
    });

    if (recentStories.length < allStories.length) {
      await saveStories(childId, recentStories);
      const deletedCount = allStories.length - recentStories.length;
      console.log(`프로필 ${childId} 오래된 동화 정리 완료:`, deletedCount, '개 삭제');
    }
  } catch (error) {
    console.error(`프로필 ${childId} 동화 정리 실패:`, error);
  }
};

/**
 * 프로필별 동화 통계 정보 조회
 */
export const getStoryStats = async (
  childId: number
): Promise<{
  totalStories: number;
  bookmarkedStories: number;
  likedStories: number;
  recentStories: number;
}> => {
  try {
    const allStories = await loadStoriesFromStorage(childId);
    const bookmarkedStories = allStories.filter((story) => story.isBookmarked);
    const likedStories = allStories.filter((story) => story.isLiked);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentStories = allStories.filter((story) => new Date(story.createdAt) > oneWeekAgo);

    const stats = {
      totalStories: allStories.length,
      bookmarkedStories: bookmarkedStories.length,
      likedStories: likedStories.length,
      recentStories: recentStories.length,
    };

    console.log(`프로필 ${childId} 동화 통계:`, stats);
    return stats;
  } catch (error) {
    console.error(`프로필 ${childId} 동화 통계 조회 실패:`, error);
    return {
      totalStories: 0,
      bookmarkedStories: 0,
      likedStories: 0,
      recentStories: 0,
    };
  }
};

/**
 * 특정 프로필의 모든 동화를 로컬에서 삭제
 * @param childId - 프로필 ID
 */
export const clearStoriesFromStorage = async (childId: number): Promise<void> => {
  try {
    const key = getStoriesKey(childId);
    await AsyncStorage.removeItem(key);
    console.log(`프로필 ${childId} 모든 동화 삭제 완료`);
  } catch (error) {
    console.error(`프로필 ${childId} 동화 삭제 실패:`, error);
    throw error;
  }
};

// 기존 함수들과의 호환성을 위한 래퍼 함수들
export const loadStoriesByChildId = async (childId: number): Promise<Story[]> => {
  return await loadStoriesFromStorage(childId);
};

export const clearAllStories = async (): Promise<void> => {
  return await clearAllProfileData();
};

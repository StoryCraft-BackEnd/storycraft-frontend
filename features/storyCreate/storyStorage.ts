import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story, StorySection } from './types';

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
 * 프로필별 동화 단락 폴더 키 생성
 */
const getStorySectionsKey = (childId: number, storyId: number): string => {
  return createProfileKey(childId, `story_sections_${storyId}`);
};

/**
 * 프로필별 동화 TTS 정보 폴더 키 생성
 */
const getStoryTTSKey = (childId: number, storyId: number): string => {
  return createProfileKey(childId, `story_tts_${storyId}`);
};

/**
 * 프로필별 동화 목록을 로컬 스토리지에 저장
 */
export const saveStories = async (childId: number, stories: Story[]): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ saveStories: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    // childId가 일치하지 않는 동화가 있으면 경고만 표시하고 모든 동화 저장
    const invalidStories = stories.filter((story: Story) => {
      if (!story.childId || story.childId !== childId) {
        console.warn(`⚠️ 동화 ${story.storyId}의 childId가 일치하지 않음:`, {
          storyChildId: story.childId,
          expectedChildId: childId,
          storyTitle: story.title,
        });
        return true;
      }
      return false;
    });

    if (invalidStories.length > 0) {
      console.warn(
        `⚠️ ${invalidStories.length}개의 동화가 유효하지 않은 childId를 가짐:`,
        invalidStories.map((s) => ({ storyId: s.storyId, title: s.title, childId: s.childId }))
      );
    }

    const key = getStoriesKey(childId);
    await AsyncStorage.setItem(key, JSON.stringify(stories));
    console.log(`프로필 ${childId} 동화 목록 저장 완료:`, {
      totalStories: stories.length,
      validStories: stories.length - invalidStories.length,
      invalidStories: invalidStories.length,
    });
  } catch (error) {
    console.error(`프로필 ${childId} 동화 목록 저장 실패:`, error);
  }
};

/**
 * 프로필별 로컬 스토리지에서 동화 목록 불러오기
 */
export const loadStoriesFromStorage = async (childId: number): Promise<Story[]> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ loadStoriesFromStorage: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    const key = getStoriesKey(childId);
    const storiesJson = await AsyncStorage.getItem(key);
    const stories = storiesJson ? JSON.parse(storiesJson) : [];

    // childId가 일치하지 않는 동화가 있으면 경고만 표시하고 모든 동화 반환
    const invalidStories = stories.filter((story: Story) => {
      if (!story.childId || story.childId !== childId) {
        console.warn(`⚠️ 동화 ${story.storyId}의 childId가 일치하지 않음:`, {
          storyChildId: story.childId,
          expectedChildId: childId,
          storyTitle: story.title,
        });
        return true;
      }
      return false;
    });

    if (invalidStories.length > 0) {
      console.warn(
        `⚠️ ${invalidStories.length}개의 동화가 유효하지 않은 childId를 가짐:`,
        invalidStories.map((s) => ({ storyId: s.storyId, title: s.title, childId: s.childId }))
      );
    }

    console.log(`프로필 ${childId} 동화 목록 불러오기 완료:`, {
      totalStories: stories.length,
      validStories: stories.length - invalidStories.length,
      invalidStories: invalidStories.length,
    });

    // 모든 동화를 반환 (필터링하지 않음)
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
    // story.childId 검증 추가
    if (!story.childId || typeof story.childId !== 'number' || story.childId <= 0) {
      console.error('❌ addStoryToStorage: 유효하지 않은 story.childId:', {
        storyChildId: story.childId,
        type: typeof story.childId,
        storyId: story.storyId,
        storyTitle: story.title,
      });
      throw new Error(`유효하지 않은 story.childId입니다: ${story.childId}`);
    }

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
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ removeStoryFromStorage: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

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
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ saveFavoriteWords: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

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
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ loadFavoriteWords: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

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

    // 동화 단락도 함께 삭제
    await clearAllStorySections(childId);

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

    // 동화 단락 정보 추가
    const allKeys = await AsyncStorage.getAllKeys();
    const sectionKeys = allKeys.filter((key) =>
      key.startsWith(`profile_${childId}/story_sections_`)
    );
    console.log(`   📖 story_sections/: ${sectionKeys.length}개 동화의 단락 캐시`);

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
 * 프로필별 동화 단락 정보를 로컬 스토리지에 저장
 */
export const saveStorySections = async (
  childId: number,
  storyId: number,
  sections: StorySection[]
): Promise<void> => {
  try {
    const key = getStorySectionsKey(childId, storyId);
    await AsyncStorage.setItem(key, JSON.stringify(sections));
    console.log(`프로필 ${childId} 동화 ${storyId} 단락 정보 저장 완료:`, sections.length, '개');
  } catch (error) {
    console.error(`프로필 ${childId} 동화 ${storyId} 단락 정보 저장 실패:`, error);
  }
};

/**
 * 프로필별 로컬 스토리지에서 동화 단락 정보 불러오기
 */
export const loadStorySectionsFromStorage = async (
  childId: number,
  storyId: number
): Promise<StorySection[]> => {
  try {
    const key = getStorySectionsKey(childId, storyId);
    const sectionsJson = await AsyncStorage.getItem(key);
    const sections = sectionsJson ? JSON.parse(sectionsJson) : [];
    console.log(
      `프로필 ${childId} 동화 ${storyId} 단락 정보 불러오기 완료:`,
      sections.length,
      '개'
    );
    return sections;
  } catch (error) {
    console.error(`프로필 ${childId} 동화 ${storyId} 단락 정보 불러오기 실패:`, error);
    return [];
  }
};

/**
 * 프로필별 동화 TTS 정보를 로컬 스토리지에 저장
 */
export const saveStoryTTS = async (
  childId: number,
  storyId: number,
  ttsInfo: { [sectionId: number]: { audioPath: string; ttsUrl: string } }
): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ saveStoryTTS: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    const key = getStoryTTSKey(childId, storyId);
    await AsyncStorage.setItem(key, JSON.stringify(ttsInfo));
    console.log(
      `프로필 ${childId} 동화 ${storyId} TTS 정보 저장 완료:`,
      Object.keys(ttsInfo).length,
      '개 단락'
    );
  } catch (error) {
    console.error(`프로필 ${childId} 동화 ${storyId} TTS 정보 저장 실패:`, error);
  }
};

/**
 * 프로필별 로컬 스토리지에서 동화 TTS 정보 불러오기
 */
export const loadStoryTTSFromStorage = async (
  childId: number,
  storyId: number
): Promise<{ [sectionId: number]: { audioPath: string; ttsUrl: string } }> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ loadStoryTTSFromStorage: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    const key = getStoryTTSKey(childId, storyId);
    const ttsJson = await AsyncStorage.getItem(key);
    const ttsInfo = ttsJson ? JSON.parse(ttsJson) : {};
    console.log(
      `프로필 ${childId} 동화 ${storyId} TTS 정보 불러오기 완료:`,
      Object.keys(ttsInfo).length,
      '개 단락'
    );
    return ttsInfo;
  } catch (error) {
    console.error(`프로필 ${childId} 동화 ${storyId} TTS 정보 불러오기 실패:`, error);
    return {};
  }
};

/**
 * 특정 동화의 단락들을 로컬에서 삭제
 */
export const removeStorySections = async (childId: number, storyId: number): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ removeStorySections: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    const key = getStorySectionsKey(childId, storyId);
    await AsyncStorage.removeItem(key);
    console.log(`동화 ${storyId} 단락 삭제 완료`);
  } catch (error) {
    console.error(`동화 ${storyId} 단락 삭제 실패:`, error);
  }
};

/**
 * 프로필별 모든 동화 단락 삭제
 */
export const clearAllStorySections = async (childId: number): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ clearAllStorySections: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    const allKeys = await AsyncStorage.getAllKeys();
    const sectionKeys = allKeys.filter((key) =>
      key.startsWith(`profile_${childId}/story_sections_`)
    );

    if (sectionKeys.length > 0) {
      await Promise.all(sectionKeys.map((key) => AsyncStorage.removeItem(key)));
      console.log(`프로필 ${childId} 모든 동화 단락 삭제 완료:`, sectionKeys.length, '개');
    }
  } catch (error) {
    console.error(`프로필 ${childId} 동화 단락 삭제 실패:`, error);
  }
};

/**
 * 특정 프로필의 모든 동화를 로컬에서 삭제
 * @param childId - 프로필 ID
 */
export const clearStoriesFromStorage = async (childId: number): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ clearStoriesFromStorage: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

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

// === 북마크/좋아요 상태 별도 저장 ===

/**
 * 사용자의 북마크 상태를 별도로 저장
 * @param childId - 자녀 ID
 * @param storyId - 동화 ID
 * @param isBookmarked - 북마크 상태
 */
export const saveBookmarkStatus = async (
  childId: number,
  storyId: number,
  isBookmarked: boolean
): Promise<void> => {
  try {
    const key = `bookmarks_${childId}`;
    const existingBookmarks = await AsyncStorage.getItem(key);
    let bookmarks: Record<number, boolean> = {};

    if (existingBookmarks) {
      bookmarks = JSON.parse(existingBookmarks);
    }

    if (isBookmarked) {
      bookmarks[storyId] = true;
    } else {
      delete bookmarks[storyId];
    }

    await AsyncStorage.setItem(key, JSON.stringify(bookmarks));
    console.log(`북마크 상태 저장 완료: storyId ${storyId} = ${isBookmarked}`);
  } catch (error) {
    console.error('북마크 상태 저장 실패:', error);
    throw error;
  }
};

/**
 * 사용자의 좋아요 상태를 별도로 저장
 * @param childId - 자녀 ID
 * @param storyId - 동화 ID
 * @param isLiked - 좋아요 상태
 */
export const saveLikeStatus = async (
  childId: number,
  storyId: number,
  isLiked: boolean
): Promise<void> => {
  try {
    const key = `likes_${childId}`;
    const existingLikes = await AsyncStorage.getItem(key);
    let likes: Record<number, boolean> = {};

    if (existingLikes) {
      likes = JSON.parse(existingLikes);
    }

    if (isLiked) {
      likes[storyId] = true;
    } else {
      delete likes[storyId];
    }

    await AsyncStorage.setItem(key, JSON.stringify(likes));
    console.log(`좋아요 상태 저장 완료: storyId ${storyId} = ${isLiked}`);
  } catch (error) {
    console.error('좋아요 상태 저장 실패:', error);
    throw error;
  }
};

/**
 * 사용자의 모든 북마크 상태를 가져오기
 * @param childId - 자녀 ID
 * @returns 북마크된 동화 ID 목록
 */
export const getBookmarkStatuses = async (childId: number): Promise<Record<number, boolean>> => {
  try {
    const key = `bookmarks_${childId}`;
    const bookmarks = await AsyncStorage.getItem(key);
    return bookmarks ? JSON.parse(bookmarks) : {};
  } catch (error) {
    console.error('북마크 상태 로드 실패:', error);
    return {};
  }
};

/**
 * 사용자의 모든 좋아요 상태를 가져오기
 * @param childId - 자녀 ID
 * @returns 좋아요한 동화 ID 목록
 */
export const getLikeStatuses = async (childId: number): Promise<Record<number, boolean>> => {
  try {
    const key = `likes_${childId}`;
    const likes = await AsyncStorage.getItem(key);
    return likes ? JSON.parse(likes) : {};
  } catch (error) {
    console.error('좋아요 상태 로드 실패:', error);
    return {};
  }
};

/**
 * 동화 데이터에 북마크/좋아요 상태를 연결하여 반환
 * @param childId - 자녀 ID
 * @param stories - 동화 목록
 * @returns 북마크/좋아요 상태가 연결된 동화 목록
 */
export const attachUserPreferences = async (
  childId: number,
  stories: Story[]
): Promise<Story[]> => {
  try {
    // 북마크와 좋아요 상태를 병렬로 가져오기
    const [bookmarks, likes] = await Promise.all([
      getBookmarkStatuses(childId),
      getLikeStatuses(childId),
    ]);

    // 각 동화에 사용자 선호도 상태 연결
    const storiesWithPreferences = stories.map((story) => ({
      ...story,
      isBookmarked: bookmarks[story.storyId] || false,
      isLiked: likes[story.storyId] || false,
    }));

    console.log(`사용자 선호도 연결 완료: ${stories.length}개 동화`);
    return storiesWithPreferences;
  } catch (error) {
    console.error('사용자 선호도 연결 실패:', error);
    // 실패 시 기본값으로 반환
    return stories.map((story) => ({
      ...story,
      isBookmarked: false,
      isLiked: false,
    }));
  }
};

/**
 * 북마크 토글 (새로운 방식)
 * @param childId - 자녀 ID
 * @param storyId - 동화 ID
 */
export const toggleStoryBookmarkNew = async (childId: number, storyId: number): Promise<void> => {
  try {
    const bookmarks = await getBookmarkStatuses(childId);
    const currentStatus = bookmarks[storyId] || false;
    const newStatus = !currentStatus;

    await saveBookmarkStatus(childId, storyId, newStatus);
    console.log(`북마크 토글 완료: storyId ${storyId} = ${newStatus}`);
  } catch (error) {
    console.error('북마크 토글 실패:', error);
    throw error;
  }
};

/**
 * 좋아요 토글 (새로운 방식)
 * @param childId - 자녀 ID
 * @param storyId - 동화 ID
 */
export const toggleStoryLikeNew = async (childId: number, storyId: number): Promise<void> => {
  try {
    const likes = await getLikeStatuses(childId);
    const currentStatus = likes[storyId] || false;
    const newStatus = !currentStatus;

    if (newStatus) {
      likes[storyId] = true;
    } else {
      delete likes[storyId];
    }

    await saveLikeStatus(childId, storyId, newStatus);
    console.log(`좋아요 토글 완료: storyId ${storyId} = ${newStatus}`);
  } catch (error) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

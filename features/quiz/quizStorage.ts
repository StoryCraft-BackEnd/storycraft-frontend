import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quiz } from './quizApi';

console.log('📦 quizStorage.ts 모듈 로드됨');
console.log('📦 로드 시간:', new Date().toISOString());
console.log('📦 AsyncStorage import 확인:', typeof AsyncStorage);

const QUIZ_BOOKMARKS_KEY = 'quiz_bookmarks';

console.log('📦 QUIZ_BOOKMARKS_KEY 설정:', QUIZ_BOOKMARKS_KEY);

export interface BookmarkedQuiz extends Quiz {
  bookmarkedAt: string;
}

console.log('📦 BookmarkedQuiz 인터페이스 정의됨');

/**
 * 북마크된 퀴즈 목록을 로컬에서 불러옵니다.
 */
export const loadBookmarkedQuizzes = async (): Promise<BookmarkedQuiz[]> => {
  try {
    console.log('📚 북마크된 퀴즈 로드 시작...');

    const bookmarksJson = await AsyncStorage.getItem(QUIZ_BOOKMARKS_KEY);
    console.log('📚 AsyncStorage에서 가져온 원시 데이터:', bookmarksJson);

    if (bookmarksJson) {
      const bookmarks = JSON.parse(bookmarksJson);
      console.log('📚 파싱된 북마크 데이터:', {
        type: typeof bookmarks,
        isArray: Array.isArray(bookmarks),
        length: Array.isArray(bookmarks) ? bookmarks.length : 'N/A',
        data: bookmarks,
      });
      console.log('✅ 북마크된 퀴즈 로드 완료:', bookmarks.length, '개');
      return bookmarks;
    }

    console.log('📚 북마크된 퀴즈 없음 (null 또는 undefined)');
    return [];
  } catch (error) {
    console.error('❌ 북마크된 퀴즈 로드 실패:', error);
    return [];
  }
};

/**
 * 퀴즈를 북마크에 추가합니다.
 */
export const addQuizBookmark = async (quiz: Quiz): Promise<void> => {
  try {
    const existingBookmarks = await loadBookmarkedQuizzes();

    // 이미 북마크되어 있는지 확인
    const isAlreadyBookmarked = existingBookmarks.some(
      (bookmark) => bookmark.quizId === quiz.quizId
    );

    if (isAlreadyBookmarked) {
      console.log('⚠️ 이미 북마크된 퀴즈입니다:', quiz.quizId);
      return;
    }

    const bookmarkedQuiz: BookmarkedQuiz = {
      ...quiz,
      bookmarkedAt: new Date().toISOString(),
    };

    const newBookmarks = [...existingBookmarks, bookmarkedQuiz];
    await AsyncStorage.setItem(QUIZ_BOOKMARKS_KEY, JSON.stringify(newBookmarks));

    console.log('✅ 퀴즈 북마크 추가 완료:', {
      quizId: quiz.quizId,
      question: quiz.question.substring(0, 30) + '...',
      totalBookmarks: newBookmarks.length,
    });
  } catch (error) {
    console.error('❌ 퀴즈 북마크 추가 실패:', error);
    throw error;
  }
};

/**
 * 퀴즈 북마크를 제거합니다.
 */
export const removeQuizBookmark = async (quizId: number): Promise<void> => {
  try {
    const existingBookmarks = await loadBookmarkedQuizzes();
    const newBookmarks = existingBookmarks.filter((bookmark) => bookmark.quizId !== quizId);

    await AsyncStorage.setItem(QUIZ_BOOKMARKS_KEY, JSON.stringify(newBookmarks));

    console.log('✅ 퀴즈 북마크 제거 완료:', {
      quizId,
      totalBookmarks: newBookmarks.length,
    });
  } catch (error) {
    console.error('❌ 퀴즈 북마크 제거 실패:', error);
    throw error;
  }
};

/**
 * 특정 퀴즈가 북마크되어 있는지 확인합니다.
 */
export const isQuizBookmarked = async (quizId: number): Promise<boolean> => {
  try {
    const bookmarks = await loadBookmarkedQuizzes();
    return bookmarks.some((bookmark) => bookmark.quizId === quizId);
  } catch (error) {
    console.error('❌ 퀴즈 북마크 상태 확인 실패:', error);
    return false;
  }
};

/**
 * 모든 북마크를 제거합니다.
 */
export const clearAllQuizBookmarks = async (): Promise<void> => {
  try {
    console.log('🗑️ 모든 북마크 삭제 시작...');

    // 삭제 전 현재 상태 확인
    const beforeDelete = await AsyncStorage.getItem(QUIZ_BOOKMARKS_KEY);
    console.log('🗑️ 삭제 전 quiz_bookmarks:', beforeDelete);

    await AsyncStorage.removeItem(QUIZ_BOOKMARKS_KEY);

    // 삭제 후 상태 확인
    const afterDelete = await AsyncStorage.getItem(QUIZ_BOOKMARKS_KEY);
    console.log('🗑️ 삭제 후 quiz_bookmarks:', afterDelete);

    // 모든 키 확인
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('🗑️ AsyncStorage 모든 키:', allKeys);

    console.log('✅ 모든 퀴즈 북마크 제거 완료');
  } catch (error) {
    console.error('❌ 모든 퀴즈 북마크 제거 실패:', error);
    throw error;
  }
};

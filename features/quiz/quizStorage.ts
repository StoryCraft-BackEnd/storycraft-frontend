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
 * 삭제된 동화의 퀴즈들은 자동으로 필터링됨
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

      // storyId가 있는 유효한 퀴즈만 필터링 (삭제된 스토리의 퀴즈는 제외)
      const validBookmarks = bookmarks.filter((bookmark: any) => {
        const hasValidStoryId = bookmark.storyId && bookmark.storyId > 0;
        if (!hasValidStoryId) {
          console.warn('⚠️ storyId가 없거나 유효하지 않은 북마크된 퀴즈 제외:', bookmark);
        }
        return hasValidStoryId;
      });

      console.log('✅ 북마크된 퀴즈 로드 완료:', validBookmarks.length, '개 (유효한 스토리만)');
      return validBookmarks;
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

/**
 * 구버전 퀴즈 데이터 정리 (id 사용, storyId 없음)
 * 새로운 형식: quizId와 storyId를 모두 가져야 함
 */
export const cleanupLegacyQuizData = async (): Promise<void> => {
  try {
    const quizBookmarksKey = 'quiz_bookmarks';
    const quizBookmarksData = await AsyncStorage.getItem(quizBookmarksKey);

    if (quizBookmarksData) {
      const existingBookmarks = JSON.parse(quizBookmarksData);

      if (Array.isArray(existingBookmarks) && existingBookmarks.length > 0) {
        // 구버전 데이터 필터링 (quizId와 storyId 모두 있어야 함)
        const validBookmarks = existingBookmarks.filter((bookmark: any) => {
          return bookmark.quizId && bookmark.storyId; // quizId와 storyId 모두 있어야 함
        });

        const removedCount = existingBookmarks.length - validBookmarks.length;

        if (removedCount > 0) {
          await AsyncStorage.setItem(quizBookmarksKey, JSON.stringify(validBookmarks));
          console.log(`🧹 구버전 퀴즈 데이터 정리 완료: ${removedCount}개 제거`);

          // 제거된 구버전 데이터 로깅
          const removedBookmarks = existingBookmarks.filter((bookmark: any) => {
            return !bookmark.quizId || !bookmark.storyId;
          });

          console.log(
            '🗑️ 제거된 구버전 퀴즈:',
            removedBookmarks.map((b: any) => ({
              id: b.id,
              quizId: b.quizId,
              storyId: b.storyId,
              question: b.question?.substring(0, 30) + '...',
            }))
          );
        } else {
          console.log('✅ 구버전 퀴즈 데이터 없음 - 모든 데이터가 유효함');
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ 구버전 퀴즈 데이터 정리 실패:', error);
  }
};

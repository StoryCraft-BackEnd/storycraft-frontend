/**
 * 자녀별 학습 통계 API 함수
 *
 * 자녀의 학습 통계 데이터를 조회하는 API 함수들을 제공합니다.
 * 생성한 동화 수, 완성한 동화 수, 학습한 단어 수, 푼 퀴즈 수, 총 학습 시간 등의 정보를 제공합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import { apiClient } from './client';

// ===== TypeScript 타입 정의 =====

/**
 * 자녀별 학습 통계 응답 데이터 타입
 *
 * 서버에서 반환하는 학습 통계 데이터의 구조를 정의합니다.
 */
export interface ChildStatistics {
  /** 생성한 동화 수 */
  createdStories: number;
  /** 완성한 동화 수 */
  completedStories: number;
  /** 학습한 단어 수 */
  learnedWords: number;
  /** 푼 퀴즈 수 */
  solvedQuizzes: number;
  /** 총 학습 시간 (분 단위) */
  totalLearningTimeMinutes: number;
}

/**
 * API 응답 래퍼 타입
 *
 * 서버 API의 표준 응답 형식을 나타냅니다.
 */
export interface StatisticsApiResponse {
  status: number;
  message: string;
  data: ChildStatistics;
}

/**
 * 학습 시간 저장 요청 데이터 타입
 *
 * 서버로 전송하는 학습 시간 저장 요청의 구조를 정의합니다.
 */
export interface SaveLearningTimeRequest {
  /** 자녀 ID */
  childId: number;
  /** 학습 시간 (분 단위) - 동화 읽기 시간 */
  totalLearningTimeMinutes: number;
  /** 업데이트 시간 */
  updatedAt: string;
}

/**
 * 학습 시간 저장 응답 데이터 타입
 *
 * 서버에서 반환하는 학습 시간 저장 응답의 구조를 정의합니다.
 */
export interface SaveLearningTimeResponse {
  status: number;
  message: string;
  data: null;
}

// ===== API 함수들 =====

/**
 * 자녀별 학습 통계 조회 API 함수
 *
 * 주어진 자녀 ID에 해당하는 학습 통계 데이터를 서버에서 가져옵니다.
 * 생성한 동화 수, 완성한 동화 수, 학습한 단어 수, 푼 퀴즈 수, 총 학습 시간 등을 포함합니다.
 *
 * @param childId - 통계를 조회할 자녀의 고유 ID
 * @returns Promise<ChildStatistics> - 해당 자녀의 학습 통계 데이터를 담은 Promise
 * @throws Error - 인증 실패, 자녀 없음, 권한 없음, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const stats = await getChildStatistics(123);
 * console.log(`생성한 동화: ${stats.createdStories}개`);
 * console.log(`완성한 동화: ${stats.completedStories}개`);
 * console.log(`학습한 단어: ${stats.learnedWords}개`);
 * console.log(`푼 퀴즈: ${stats.solvedQuizzes}개`);
 * console.log(`총 학습 시간: ${stats.totalLearningTimeMinutes}분`);
 * ```
 */
export const getChildStatistics = async (childId: number): Promise<ChildStatistics> => {
  try {
    // 요청 정보를 콘솔에 로깅합니다
    console.log('📊 자녀별 학습 통계 조회 요청:', {
      url: `/statistics/children/${childId}`,
      method: 'GET',
      childId,
    });

    // 서버로 GET 요청을 전송하여 학습 통계를 가져옵니다
    const response = await apiClient.get<StatisticsApiResponse>(`/statistics/children/${childId}`);

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 자녀별 학습 통계 조회 성공:', response.data.data);

    // 서버 응답의 data 필드에서 실제 통계 데이터를 추출하여 반환합니다
    return response.data.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 자녀별 학습 통계 조회 실패:', {
      childId,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 학습 시간 저장 API 함수
 *
 * 자녀의 학습 시간(동화 읽기 시간)을 서버에 저장합니다.
 * 동화 읽기 화면에서만 호출되어야 하며, 실제 학습 시간만 측정합니다.
 *
 * @param request - 학습 시간 저장 요청 데이터 (childId, totalLearningTimeMinutes, updatedAt)
 * @returns Promise<SaveLearningTimeResponse> - 저장 결과를 담은 Promise
 * @throws Error - 인증 실패, 자녀 없음, 권한 없음, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const request = {
 *   childId: 123,
 *   totalLearningTimeMinutes: 15,
 *   updatedAt: "2024-01-15 14:30:00"
 * };
 * const result = await saveLearningTime(request);
 * console.log('학습 시간 저장 성공:', result.message);
 * ```
 */
export const saveLearningTime = async (
  request: SaveLearningTimeRequest
): Promise<SaveLearningTimeResponse> => {
  try {
    // 요청 정보를 콘솔에 로깅합니다
    console.log('⏰ 학습 시간 저장 요청:', {
      url: '/statistics/learning-time',
      method: 'POST',
      request,
    });

    // 서버로 POST 요청을 전송하여 학습 시간을 저장합니다
    const response = await apiClient.post<SaveLearningTimeResponse>(
      '/statistics/learning-time',
      request
    );

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 학습 시간 저장 성공:', response.data);

    // 서버 응답을 반환합니다
    return response.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 학습 시간 저장 실패:', {
      request,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 통계 데이터 유틸리티 함수들
 */
export const statisticsUtils = {
  /**
   * 총 학습 시간을 시간과 분으로 포맷팅
   * @param minutes - 총 학습 시간 (분 단위)
   * @returns 포맷팅된 시간 문자열 (예: "2시간 30분")
   */
  formatLearningTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}분`;
    } else if (remainingMinutes === 0) {
      return `${hours}시간`;
    } else {
      return `${hours}시간 ${remainingMinutes}분`;
    }
  },

  /**
   * 동화 완성률 계산
   * @param completed - 완성한 동화 수
   * @param created - 생성한 동화 수
   * @returns 완성률 (0-100 범위의 백분율)
   */
  calculateCompletionRate: (completed: number, created: number): number => {
    if (created === 0) return 0;
    return Math.round((completed / created) * 100);
  },

  /**
   * 평균 학습 시간 계산 (동화당)
   * @param totalMinutes - 총 학습 시간 (분)
   * @param completedStories - 완성한 동화 수
   * @returns 동화당 평균 학습 시간 (분)
   */
  calculateAverageTimePerStory: (totalMinutes: number, completedStories: number): number => {
    if (completedStories === 0) return 0;
    return Math.round(totalMinutes / completedStories);
  },
};

import { apiClient } from '@/shared/api/client';

/**
 * 퀴즈 옵션 인터페이스
 */
export interface QuizOptions {
  [key: string]: string;
}

/**
 * 퀴즈 인터페이스
 */
export interface Quiz {
  quizId: number;
  storyId: number;
  question: string;
  options: QuizOptions;
}

/**
 * 퀴즈 생성 요청 인터페이스
 */
export interface CreateQuizRequest {
  storyId: number;
  childId: number;
}

/**
 * 퀴즈 제출 요청 인터페이스
 */
export interface QuizSubmitRequest {
  quizId: number;
  selectedAnswer: string;
}

/**
 * 퀴즈 결과 인터페이스
 */
export interface QuizResult {
  quizId: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
}

/**
 * 퀴즈 결과 조회 응답 인터페이스
 */
export interface QuizResultsResponse {
  childId: number;
  storyId: number;
  score: number;
  totalQuiz: number;
  correctAnswers: number;
  results: QuizResult[];
}

/**
 * 동화 기반 퀴즈 자동 생성 API
 * storyId의 본문에서 중요 단어(**)를 자동 추출하거나,
 * query로 전달한 keywords를 사용해 GPT로 4지선다 10문항을 생성·저장합니다.
 *
 * @param request - 퀴즈 생성 요청 데이터 (storyId, keywords)
 * @returns Promise<Quiz[]> - 생성된 퀴즈 목록
 * @throws Error - 퀴즈 생성 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const quizzes = await createQuiz({
 *     storyId: 1,
 *     childId: 1
 *   });
 *   console.log(`✅ ${quizzes.length}개의 퀴즈 생성 완료`);
 * } catch (error) {
 *   console.error('❌ 퀴즈 생성 실패:', error.message);
 * }
 * ```
 */
export const createQuiz = async (request: CreateQuizRequest): Promise<Quiz[]> => {
  try {
    console.log('🎯 퀴즈 생성 API 호출 시작:', {
      storyId: request.storyId,
      childId: request.childId,
    });

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    queryParams.append('storyId', request.storyId.toString());
    queryParams.append('childId', request.childId.toString());

    // keywords는 서버에서 자동으로 동화 내용에서 추출하므로 전송하지 않음

    const url = `/quizzes?${queryParams.toString()}`;
    console.log('🌐 API 요청 URL:', url);
    console.log('📤 HTTP 메서드: POST');

    // API 호출
    const response = await apiClient.post(
      url,
      {},
      {
        timeout: 60000, // 60초로 설정 (GPT API 호출 시간 포함)
      }
    );

    console.log('📊 퀴즈 생성 API 응답:', {
      status: response.status,
      rawData: response.data,
      dataType: typeof response.data,
      hasData: !!response.data,
      hasDataField: !!(response.data && response.data.data),
    });

    // 서버 응답 구조 확인 및 데이터 추출
    let quizzesArray: Quiz[] = [];

    if (Array.isArray(response.data)) {
      // 직접 배열로 응답하는 경우
      quizzesArray = response.data;
    } else if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.data)) {
        // response.data.data에 배열이 있는 경우
        quizzesArray = response.data.data;
      } else {
        console.error('❌ 응답 데이터의 data 필드가 배열이 아닙니다:', response.data);
        throw new Error('서버 응답 데이터 구조가 올바르지 않습니다.');
      }
    } else {
      console.error('❌ 응답 데이터가 예상과 다릅니다:', response.data);
      throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
    }

    console.log('✅ 퀴즈 생성 성공:', {
      quizCount: quizzesArray.length,
      quizzes: quizzesArray.map((q) => ({
        quizId: q.quizId,
        question: q.question.substring(0, 50) + '...',
        optionsCount: Object.keys(q.options).length,
      })),
    });

    return quizzesArray;
  } catch (error: any) {
    console.error('❌ 퀴즈 생성 API 호출 실패:', error);

    if (error.response) {
      console.error('🔍 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 400) {
        throw new Error('잘못된 요청입니다. storyId를 확인해주세요.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인해주세요.');
      } else if (error.response.status === 404) {
        throw new Error('동화를 찾을 수 없습니다.');
      } else if (error.response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(
          `퀴즈 생성 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
        );
      }
    } else if (error.request) {
      console.error('🔍 네트워크 요청 에러:', error.request);
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      console.error('🔍 기타 에러:', error.message);
      throw error;
    }
  }
};

/**
 * 특정 동화의 퀴즈 목록 조회 API
 * 해당 storyId의 모든 퀴즈를 조회합니다.
 *
 * @param storyId - 동화 ID
 * @returns Promise<Quiz[]> - 퀴즈 목록
 * @throws Error - 퀴즈 조회 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const quizzes = await getQuizzesByStory(4, 1);
 *   console.log(`✅ ${quizzes.length}개의 퀴즈 조회 완료`);
 * } catch (error) {
 *   console.error('❌ 퀴즈 조회 실패:', error.message);
 * }
 * ```
 */
export const getQuizzesByStory = async (storyId: number, childId: number): Promise<Quiz[]> => {
  try {
    console.log('🔍 동화별 퀴즈 목록 조회 시작:', { storyId, childId });

    // 먼저 기존 퀴즈 조회 시도
    try {
      const url = `/quizzes?storyId=${storyId}&child_id=${childId}`;
      console.log('🔍 기존 퀴즈 조회 시도 (GET):', url);

      const response = await apiClient.get(url);

      // 퀴즈가 있으면 반환
      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log('✅ 기존 퀴즈 발견:', response.data.data.length, '개');

        // 삭제된 동화의 퀴즈 필터링
        const filteredQuizzes = await filterValidQuizzesByStories(response.data.data, childId);
        return filteredQuizzes;
      }
    } catch (error: any) {
      // 404 에러가 아닌 경우에만 로그 (퀴즈가 없는 경우는 정상)
      if (error.response?.status !== 404) {
        console.log('⚠️ 기존 퀴즈 조회 실패, 새로 생성 시도:', error.response?.status);
        console.log('🔍 GET 요청 실패 상세:', {
          method: 'GET',
          url: `/quizzes?storyId=${storyId}&child_id=${childId}`,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    }

    // 퀴즈가 없으면 새로 생성
    console.log('🔄 퀴즈가 없습니다. 새로 생성 중...');
    const newQuizzes = await createQuiz({ storyId, childId });

    // 새로 생성된 퀴즈도 필터링
    const filteredNewQuizzes = await filterValidQuizzesByStories(newQuizzes, childId);
    return filteredNewQuizzes;
  } catch (error: any) {
    console.error('❌ 퀴즈 목록 조회 실패:', error);

    if (error.response) {
      console.error('🔍 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 404) {
        throw new Error('동화를 찾을 수 없습니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인해주세요.');
      } else if (error.response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(
          `퀴즈 조회 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
        );
      }
    } else if (error.request) {
      console.error('🔍 네트워크 요청 에러:', error.request);
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      console.error('🔍 기타 에러:', error.message);
      throw error;
    }
  }
};

/**
 * 퀴즈 제출 API
 * 주어진 storyId의 모든 문항에 대해 사용자의 선택을 제출합니다.
 *
 * @param storyId - 동화 ID
 * @param childId - 자녀 ID
 * @param answers - 퀴즈 답변 배열
 * @returns Promise<void> - 제출 성공 시
 * @throws Error - 제출 실패 시
 */
export const submitQuiz = async (
  storyId: number,
  childId: number,
  answers: QuizSubmitRequest[]
): Promise<void> => {
  try {
    console.log('📝 퀴즈 제출 API 호출 시작:', {
      storyId,
      childId,
      answerCount: answers.length,
      answers: answers.map((a) => ({ quizId: a.quizId, selectedAnswer: a.selectedAnswer })),
    });

    const url = `/quizzes/submit?storyId=${storyId}&childId=${childId}`;
    console.log('🌐 API 요청 URL:', url);

    const response = await apiClient.post(url, answers);

    console.log('✅ 퀴즈 제출 성공:', {
      status: response.status,
      message: response.data?.message || '제출 완료',
    });
  } catch (error: any) {
    console.error('❌ 퀴즈 제출 실패:', error);

    if (error.response) {
      console.error('🔍 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 400) {
        throw new Error('잘못된 요청입니다. 답변을 확인해주세요.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인해주세요.');
      } else if (error.response.status === 404) {
        throw new Error('동화나 자녀를 찾을 수 없습니다.');
      } else if (error.response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(
          `퀴즈 제출 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
        );
      }
    } else if (error.request) {
      console.error('🔍 네트워크 요청 에러:', error.request);
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      console.error('🔍 기타 에러:', error.message);
      throw error;
    }
  }
};

/**
 * 퀴즈 결과 조회 API
 * 자녀 ID와 동화 ID로 최근 제출 결과(총점/정답 수 등)를 조회합니다.
 *
 * @param storyId - 동화 ID
 * @param childId - 자녀 ID
 * @returns Promise<QuizResultsResponse> - 퀴즈 결과
 * @throws Error - 결과 조회 실패 시
 */
export const getQuizResults = async (
  storyId: number,
  childId: number
): Promise<QuizResultsResponse> => {
  try {
    console.log('🏆 퀴즈 결과 조회 시작:', { storyId, childId });

    const response = await apiClient.get(`/quizzes/results?storyId=${storyId}&childId=${childId}`);

    console.log('📊 퀴즈 결과 조회 API 응답:', {
      status: response.status,
      rawData: response.data,
      dataType: typeof response.data,
      hasData: !!response.data,
      hasDataField: !!(response.data && response.data.data),
    });

    // 서버 응답 구조 확인 및 데이터 추출
    let resultsData: QuizResultsResponse;

    if (response.data && typeof response.data === 'object') {
      if (response.data.data) {
        // response.data.data에 결과가 있는 경우
        resultsData = response.data.data;
      } else {
        // 직접 response.data에 결과가 있는 경우
        resultsData = response.data;
      }
    } else {
      console.error('❌ 응답 데이터가 예상과 다릅니다:', response.data);
      throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
    }

    console.log('✅ 퀴즈 결과 조회 성공:', {
      storyId,
      childId,
      score: resultsData.score,
      totalQuiz: resultsData.totalQuiz,
      correctAnswers: resultsData.correctAnswers,
      resultsCount: resultsData.results.length,
    });

    return resultsData;
  } catch (error: any) {
    console.error('❌ 퀴즈 결과 조회 실패:', error);

    if (error.response) {
      console.error('🔍 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 404) {
        throw new Error('퀴즈 결과를 찾을 수 없습니다. 먼저 퀴즈를 제출해주세요.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인해주세요.');
      } else if (error.response.status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(
          `퀴즈 결과 조회 실패 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
        );
      }
    } else if (error.request) {
      console.error('🔍 네트워크 요청 에러:', error.request);
      throw new Error('네트워크 연결을 확인해주세요.');
    } else {
      console.error('🔍 기타 에러:', error.message);
      throw error;
    }
  }
};

/**
 * 삭제된 동화의 퀴즈를 필터링하는 함수
 * 현재 존재하는 동화 목록과 비교하여 유효한 퀴즈만 반환
 */
export const filterValidQuizzesByStories = async (
  quizzes: Quiz[],
  childId: number
): Promise<Quiz[]> => {
  try {
    // 현재 존재하는 동화 목록 가져오기
    const { loadStoriesByChildId } = require('@/features/storyCreate/storyStorage');
    const existingStories = await loadStoriesByChildId(childId);
    const existingStoryIds = new Set(existingStories.map((story) => story.storyId));

    // 퀴즈 데이터에서 storyId가 존재하는 동화에 속한 퀴즈만 필터링
    const validQuizzes = quizzes.filter((quiz) => {
      if (!existingStoryIds.has(quiz.storyId)) {
        console.log(`🗑️ 삭제된 동화 ${quiz.storyId}의 퀴즈 제거: ${quiz.question}`);
        return false;
      }
      return true;
    });

    console.log(
      `✅ 퀴즈 필터링 완료: ${quizzes.length}개 → ${validQuizzes.length}개 (삭제된 동화 퀴즈 제거)`
    );
    return validQuizzes;
  } catch (error) {
    console.error('❌ 퀴즈 필터링 실패:', error);
    // 필터링 실패 시 원본 퀴즈 반환
    return quizzes;
  }
};

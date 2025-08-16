/**
 * 단어 사전 관련 API
 *
 * 영어 단어 조회 및 사용자 사전 저장 기능을 담당하는 모듈입니다.
 * 사용자 ID와 자녀 프로필 ID를 기반으로 단어를 저장합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 외부 라이브러리 import 섹션 =====
import { apiClient } from './client';

// ===== 타입 정의 섹션 =====

/**
 * 단어 저장 요청 데이터 타입 정의
 *
 * 영어 단어를 조회하고 사용자 사전에 저장할 때 서버로 전송하는 데이터의 구조입니다.
 * 모든 필드가 필수이며, 쿼리 파라미터로 전송됩니다.
 */
export interface SaveWordRequest {
  userID: number; // 유저 ID (필수)
  childID: number; // 자녀 프로필 ID (필수)
  word: string; // 하이라이트된 단어 (필수)
}

/**
 * 단어 저장 응답 데이터 타입 정의
 *
 * 서버에서 단어 저장 요청을 처리한 후 반환하는 응답의 구조입니다.
 * 저장된 단어의 상세 정보를 포함합니다.
 */
export interface SaveWordResponse {
  savedId: number; // 저장된 단어의 고유 ID
  childId: number; // 자녀 프로필 ID
  word: string; // 저장된 영어 단어
  meaning: string; // 단어의 한국어 의미
  exampleEng: string; // 영어 예문
  exampleKor: string; // 한국어 예문 번역
  savedAt: string; // 저장된 날짜/시간 (ISO 8601 형식)
}

// ===== API 함수 정의 섹션 =====

/**
 * 단어 조회 및 저장 API 함수
 *
 * 영어 단어를 조회하고 사용자 사전에 저장합니다.
 * 사용자 ID와 자녀 프로필 ID를 기반으로 단어를 저장하며,
 * 서버에서 단어의 의미와 예문을 자동으로 제공합니다.
 *
 * @param requestData - 단어 저장에 필요한 요청 데이터 (userID, childID, word)
 * @returns Promise<SaveWordResponse> - 단어 저장 결과를 담은 Promise
 * @throws Error - 네트워크 오류, 서버 오류, 또는 요청 데이터 오류 시 발생
 *
 * @example
 * ```typescript
 * const result = await saveWord({
 *   userID: 123,
 *   childID: 456,
 *   word: "adventure"
 * });
 * console.log('저장된 단어:', result.word);
 * console.log('의미:', result.meaning);
 * console.log('예문:', result.exampleEng);
 * ```
 */
export const saveWord = async (requestData: SaveWordRequest): Promise<SaveWordResponse> => {
  try {
    // 요청할 완전한 URL을 생성합니다
    const fullUrl = `${apiClient.defaults.baseURL}/dictionaries/words/save`;

    // 🔍 요청 세부 정보 상세 출력
    console.log('\n📚 ===== 단어 저장 요청 상세 정보 =====');
    console.log('📍 요청 URL 정보:');
    console.log(`   🌐 완전한 URL: ${fullUrl}`);
    console.log(`   🏠 Base URL: ${apiClient.defaults.baseURL}`);
    console.log(`   📂 Endpoint: /dictionaries/words/save`);
    console.log('📤 요청 메서드:');
    console.log(`   🔧 Method: POST`);
    console.log('📋 요청 쿼리 파라미터:');
    console.log(`   👤 userID: ${requestData.userID}`);
    console.log(`   👶 childID: ${requestData.childID}`);
    console.log(`   📝 word: ${requestData.word}`);
    console.log('🔧 ==========================================\n');

    // 서버로 단어 저장 요청을 전송합니다
    // 쿼리 파라미터로 데이터를 전송
    const response = await apiClient.post<SaveWordResponse>('/dictionaries/words/save', null, {
      params: {
        userID: requestData.userID,
        childID: requestData.childID,
        word: requestData.word,
      },
    });

    // 🔍 실제 전송된 요청 정보 확인
    console.log('📤 ===== 실제 전송된 요청 확인 =====');
    console.log(`🌐 실제 요청 URL: ${response.config.url}`);
    console.log(`🔧 실제 메서드: ${response.config.method?.toUpperCase()}`);
    console.log(`🔧 요청 헤더:`, response.config.headers);
    console.log('🔧 =====================================\n');

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 단어 저장 성공:', response.data);

    // 서버 응답 데이터를 반환합니다
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 콘솔에 기록합니다
    console.error('❌ 단어 저장 실패:', error);

    // 🔍 서버 응답 상세 정보 추가 로깅
    if (error.response) {
      console.error('📋 서버 응답 상세 정보:');
      console.error(`   📊 Status Code: ${error.response.status}`);
      console.error(`   📝 Status Text: ${error.response.statusText}`);
      console.error(`   📋 Response Data:`, error.response.data);
      console.error(`   🔧 Response Headers:`, error.response.headers);
      console.error(`   🌐 Request URL: ${error.config?.url}`);
      console.error(`   📤 Request Params:`, error.config?.params);
    }

    // 에러의 종류에 따라 다른 메시지를 생성합니다
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드인 경우 (4xx, 5xx)
      const status = error.response.status;
      const serverMessage = error.response.data?.message || '알 수 없는 오류';

      // 상태 코드별로 적절한 에러 메시지 생성
      if (status === 400) {
        throw new Error(
          '요청 데이터가 올바르지 않습니다. 사용자 ID, 자녀 ID, 단어를 확인해주세요.'
        );
      } else if (status === 401) {
        throw new Error('인증이 필요합니다. 로그인 상태를 확인해주세요.');
      } else if (status === 403) {
        throw new Error('해당 자녀 프로필에 접근할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('자녀 프로필을 찾을 수 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`단어 저장 실패 (${status}): ${serverMessage}`);
      }
    } else if (error.request) {
      // 요청은 보냈지만 서버로부터 응답을 받지 못한 경우 (네트워크 문제)
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청을 설정하는 과정에서 발생한 에러 (클라이언트 측 문제)
      throw new Error(`요청 설정 오류: ${error.message}`);
    }
  }
};

/**
 * 동화 ID로 단어 추출 및 저장 API 함수
 *
 * 동화 본문에서 **로 감싼 단어들을 추출하고, 단어 정보를 GPT로 조회하여 DB에 저장 후 자녀에게 연동합니다.
 * 동화 생성 완료 후 자동으로 호출되어 학습할 단어들을 준비합니다.
 *
 * @param storyId - 동화 ID (필수)
 * @param childId - 자녀 프로필 ID (필수)
 * @returns Promise<SaveWordResponse[]> - 저장된 단어들의 배열
 * @throws Error - 네트워크 오류, 서버 오류, 또는 요청 데이터 오류 시 발생
 *
 * @example
 * ```typescript
 * const savedWords = await saveWordsByStory({
 *   storyId: 1,
 *   childId: 3
 * });
 * console.log('저장된 단어 수:', savedWords.length);
 * savedWords.forEach(word => {
 *   console.log(`${word.word}: ${word.meaning}`);
 * });
 * ```
 */
export const saveWordsByStory = async (storyId: number, childId: number): Promise<SaveWordResponse[]> => {
  try {
    // 요청할 완전한 URL을 생성합니다
    const fullUrl = `${apiClient.defaults.baseURL}/dictionaries/words/save-by-story`;

    // 🔍 요청 세부 정보 상세 출력
    console.log('\n📚 ===== 동화 기반 단어 저장 요청 상세 정보 =====');
    console.log('📍 요청 URL 정보:');
    console.log(`   🌐 완전한 URL: ${fullUrl}`);
    console.log(`   🏠 Base URL: ${apiClient.defaults.baseURL}`);
    console.log(`   📂 Endpoint: /dictionaries/words/save-by-story`);
    console.log('📤 요청 메서드:');
    console.log(`   🔧 Method: POST`);
    console.log('📋 요청 쿼리 파라미터:');
    console.log(`   📖 storyId: ${storyId}`);
    console.log(`   👶 childId: ${childId}`);
    console.log('🔧 ==========================================\n');

    // 서버로 동화 기반 단어 저장 요청을 전송합니다
    // 쿼리 파라미터로 데이터를 전송
    const response = await apiClient.post<SaveWordResponse[]>('/dictionaries/words/save-by-story', null, {
      params: {
        storyId,
        childId,
      },
    });

    // 🔍 실제 전송된 요청 정보 확인
    console.log('📤 ===== 실제 전송된 요청 확인 =====');
    console.log(`🌐 실제 요청 URL: ${response.config.url}`);
    console.log(`🔧 실제 메서드: ${response.config.method?.toUpperCase()}`);
    console.log(`🔧 요청 헤더:`, response.config.headers);
    console.log('🔧 =====================================\n');

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 동화 기반 단어 저장 성공:', {
      storyId,
      childId,
      savedWordsCount: response.data.length,
      words: response.data.map(word => word.word),
    });

    // 서버 응답 데이터를 반환합니다
    return response.data;
  } catch (error: any) {
    // 에러가 발생했을 때 상세 정보를 콘솔에 기록합니다
    console.error('❌ 동화 기반 단어 저장 실패:', error);

    // 🔍 서버 응답 상세 정보 추가 로깅
    if (error.response) {
      console.error('📋 서버 응답 상세 정보:');
      console.error(`   📊 Status Code: ${error.response.status}`);
      console.error(`   📝 Status Text: ${error.response.statusText}`);
      console.error(`   📋 Response Data:`, error.response.data);
      console.error(`   🔧 Response Headers:`, error.response.headers);
      console.error(`   🌐 Request URL: ${error.config?.url}`);
      console.error(`   📤 Request Params:`, error.config?.params);
    }

    // 에러의 종류에 따라 다른 메시지를 생성합니다
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드인 경우 (4xx, 5xx)
      const status = error.response.status;
      const serverMessage = error.response.data?.message || '알 수 없는 오류';

      // 상태 코드별로 적절한 에러 메시지 생성
      if (status === 400) {
        throw new Error('요청 데이터가 올바르지 않습니다. 동화 ID와 자녀 ID를 확인해주세요.');
      } else if (status === 401) {
        throw new Error('인증이 필요합니다. 로그인 상태를 확인해주세요.');
      } else if (status === 403) {
        throw new Error('해당 동화나 자녀 프로필에 접근할 권한이 없습니다.');
      } else if (status === 404) {
        throw new Error('동화나 자녀 프로필을 찾을 수 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`동화 기반 단어 저장 실패 (${status}): ${serverMessage}`);
      }
    } else if (error.request) {
      // 요청은 보냈지만 서버로부터 응답을 받지 못한 경우 (네트워크 문제)
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청을 설정하는 과정에서 발생한 에러 (클라이언트 측 문제)
      throw new Error(`요청 설정 오류: ${error.message}`);
    }
  }
};

import { apiClient } from '@/shared/api/client';
import { API_CONFIG } from '@/shared/config/api';
import {
  CreateStoryRequest,
  CreateStoryResponse,
  StoryData,
  StorySection,
  StorySectionsResponse,
  CreateIllustrationRequest,
  CreateIllustrationResponse,
  Illustration,
  LocalIllustration,
  TTSRequest,
  TTSResponse,
  TTSAudioInfo,
  SavedWord,
} from './types';
import {
  addStoryToStorage,
  removeStoryFromStorage,
  clearStoriesFromStorage,
  saveStories,
  removeStorySections,
  clearAllStorySections,
} from './storyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { saveWordsByStory, getAllWordsByChild, getWordsByStory } from '@/shared/api/dictionaryApi';

/**
 * AI 기반 동화 통합 생성 API
 * 키워드들을 프롬프트로 변환하여 서버에 요청하고 동화/단어/퀴즈를 일괄 생성
 *
 * 동화 통합 생성 전체 흐름:
 * 1. 동화 생성 및 단어/퀴즈 일괄 생성 (POST /integration/stories) - GPT API로 동화 내용, 단어, 퀴즈 동시 생성
 * 2. 동화 단락 조회 (GET /stories/{id}/sections) - 단락별 내용 수집
 * 3. 삽화 생성 (POST /illustrations/sections) - DALL·E API로 단락별 삽화 자동 생성
 * 4. TTS 생성 (POST /speech/tts) - Polly API로 음성 합성
 *
 * API 스펙:
 * - Method: POST
 * - Endpoint: /integration/stories
 * - Request: { keywords: string[], childId: number }
 * - Response: { storyId, title, content, contentKr, keywords, progress, createdAt, updatedAt }
 */
export const createIntegratedStory = async (request: CreateStoryRequest): Promise<StoryData> => {
  try {
    console.log('동화 통합 생성 요청:', {
      url: '/integration/stories',
      method: 'POST',
      data: request,
    });

    // API 클라이언트 설정 정보 로깅
    console.log('🔧 API 클라이언트 설정:', {
      baseURL: apiClient.defaults.baseURL,
      timeout: apiClient.defaults.timeout,
    });

    // 인증 토큰 상태 확인
    console.log('🔐 인증 토큰 상태 확인 중...');
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    console.log('✅ 인증 토큰 확인 완료');

    // 서버에 동화 통합 생성 요청 (서버가 내부적으로 GPT API 호출하여 동화/단어/퀴즈 일괄 생성)
    console.log('🚀 서버에 동화 통합 생성 요청 전송 중...');
    console.log('   ⏱️ 최대 120초 대기 (GPT API 응답 시간 포함)...');

    const startTime = Date.now();
    // childId는 쿼리 파라미터로, keywords는 요청 본문으로 전송
    const { childId, ...requestBody } = request;
    const response = await apiClient.post<CreateStoryResponse>(
      `/integration/stories?childId=${childId}`,
      requestBody,
      {
        timeout: 120000, // 120초로 늘림 (서버의 GPT API 호출 시간 포함)
      }
    );
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 서버 응답 완료 (소요시간: ${duration}ms)`);
    console.log('동화 통합 생성 성공:', {
      status: response.status,
      storyId: response.data.data?.storyId,
      title: response.data.data?.title,
      keywords: response.data.data?.keywords,
      hasProgress: !!response.data.data?.progress,
    });

    const storyData = response.data.data;

    // 기존 로컬 데이터 완전 삭제 후 서버 데이터만 저장
    try {
      console.log('🗑️ 기존 로컬 데이터 삭제 시작...');
      await clearStoriesFromStorage(request.childId);
      await clearAllStorySections(request.childId);
      console.log('✅ 기존 로컬 데이터 삭제 완료');

      const storyWithDefaults = {
        ...storyData, // response.data.data에서 실제 동화 데이터 추출
        childId: request.childId || 0, // childId가 없으면 기본값 사용
        isBookmarked: false,
        isLiked: false,
      };
      await addStoryToStorage(storyWithDefaults);
      console.log('동화 로컬 저장 완료:', storyData.storyId);
    } catch (storageError) {
      console.error('동화 로컬 저장 실패:', storageError);
      // 로컬 저장 실패는 동화 생성 실패로 처리하지 않음
    }

    // 동화 통합 생성 성공 후 단계별 처리 시작
    // 1단계: 동화 단락 조회 (삽화 생성을 위한 단락 정보 수집)
    try {
      console.log('📖 동화 단락 조회 시작...');
      const sections = await fetchStorySections(storyData.storyId, request.childId);
      console.log(`동화 단락 ${sections.length}개 조회 완료`);
    } catch (sectionsError) {
      console.error('동화 단락 조회 실패:', sectionsError);
      // 단락 조회 실패는 삽화 생성 실패로 처리하지 않음
    }

    // 2단계: 삽화 생성 (DALL·E 기반 단락별 삽화 자동 생성)
    try {
      console.log('🎨 삽화 생성 시작...');

      // 삽화 생성 요청 (서버에서 모든 단락에 대해 자동 생성)
      const illustrationRequest = {
        storyId: storyData.storyId,
        // sectionId는 불필요 - 서버에서 storyId 기반으로 모든 단락에 대해 삽화 자동 생성
      };

      const illustrations = await createIllustration(illustrationRequest, request.childId);
      console.log('삽화 생성 성공:', {
        count: illustrations.length,
        illustrations: illustrations.map((ill) => ({
          illustrationId: ill.illustrationId,
          orderIndex: ill.orderIndex,
          imageUrl: ill.imageUrl,
        })),
      });

      // 3개 삽화를 단락 수에 따라 균등하게 배치
      if (illustrations.length > 0) {
        try {
          // 동화 단락 정보 가져오기
          const sections = await fetchStorySections(storyData.storyId, request.childId);
          const totalSections = sections.length;

          console.log(`📖 총 ${totalSections}개 단락에 대해 삽화 배치 시작...`);

          // 3개 삽화를 단락 수에 따라 균등하게 분배
          const illustrationMapping = distributeIllustrationsToSections(
            totalSections,
            illustrations
          );

          // 각 단락에 삽화 정보 추가
          sections.forEach((section, index) => {
            const mappedIllustration = illustrationMapping[index];
            if (mappedIllustration) {
              section.illustrationId = mappedIllustration.illustrationId;
              section.imageUrl = mappedIllustration.imageUrl;
              section.description = mappedIllustration.description;
            }
          });

          // 단락별 삽화 정보는 로컬에 저장하지 않음 (서버 데이터 우선)
          console.log('✅ 단락별 삽화 배치 완료 (로컬 저장 없음)');

          // 첫 번째 삽화를 썸네일로 사용
          const firstIllustration = illustrations[0];
          try {
            const localIllustration = await downloadIllustration(firstIllustration);
            console.log('첫 번째 삽화 로컬 저장 완료:', localIllustration.localPath);
            storyData.thumbnailUrl = localIllustration.localPath;
          } catch (downloadError) {
            console.error('첫 번째 삽화 다운로드 실패:', downloadError);
            storyData.thumbnailUrl = firstIllustration.imageUrl;
          }
        } catch (mappingError) {
          console.error('삽화 배치 실패:', mappingError);
          // 배치 실패 시 첫 번째 삽화만 썸네일로 사용
          const firstIllustration = illustrations[0];
          storyData.thumbnailUrl = firstIllustration.imageUrl;
        }
      }
    } catch (illustrationError) {
      console.debug('삽화 생성 실패:', illustrationError);
      // 삽화 생성 실패는 동화 생성 실패로 처리하지 않음
      // 삽화 없이 동화만 반환
    }

    // 3단계: TTS 생성 (Polly 기반 음성 합성)
    // 삽화 생성 성공/실패와 관계없이 TTS 생성 시도
    try {
      console.log('🔊 TTS 생성 시작...');

      // 동화의 모든 단락 정보 가져오기
      const sections = await fetchStorySections(storyData.storyId, request.childId);

      if (sections && sections.length > 0) {
        console.log(`📖 총 ${sections.length}개 단락에 대해 TTS 생성 시작...`);

        // requestAllSectionsTTS 함수 사용하여 일괄 처리
        const successfulTTS = await requestAllSectionsTTS(
          request.childId,
          storyData.storyId,
          sections
          // voiceId와 speechRate는 디폴트값 사용
        );

        console.log(`🎉 TTS 생성 완료: ${successfulTTS.length}/${sections.length}개 단락 성공`);
      } else {
        console.log('⚠️ 동화 단락 정보를 가져올 수 없어 TTS 생성을 건너뜁니다.');
      }
    } catch (ttsError) {
      console.error('TTS 생성 실패:', ttsError);
      // TTS 생성 실패는 동화 생성 실패로 처리하지 않음
      // TTS 없이 동화만 반환
    }

    return storyData; // 실제 동화 데이터 반환
  } catch (error: any) {
    console.error('동화 통합 생성 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      isNetworkError: !error.response,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    });

    // 네트워크 에러인지 확인
    if (!error.response) {
      console.error('🔍 Network Error 상세 분석:');
      console.error('   - 서버 연결 실패 또는 서버 내부 오류');
      console.error('   - 서버에서 GPT API 호출 중 문제 발생 가능성');
      console.error('   - 서버 로그 확인 필요 (GPT API 키, 할당량, 응답 시간 등)');
      console.error('   - 다른 API는 정상 작동하므로 서버 내부 로직 문제일 가능성 높음');
      throw new Error(
        '서버에 연결할 수 없습니다. 서버에서 GPT API 호출 중 문제가 발생했을 수 있습니다.'
      );
    }

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '동화 통합 생성에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * AI 기반 동화 생성 API
 * 키워드들을 프롬프트로 변환하여 서버에 요청
 *
 * 동화 생성 전체 흐름:
 * 1. 동화 생성 (POST /stories) - GPT API로 동화 내용 생성
 * 2. 동화 단락 조회 (GET /stories/{id}/sections) - 단락별 내용 수집
 * 3. 단어 저장 (POST /dictionaries/words/save-by-story) - **로 감싼 단어들을 추출하여 GPT로 조회 후 DB 저장
 * 4. 삽화 생성 (POST /illustrations/sections) - DALL·E API로 단락별 삽화 자동 생성
 * 5. TTS 생성 (POST /speech/tts) - Polly API로 음성 합성 (현재는 첫 번째 단락만)
 *
 * API 스펙:
 * - Method: POST
 * - Endpoint: /stories
 * - Request: { keywords: string[], childId: number }
 * - Response: { storyId, title, content, contentKr, keywords, createdAt, updatedAt }
 */
export const createStory = async (request: CreateStoryRequest): Promise<StoryData> => {
  try {
    console.log('동화 생성 요청:', {
      url: '/stories',
      method: 'POST',
      data: request,
    });

    // API 클라이언트 설정 정보 로깅
    console.log('🔧 API 클라이언트 설정:', {
      baseURL: apiClient.defaults.baseURL,
      timeout: apiClient.defaults.timeout,
    });

    // 인증 토큰 상태 확인
    console.log('🔐 인증 토큰 상태 확인 중...');
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    console.log('✅ 인증 토큰 확인 완료');

    // 서버에 동화 생성 요청 (서버가 내부적으로 GPT API 호출)
    console.log('🚀 서버에 동화 생성 요청 전송 중...');
    console.log('   ⏱️ 최대 60초 대기 (GPT API 응답 시간 포함)...');

    const startTime = Date.now();
    // childId는 쿼리 파라미터로, keywords는 요청 본문으로 전송
    const { childId, ...requestBody } = request;
    const response = await apiClient.post<CreateStoryResponse>(
      `/stories?childId=${childId}`,
      requestBody,
      {
        timeout: 60000, // 60초로 늘림 (서버의 GPT API 호출 시간 포함)
      }
    );
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 서버 응답 완료 (소요시간: ${duration}ms)`);
    console.log('동화 생성 성공:', {
      status: response.status,
      storyId: response.data.data?.storyId,
      title: response.data.data?.title,
      keywords: response.data.data?.keywords,
    });

    const storyData = response.data.data;

    // 기존 로컬 데이터 완전 삭제 후 서버 데이터만 저장
    try {
      console.log('🗑️ 기존 로컬 데이터 삭제 시작...');
      await clearStoriesFromStorage(request.childId);
      await clearAllStorySections(request.childId);
      console.log('✅ 기존 로컬 데이터 삭제 완료');

      const storyWithDefaults = {
        ...storyData, // response.data.data에서 실제 동화 데이터 추출
        childId: request.childId || 0, // childId가 없으면 기본값 사용
        isBookmarked: false,
        isLiked: false,
      };
      await addStoryToStorage(storyWithDefaults);
      console.log('동화 로컬 저장 완료:', storyData.storyId);
    } catch (storageError) {
      console.error('동화 로컬 저장 실패:', storageError);
      // 로컬 저장 실패는 동화 생성 실패로 처리하지 않음
    }

    // 동화 생성 성공 후 단계별 처리 시작
    // 1단계: 동화 단락 조회 (삽화 생성을 위한 단락 정보 수집)
    try {
      console.log('📖 동화 단락 조회 시작...');
      const sections = await fetchStorySections(storyData.storyId, request.childId);
      console.log(`동화 단락 ${sections.length}개 조회 완료`);
    } catch (sectionsError) {
      console.error('동화 단락 조회 실패:', sectionsError);
      // 단락 조회 실패는 삽화 생성 실패로 처리하지 않음
    }

    // 2단계: 단어 저장 (GPT로 단어 추출 및 저장) - 잠시 주석처리
    /*
    try {
      console.log('🔠 단어 저장 시작...');
      const words = await saveWordsByStory(storyData.storyId, request.childId);
      console.log('단어 저장 성공:', {
        storyId: storyData.storyId,
        wordCount: words.length,
      });
    } catch (wordsError) {
      console.error('단어 저장 실패:', wordsError);
      // 단어 저장 실패는 동화 생성 실패로 처리하지 않음
    }
    */

    // 3단계: 삽화 생성 (DALL·E 기반 단락별 삽화 자동 생성)
    try {
      console.log('🎨 삽화 생성 시작...');

      // 삽화 생성 요청 (서버에서 모든 단락에 대해 자동 생성)
      const illustrationRequest = {
        storyId: storyData.storyId,
        // sectionId는 불필요 - 서버에서 storyId 기반으로 모든 단락에 대해 삽화 자동 생성
      };

      const illustrations = await createIllustration(illustrationRequest, request.childId);
      console.log('삽화 생성 성공:', {
        count: illustrations.length,
        illustrations: illustrations.map((ill) => ({
          illustrationId: ill.illustrationId,
          orderIndex: ill.orderIndex,
          imageUrl: ill.imageUrl,
        })),
      });

      // 3개 삽화를 단락 수에 따라 균등하게 배치
      if (illustrations.length > 0) {
        try {
          // 동화 단락 정보 가져오기
          const sections = await fetchStorySections(storyData.storyId, request.childId);
          const totalSections = sections.length;

          console.log(`📖 총 ${totalSections}개 단락에 대해 삽화 배치 시작...`);

          // 3개 삽화를 단락 수에 따라 균등하게 분배
          const illustrationMapping = distributeIllustrationsToSections(
            totalSections,
            illustrations
          );

          // 각 단락에 삽화 정보 추가
          sections.forEach((section, index) => {
            const mappedIllustration = illustrationMapping[index];
            if (mappedIllustration) {
              section.illustrationId = mappedIllustration.illustrationId;
              section.imageUrl = mappedIllustration.imageUrl;
              section.description = mappedIllustration.description;
            }
          });

          // 단락별 삽화 정보는 로컬에 저장하지 않음 (서버 데이터 우선)
          console.log('✅ 단락별 삽화 배치 완료 (로컬 저장 없음)');

          // 첫 번째 삽화를 썸네일로 사용
          const firstIllustration = illustrations[0];
          try {
            const localIllustration = await downloadIllustration(firstIllustration);
            console.log('첫 번째 삽화 로컬 저장 완료:', localIllustration.localPath);
            storyData.thumbnailUrl = localIllustration.localPath;
          } catch (downloadError) {
            console.error('첫 번째 삽화 다운로드 실패:', downloadError);
            storyData.thumbnailUrl = firstIllustration.imageUrl;
          }
        } catch (mappingError) {
          console.error('삽화 배치 실패:', mappingError);
          // 배치 실패 시 첫 번째 삽화만 썸네일로 사용
          const firstIllustration = illustrations[0];
          storyData.thumbnailUrl = firstIllustration.imageUrl;
        }
      }
    } catch (illustrationError) {
      console.debug('삽화 생성 실패:', illustrationError);
      // 삽화 생성 실패는 동화 생성 실패로 처리하지 않음
      // 삽화 없이 동화만 반환
    }

    // 4단계: TTS 생성 (Polly 기반 음성 합성)
    // 삽화 생성 성공/실패와 관계없이 TTS 생성 시도
    try {
      console.log('🔊 TTS 생성 시작...');

      // 동화의 모든 단락 정보 가져오기
      const sections = await fetchStorySections(storyData.storyId, request.childId);

      if (sections && sections.length > 0) {
        console.log(`📖 총 ${sections.length}개 단락에 대해 TTS 생성 시작...`);

        // requestAllSectionsTTS 함수 사용하여 일괄 처리
        const successfulTTS = await requestAllSectionsTTS(
          request.childId,
          storyData.storyId,
          sections
          // voiceId와 speechRate는 디폴트값 사용
        );

        console.log(`🎉 TTS 생성 완료: ${successfulTTS.length}/${sections.length}개 단락 성공`);
      } else {
        console.log('⚠️ 동화 단락 정보를 가져올 수 없어 TTS 생성을 건너뜁니다.');
      }
    } catch (ttsError) {
      console.error('TTS 생성 실패:', ttsError);
      // TTS 생성 실패는 동화 생성 실패로 처리하지 않음
      // TTS 없이 동화만 반환
    }

    return storyData; // 실제 동화 데이터 반환
  } catch (error: any) {
    console.error('동화 생성 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      isNetworkError: !error.response,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    });

    // 네트워크 에러인지 확인
    if (!error.response) {
      console.error('🔍 Network Error 상세 분석:');
      console.error('   - 서버 연결 실패 또는 서버 내부 오류');
      console.error('   - 서버에서 GPT API 호출 중 문제 발생 가능성');
      console.error('   - 서버 로그 확인 필요 (GPT API 키, 할당량, 응답 시간 등)');
      console.error('   - 다른 API는 정상 작동하므로 서버 내부 로직 문제일 가능성 높음');
      throw new Error(
        '서버에 연결할 수 없습니다. 서버에서 GPT API 호출 중 문제가 발생했을 수 있습니다.'
      );
    }

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '동화 생성에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 삽화(썸네일) 생성 API
 * DALL·E 기반으로 삽화 이미지를 생성합니다.
 *
 * @param request - 삽화 생성 요청 데이터
 * @returns Promise<Illustration> - 생성된 삽화 데이터
 *
 * API 스펙:
 * - Method: POST
 * - Endpoint: /illustrations
 * - Request: { storyId: number, sectionId: number }
 * - Response: { illustrationId, storyId, orderIndex, imageUrl, description, createdAt }
 */
export const createIllustration = async (
  request: CreateIllustrationRequest,
  childId: number // childId 파라미터 추가
): Promise<Illustration[]> => {
  try {
    console.log('🎨 삽화 생성 요청 시작:', {
      url: `/illustrations/sections?childId=${childId}`,
      method: 'POST',
      requestData: {
        storyId: request.storyId,
        childId,
      },
    });

    // 인증 토큰 상태 확인
    console.log('🔐 삽화 생성 - 인증 토큰 상태 확인 중...');
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    console.log('✅ 삽화 생성 - 인증 토큰 확인 완료');

    // 서버에 삽화 생성 요청 (서버가 내부적으로 DALL·E API 호출)
    console.log('🎨 서버에 삽화 생성 요청 전송 중...');
    console.log('   📝 요청 데이터:', {
      storyId: request.storyId,
      childId,
    });
    console.log('   ⏱️ 최대 5분 대기 (14개 단락의 DALL·E API 응답 시간 포함)...');
    console.log('   📊 예상 소요시간: 2-3분 (단락당 10-15초)');

    const startTime = Date.now();
    const response = await apiClient.post<CreateIllustrationResponse>(
      `/illustrations/sections?storyId=${request.storyId}&childId=${childId}`,
      {}, // 요청 본문은 비움 - storyId와 childId 모두 쿼리 파라미터로 전송
      {
        timeout: 300000, // 5분으로 설정 (14개 단락의 DALL·E API 호출 시간 포함)
      }
    );
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 삽화 생성 응답 완료 (소요시간: ${duration}ms)`);
    console.log('🎨 삽화 생성 성공 상세:', {
      status: response.status,
      responseData: response.data,
      illustrationsCount: response.data.data?.illustrations?.length || 0,
    });

    // API 응답에서 삽화 배열 반환
    return response.data.data?.illustrations || [];
  } catch (error: any) {
    console.debug('❌ 삽화 생성 실패 상세:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      isNetworkError: !error.response,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      fullError: error,
    });

    // 네트워크 에러인지 확인
    if (!error.response) {
      console.error('🔍 삽화 생성 Network Error 상세 분석:');
      console.error('   - 서버 연결 실패 또는 서버 내부 오류');
      console.error('   - 서버에서 DALL·E API 호출 중 문제 발생 가능성');
      console.error('   - 서버 로그 확인 필요 (DALL·E API 키, 할당량, 응답 시간 등)');
      console.error('   - 요청 데이터:', request);
      throw new Error(
        '서버에 연결할 수 없습니다. 서버에서 DALL·E API 호출 중 문제가 발생했을 수 있습니다.'
      );
    }

    // 504 오류에 대한 특별한 안내
    // if (error.response?.status === 504) {
    //   console.error('🔍 504 Gateway Timeout 상세 분석:');
    //   console.error('   - DALL·E API 응답 시간이 너무 오래 걸림');
    //   console.error('   - 서버 게이트웨이 타임아웃 설정 초과');
    //   console.error('   - 일부 삽화는 생성되었을 수 있음 (서버 로그 확인 필요)');
    //   console.error('   - 잠시 후 다시 시도하거나, 서버 관리자에게 문의');
    //   throw new Error(
    //     '삽화 생성 시간이 너무 오래 걸려서 실패했습니다. 일부 삽화는 생성되었을 수 있습니다. 잠시 후 다시 시도해주세요.'
    //   );
    // }

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '삽화 생성에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 삽화 목록 조회 API
 * 서버에서 모든 삽화 목록을 가져옵니다.
 *
 * @returns Promise<Illustration[]> - 삽화 목록
 *
 * API 스펙:
 * - Method: GET
 * - Endpoint: /illustrations
 * - Response: Illustration[]
 */
export const fetchIllustrations = async (childId: number): Promise<Illustration[]> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ fetchIllustrations: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    console.log('🎨 삽화 목록 조회 요청:', {
      url: `/illustrations?childId=${childId}`,
      method: 'GET',
      childId,
    });

    const response = await apiClient.get(`/illustrations?childId=${childId}`);

    console.log('삽화 목록 조회 응답 구조:', {
      status: response.status,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      dataKeys: response.data ? Object.keys(response.data) : 'null',
    });

    // 응답 데이터 구조 확인 및 처리
    let illustrations: Illustration[] = [];

    if (Array.isArray(response.data)) {
      // 직접 배열로 응답된 경우
      illustrations = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // 객체로 감싸진 응답인 경우 (예: { data: [...] })
      if (Array.isArray(response.data.data)) {
        illustrations = response.data.data;
      } else if (response.data.illustrations && Array.isArray(response.data.illustrations)) {
        illustrations = response.data.illustrations;
      } else {
        console.warn('예상치 못한 응답 구조:', response.data);
        illustrations = [];
      }
    }

    console.log('삽화 목록 조회 성공:', {
      status: response.status,
      count: illustrations.length,
    });

    return illustrations;
  } catch (error: any) {
    console.error('삽화 목록 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '삽화 목록 조회에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 삽화 목록을 확인하고 누락된 삽화를 다시 다운로드
 * @param userStoryIds - 사용자가 보유한 동화 ID 목록
 * @param onProgress - 진행 상황 콜백 함수 (선택사항)
 * @returns Promise<void>
 */
export const syncMissingIllustrations = async (
  userStoryIds: number[],
  childId: number,
  onProgress?: (message: string, current?: number, total?: number) => void
): Promise<void> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ syncMissingIllustrations: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    console.log('누락된 삽화 동기화 시작...');
    console.log('사용자 동화 ID 목록:', userStoryIds);

    onProgress?.('삽화 목록을 확인하는 중...');

    // 서버에서 삽화 목록 조회
    const serverIllustrations = await fetchIllustrations(childId);
    console.log(`서버에서 ${serverIllustrations.length}개의 삽화 조회 완료`);

    // 사용자가 보유한 동화에 해당하는 삽화만 필터링
    const userIllustrations = serverIllustrations.filter((illustration) =>
      userStoryIds.includes(illustration.storyId)
    );
    console.log(`사용자 동화에 해당하는 삽화 ${userIllustrations.length}개 발견`);

    if (userIllustrations.length === 0) {
      onProgress?.('삽화가 없습니다.');
      return;
    }

    onProgress?.('삽화를 다운로드하는 중...', 0, userIllustrations.length);

    // 각 삽화에 대해 로컬 파일 존재 여부 확인 및 다운로드
    for (let i = 0; i < userIllustrations.length; i++) {
      const illustration = userIllustrations[i];
      try {
        const fileName = `illustration_${illustration.illustrationId}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}illustrations/${fileName}`;

        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
          console.log(`삽화 ${illustration.illustrationId} 로컬 파일 없음, 다운로드 시작...`);
          onProgress?.(
            `삽화 ${i + 1}/${userIllustrations.length} 다운로드 중...`,
            i + 1,
            userIllustrations.length
          );
          await downloadIllustration(illustration);
          console.log(`삽화 ${illustration.illustrationId} 다운로드 완료`);
        } else {
          console.log(`삽화 ${illustration.illustrationId} 이미 존재함`);
          onProgress?.(
            `삽화 ${i + 1}/${userIllustrations.length} 확인 중...`,
            i + 1,
            userIllustrations.length
          );
        }
      } catch (downloadError) {
        console.error(`삽화 ${illustration.illustrationId} 다운로드 실패:`, downloadError);
      }
    }

    onProgress?.('삽화 동기화 완료');
    console.log('누락된 삽화 동기화 완료');
  } catch (error) {
    console.error('누락된 삽화 동기화 실패:', error);
    onProgress?.('삽화 동기화 실패');
    throw error;
  }
};

/**
 * 삽화 다운로드 및 로컬 저장
 * @param illustration - 삽화 정보 (illustrationId 포함)
 * @returns Promise<LocalIllustration> - 로컬 저장된 삽화 정보
 */
export const downloadIllustration = async (
  illustration: Illustration
): Promise<LocalIllustration> => {
  try {
    console.log(`삽화 ${illustration.illustrationId} 다운로드 시작...`);
    console.log('삽화 URL:', illustration.imageUrl);

    // illustrationId 기반 파일명 생성
    const fileName = `illustration_${illustration.illustrationId}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}illustrations/${fileName}`;

    // 디렉토리가 없으면 생성
    const dirUri = `${FileSystem.documentDirectory}illustrations/`;
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    }

    // 이미지 다운로드
    const downloadResult = await FileSystem.downloadAsync(illustration.imageUrl, fileUri);

    if (downloadResult.status === 200) {
      console.log(`삽화 ${illustration.illustrationId} 다운로드 완료:`, fileUri);

      // LocalIllustration 객체 반환
      return {
        illustrationId: illustration.illustrationId,
        storyId: illustration.storyId,
        localPath: fileUri,
        imageUrl: illustration.imageUrl,
        description: illustration.description,
        orderIndex: illustration.orderIndex || 0, // orderIndex 추가
        createdAt: illustration.createdAt,
      };
    } else {
      throw new Error(`다운로드 실패: ${downloadResult.status}`);
    }
  } catch (error) {
    console.error(`삽화 ${illustration.illustrationId} 다운로드 실패:`, error);
    throw error;
  }
};

/**
 * Polly TTS API 호출 (POST /speech/tts)
 * 단락별 TTS 음성 생성 및 오디오 파일 다운로드
 */
export const requestTTS = async (request: TTSRequest): Promise<TTSAudioInfo> => {
  try {
    console.log('🔊 TTS API 요청:', request);

    // 요청 파라미터 검증
    if (!request.childId || !request.storyId || !request.sectionId || !request.voiceId) {
      throw new Error(
        'TTS 요청 파라미터가 누락되었습니다: childId, storyId, sectionId, voiceId가 필요합니다.'
      );
    }

    if (request.speechRate < 0.1 || request.speechRate > 2.0) {
      console.warn('⚠️ speechRate가 범위를 벗어남 (0.1-2.0), 기본값 0.8 사용');
      request.speechRate = 0.8;
    }

    // 쿼리 파라미터로 전송 (POST 요청이지만 body는 없음)
    const { childId, storyId, sectionId, voiceId, speechRate } = request;
    const response = await apiClient.post<TTSResponse>(
      `/speech/tts?child_id=${childId}&story_id=${storyId}&section_id=${sectionId}&voice_id=${voiceId}&speech_rate=${speechRate}`,
      {} // 빈 body (POST 요청이지만 데이터는 쿼리 파라미터로 전송)
    );
    console.log('🔊 TTS API 응답:', {
      status: response.status,
      data: response.data,
    });

    // 응답 데이터 구조 확인 (중첩된 data 필드에서 추출)
    const ttsData = response.data.data;
    if (!ttsData) {
      throw new Error('TTS 응답 데이터가 없습니다.');
    }

    // TTS URL 확인 및 검증
    if (!ttsData.ttsUrl || typeof ttsData.ttsUrl !== 'string' || ttsData.ttsUrl.trim() === '') {
      console.error('❌ TTS URL이 유효하지 않습니다. 응답 데이터:', ttsData);
      console.error('   - ttsUrl 값:', ttsData.ttsUrl);
      console.error('   - ttsUrl 타입:', typeof ttsData.ttsUrl);
      console.error('   - ttsUrl 길이:', ttsData.ttsUrl?.length);
      throw new Error('TTS URL이 유효하지 않거나 비어있습니다.');
    }

    // URL 형식 검증
    try {
      new URL(ttsData.ttsUrl);
    } catch {
      console.error('❌ TTS URL 형식이 올바르지 않습니다:', ttsData.ttsUrl);
      throw new Error('TTS URL 형식이 올바르지 않습니다.');
    }

    console.log('✅ TTS URL 확인됨:', ttsData.ttsUrl);

    // 오디오 파일 다운로드
    const audioFileName = `tts_${request.storyId}_${request.sectionId}.mp3`;
    const audioPath = `${FileSystem.documentDirectory}tts/${audioFileName}`;
    const audioDir = `${FileSystem.documentDirectory}tts`;

    // TTS 디렉토리 생성
    const dirInfo = await FileSystem.getInfoAsync(audioDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
      console.log('📁 TTS 디렉토리 생성 완료:', audioDir);
    }

    console.log('📥 TTS 오디오 다운로드 시작:', ttsData.ttsUrl);
    const downloadResult = await FileSystem.downloadAsync(ttsData.ttsUrl, audioPath);

    if (downloadResult.status !== 200) {
      throw new Error(`TTS 오디오 다운로드 실패: ${downloadResult.status}`);
    }

    console.log('✅ TTS 오디오 다운로드 완료:', downloadResult.uri);

    return {
      storyId: request.storyId,
      sectionId: request.sectionId,
      audioPath: downloadResult.uri,
      ttsUrl: ttsData.ttsUrl,
    };
  } catch (error: any) {
    console.error('❌ TTS 생성 중 오류 발생:', error);

    // API 에러 상세 정보 로깅
    if (error.response) {
      console.error('🔍 API 에러 상세 정보:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      // 400 에러의 경우 요청 데이터 재검증
      if (error.response.status === 400) {
        console.error('🔍 400 에러 - 요청 데이터 검증:', {
          request,
          errorMessage: error.response.data?.message || '알 수 없는 400 에러',
        });
      }
    }

    throw error;
  }
};

/**
 * 동화의 모든 단락에 대해 TTS 요청 및 오디오 다운로드
 */
export const requestAllSectionsTTS = async (
  childId: number,
  storyId: number,
  sections: StorySection[],
  voiceId?: string,
  speechRate?: number
): Promise<TTSAudioInfo[]> => {
  // 디폴트값 설정
  const defaultVoiceId = voiceId || 'Seoyeon';
  const defaultSpeechRate = speechRate || 0.8;

  console.log('🔊 TTS 일괄 생성 시작:', {
    storyId,
    sectionsCount: sections.length,
    voiceId: defaultVoiceId,
    speechRate: defaultSpeechRate,
  });

  const ttsPromises = sections.map(async (section) => {
    try {
      const ttsInfo = await requestTTS({
        childId,
        storyId,
        sectionId: section.sectionId,
        voiceId: defaultVoiceId,
        speechRate: defaultSpeechRate,
      });
      console.log(`✅ 단락 ${section.sectionId} TTS 생성 성공`);
      return ttsInfo;
    } catch (error) {
      console.error(`❌ 단락 ${section.sectionId} TTS 생성 실패:`, error);
      return null;
    }
  });

  const results = await Promise.all(ttsPromises);
  const successfulTTS = results.filter(Boolean) as TTSAudioInfo[];

  console.log(`🎉 TTS 일괄 생성 완료: ${successfulTTS.length}/${sections.length}개 단락 성공`);
  return successfulTTS;
};

/**
 * 동화 삭제 API 응답 타입
 */
interface DeleteStoryResponse {
  status: number;
  message: string;
  data: string;
}

interface DeleteIllustrationResponse {
  status: number;
  message: string;
  data: string;
}

/**
 * 삽화 삭제 API
 * 서버에서 삽화를 삭제
 *
 * @param illustrationId - 삭제할 삽화 ID
 * @returns Promise<boolean> - 삭제 성공 여부
 *
 * API 스펙:
 * - Method: DELETE
 * - Endpoint: /illustrations/{id}
 * - Response: { status: 200, message: "요청 성공", data: "string" }
 */
export const deleteIllustration = async (
  illustrationId: number,
  childId: number
): Promise<boolean> => {
  try {
    console.log('삽화 삭제 요청:', {
      url: `/illustrations/${illustrationId}?childId=${childId}`,
      method: 'DELETE',
      illustrationId,
      childId,
    });

    // 서버에 삭제 요청 (childId 쿼리 파라미터 포함)
    const response = await apiClient.delete<DeleteIllustrationResponse>(
      `/illustrations/${illustrationId}?childId=${childId}`
    );

    console.log('삽화 삭제 성공:', {
      status: response.status,
      data: response.data,
    });

    // API 스펙에 따른 응답 검증
    if (response.status === 200 && response.data.status === 200) {
      console.log('서버 삽화 삭제 성공:', response.data.message);
      return true;
    } else {
      throw new Error(`서버 응답 오류: ${response.data.message || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('삽화 삭제 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '삽화 삭제에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 동화 삭제 API
 * 서버에서 동화를 삭제하고 로컬에서도 동시에 삭제
 * 서버에서 동화 삭제 시 삽화와 TTS가 자동으로 삭제됨
 *
 * @param childId - 사용자 프로필 ID (로컬 삭제용)
 * @param storyId - 삭제할 동화 ID
 * @returns Promise<boolean> - 삭제 성공 여부
 *
 * API 스펙:
 * - Method: DELETE
 * - Endpoint: /stories/{id}
 * - Response: { status: 200, message: "요청 성공", data: "string" }
 */
export const deleteStory = async (childId: number, storyId: number): Promise<boolean> => {
  try {
    console.log('동화 삭제 요청 상세:', {
      fullUrl: `${API_CONFIG.BASE_URL}/stories/${storyId}`,
      relativePath: `/stories/${storyId}`,
      method: 'DELETE',
      storyId,
      storyIdType: typeof storyId,
      baseUrl: API_CONFIG.BASE_URL,
      note: 'API 스펙에 맞는 DELETE 요청 (childId 쿼리 파라미터 포함)',
    });

    // 먼저 동화 목록을 조회하여 해당 동화가 존재하는지 확인
    try {
      const stories = await fetchStoryList(childId);
      const targetStory = stories.find((story) => story.storyId === storyId);

      if (!targetStory) {
        console.warn(`동화 ID ${storyId}가 존재하지 않습니다.`);
        throw new Error('삭제하려는 동화를 찾을 수 없습니다.');
      }

      console.log('삭제 대상 동화 확인됨:', targetStory.title);
    } catch (checkError) {
      console.error('동화 존재 여부 확인 실패:', checkError);
      // 확인 실패해도 삭제는 시도
    }

    // 서버에서 동화 삭제 시 삽화와 TTS가 자동으로 삭제되므로 별도 처리 불필요
    console.log(`동화 ${storyId} 삭제 시작...`);

    // 1단계: 서버에서 동화 삭제 (childId 쿼리 파라미터 포함)
    console.log('서버에서 동화 삭제 시도 중...');
    const response = await apiClient.delete<DeleteStoryResponse>(
      `/stories/${storyId}?childId=${childId}`
    );

    console.log('서버 응답 상세:', {
      status: response.status,
      data: response.data,
      statusText: response.statusText,
    });

    // API 스펙에 따른 응답 검증
    if (response.status === 200 && response.data.status === 200) {
      console.log('서버 동화 삭제 성공:', response.data.message);
    } else {
      throw new Error(`서버 응답 오류: ${response.data.message || '알 수 없는 오류'}`);
    }

    // 2단계: 서버 삭제 성공 시 로컬 데이터 정리
    await removeStoryFromStorage(childId, storyId);
    await removeStorySections(childId, storyId);
    console.log(`동화 ${storyId} 로컬 삭제 완료`);

    return true;
  } catch (error: any) {
    console.error('DELETE 요청 실패 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    const errorMessage =
      error.response?.data?.message || error.message || '동화 삭제에 실패했습니다.';
    console.error(`동화 삭제 실패: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

/**
 * 사용자별 동화 목록 조회 API
 * 서버에서 동화 목록을 가져와서 로컬과 동기화
 */
export const fetchUserStories = async (childId: number): Promise<any[]> => {
  try {
    console.log('사용자 동화 목록 조회 요청:', {
      url: `/stories/lists?id=${childId}`,
      method: 'GET',
      childId,
    });

    const response = await apiClient.get(`/stories/lists?id=${childId}`);

    console.log('사용자 동화 목록 조회 성공:', {
      status: response.status,
      count: response.data?.length || 0,
    });

    // 응답 데이터 구조 자세히 로깅
    console.log('서버 응답 데이터 구조:', {
      responseData: {
        status: response.data?.status,
        message: response.data?.message,
        dataLength: response.data?.data?.length || 0,
      },
      responseDataType: typeof response.data,
      isArray: Array.isArray(response.data),
      keys: response.data ? Object.keys(response.data) : 'undefined',
    });

    // 서버 응답에서 실제 동화 배열 추출
    const storiesArray = response.data?.data;
    console.log('추출된 동화 배열:', {
      storiesArrayLength: storiesArray?.length || 0,
      storiesArrayType: typeof storiesArray,
      isArray: Array.isArray(storiesArray),
    });

    // 서버 우선 정책: 서버 데이터로 로컬을 완전히 덮어쓰기
    if (storiesArray && Array.isArray(storiesArray)) {
      try {
        console.log(`서버에서 ${storiesArray.length}개 동화 조회됨`);

        // 서버 데이터를 로컬에 저장 (기본값 설정)
        const serverStories = storiesArray.map((story: any) => ({
          ...story,
          childId,
          isBookmarked: false, // 기본값 설정
          isLiked: false, // 기본값 설정
        }));

        // 기존 로컬 데이터 완전 삭제
        await clearStoriesFromStorage(childId);
        await clearAllStorySections(childId);

        // 서버 데이터만 저장
        await saveStories(childId, serverStories);

        console.log('✅ 서버 데이터로 로컬 동기화 완료:', serverStories.length, '개');
        return serverStories;
      } catch (syncError) {
        console.error('동화 목록 데이터 저장 실패:', syncError);
        return [];
      }
    } else {
      console.log('서버에 동화 데이터가 없음 - 로컬 데이터 완전 삭제');

      // 서버에 데이터가 없으면 로컬도 완전 삭제
      await clearStoriesFromStorage(childId);
      await clearAllStorySections(childId);

      return [];
    }

    // 서버 데이터가 없거나 배열이 아닌 경우 빈 배열 반환
    return [];
  } catch (error: any) {
    console.error('사용자 동화 목록 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 서버 요청 실패 시 빈 배열 반환 (서버 우선 정책)
    console.log('서버 요청 실패 - 빈 배열 반환');
    return [];
  }
};

/**
 * 동화 목록 조회 API
 * GET /stories/lists
 *
 * @param childId 자녀 ID
 * @returns 동화 목록
 */
export const fetchStoryList = async (childId: number): Promise<StoryData[]> => {
  try {
    console.log('📚 동화 목록 조회 요청:', {
      url: `/stories/lists?id=${childId}`,
      method: 'GET',
      childId,
    });

    const response = await apiClient.get(`/stories/lists?id=${childId}`);

    console.log('✅ 동화 목록 조회 성공:', {
      status: response.status,
      count: response.data.data?.length || 0,
    });

    return response.data.data || [];
  } catch (error: any) {
    console.error('❌ 동화 목록 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    const errorMessage =
      error.response?.data?.message || error.message || '동화 목록 조회에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 삽화 목록 조회 API
 * GET /illustrations
 *
 * @returns 삽화 목록
 */
export const fetchIllustrationList = async (childId: number): Promise<Illustration[]> => {
  try {
    // childId 파라미터 검증 추가
    if (!childId || typeof childId !== 'number' || childId <= 0) {
      console.error('❌ fetchIllustrationList: 유효하지 않은 childId:', {
        childId,
        type: typeof childId,
        isNull: childId === null,
        isUndefined: childId === undefined,
      });
      throw new Error(`유효하지 않은 childId입니다: ${childId}`);
    }

    console.log('🎨 삽화 목록 조회 요청:', {
      url: `/illustrations?childId=${childId}`,
      method: 'GET',
      childId,
    });

    const response = await apiClient.get(`/illustrations?childId=${childId}`);

    console.log('✅ 삽화 목록 조회 성공:', {
      status: response.status,
      count: response.data.data?.length || 0,
    });

    return response.data.data || [];
  } catch (error: any) {
    console.error('❌ 삽화 목록 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    const errorMessage =
      error.response?.data?.message || error.message || '삽화 목록 조회에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 동화에 해당하는 삽화만 필터링하여 다운로드
 *
 * @param stories 동화 목록
 * @param illustrations 삽화 목록
 * @param onProgress 진행 상황 콜백
 */
export const downloadStoryIllustrations = async (
  stories: StoryData[],
  illustrations: Illustration[],
  onProgress?: (message: string, current?: number, total?: number) => void
): Promise<void> => {
  try {
    console.log('🎨 동화 삽화 다운로드 시작...');

    // 동화 ID 목록
    const storyIds = stories.map((story) => story.storyId);
    console.log('동화 ID 목록:', storyIds);

    // 동화에 해당하는 삽화만 필터링
    const storyIllustrations = illustrations.filter((illustration) =>
      storyIds.includes(illustration.storyId)
    );
    console.log(`동화에 해당하는 삽화 ${storyIllustrations.length}개 필터링 완료`);

    if (storyIllustrations.length === 0) {
      console.log('다운로드할 삽화가 없습니다.');
      onProgress?.('다운로드할 삽화가 없습니다.');
      return;
    }

    // 삽화 디렉토리 생성
    const illustrationsDir = `${FileSystem.documentDirectory}illustrations/`;
    const dirInfo = await FileSystem.getInfoAsync(illustrationsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(illustrationsDir, { intermediates: true });
      console.log('삽화 디렉토리 생성 완료:', illustrationsDir);
    }

    // 실제 다운로드할 삽화 개수 계산 (이미 존재하는 파일 제외)
    let downloadCount = 0;
    let existingCount = 0;

    for (const illustration of storyIllustrations) {
      const localPath = `${illustrationsDir}illustration_${illustration.illustrationId}.jpg`;
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        existingCount++;
      } else {
        downloadCount++;
      }
    }

    console.log(`삽화 상태: ${existingCount}개 이미 존재, ${downloadCount}개 다운로드 필요`);

    if (downloadCount === 0) {
      console.log('모든 삽화가 이미 다운로드되어 있습니다.');
      onProgress?.('모든 삽화가 이미 다운로드되어 있습니다.');
      return;
    }

    onProgress?.('삽화를 다운로드하는 중...', 0, downloadCount);

    // 각 삽화 다운로드
    let downloadedCount = 0;
    for (let i = 0; i < storyIllustrations.length; i++) {
      const illustration = storyIllustrations[i];
      const localPath = `${illustrationsDir}illustration_${illustration.illustrationId}.jpg`;

      try {
        // 파일이 이미 존재하는지 확인
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        if (fileInfo.exists) {
          console.log(`삽화 ${illustration.illustrationId} 이미 존재:`, localPath);
          continue;
        }

        // 삽화 다운로드
        downloadedCount++;
        onProgress?.(
          `삽화 ${downloadedCount}/${downloadCount} 다운로드 중...`,
          downloadedCount,
          downloadCount
        );

        console.log(`삽화 ${illustration.illustrationId} 다운로드 시작:`, illustration.imageUrl);
        await FileSystem.downloadAsync(illustration.imageUrl, localPath);
        console.log(`삽화 ${illustration.illustrationId} 다운로드 완료:`, localPath);
      } catch (downloadError) {
        console.error(`삽화 ${illustration.illustrationId} 다운로드 실패:`, downloadError);
        // 개별 삽화 다운로드 실패는 전체 프로세스를 중단하지 않음
      }
    }

    onProgress?.('삽화 다운로드 완료');
    console.log('🎨 동화 삽화 다운로드 완료');
  } catch (error) {
    console.error('❌ 동화 삽화 다운로드 실패:', error);
    onProgress?.('삽화 다운로드 실패');
    throw error;
  }
};

/**
 * 동화 단락 조회 API
 * storyId에 해당하는 동화 단락들을 순서대로 조회합니다.
 * 서버에서 데이터를 받아와서 로컬에 캐시로 저장합니다.
 *
 * @param storyId - 동화 ID
 * @param childId - 프로필 ID (로컬 저장용)
 * @returns Promise<StorySection[]> - 동화 단락 배열
 *
 * API 스펙:
 * - Method: GET
 * - Endpoint: /stories/{id}/sections
 * - Response: StorySection[]
 */
export const fetchStorySections = async (
  storyId: number,
  childId: number
): Promise<StorySection[]> => {
  try {
    // 파라미터 유효성 검증
    if (!storyId || typeof storyId !== 'number' || storyId <= 0) {
      throw new Error(`유효하지 않은 storyId: ${storyId} (타입: ${typeof storyId})`);
    }

    if (!childId || typeof childId !== 'number' || childId <= 0) {
      throw new Error(`유효하지 않은 childId: ${childId} (타입: ${typeof childId})`);
    }

    console.log('동화 단락 조회 요청:', {
      url: `/stories/${storyId}/sections?childId=${childId}`,
      method: 'GET',
      storyId,
      childId,
      hasValidStoryId: !!storyId && storyId > 0,
      hasValidChildId: !!childId && childId > 0,
    });

    const response = await apiClient.get<StorySectionsResponse>(
      `/stories/${storyId}/sections?childId=${childId}`
    );

    console.log('동화 단락 조회 성공:', {
      status: response.status,
      sectionCount: response.data?.data?.length || 0,
      responseStatus: response.data?.status,
      responseMessage: response.data?.message,
    });

    // 응답 데이터 구조 확인
    console.log('서버 응답 데이터 구조:', {
      responseData: {
        status: response.data?.status,
        message: response.data?.message,
        dataLength: response.data?.data?.length || 0,
      },
      responseDataType: typeof response.data,
      isArray: Array.isArray(response.data),
    });

    // 서버 응답에서 실제 단락 배열 추출
    const sectionsArray = response.data?.data;

    if (sectionsArray && Array.isArray(sectionsArray)) {
      // orderIndex로 정렬하여 순서대로 반환
      const sortedSections = sectionsArray.sort((a, b) => a.orderIndex - b.orderIndex);

      console.log('동화 단락 조회 완료:', {
        storyId,
        sectionCount: sortedSections.length,
        orderRange:
          sortedSections.length > 0
            ? `${sortedSections[0].orderIndex} ~ ${sortedSections[sortedSections.length - 1].orderIndex}`
            : '없음',
      });

      // 로컬 캐시 저장 제거 - 서버 데이터 우선 정책
      console.log(`동화 ${storyId} 단락 조회 완료 (로컬 캐시 저장 없음)`);

      return sortedSections;
    } else {
      console.log('서버 응답의 data 필드가 배열이 아니거나 빈 데이터입니다.');
      return [];
    }
  } catch (error: any) {
    console.error('동화 단락 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
      storyId,
    });

    // API 실패 시 로컬 캐시 fallback은 제거 (서버 우선 정책)
    console.log(`동화 ${storyId} API 실패 - 로컬 캐시 fallback 없음`);

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '동화 단락 조회에 실패했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 키워드 배열을 프롬프트 문자열로 변환
 * 예: ['용사', '동물', '모험'] → "용사와 동물 친구들의 모험"
 */
export const convertKeywordsToPrompt = (keywords: string[]): string => {
  if (keywords.length === 0) {
    return '';
  }

  if (keywords.length === 1) {
    return keywords[0];
  }

  if (keywords.length === 2) {
    return `${keywords[0]}와 ${keywords[1]}`;
  }

  // 3개 이상일 때는 "A, B, C의 모험" 형태로 변환
  const lastKeyword = keywords[keywords.length - 1];
  const otherKeywords = keywords.slice(0, -1);

  return `${otherKeywords.join(', ')}와 ${lastKeyword}의 모험`;
};

/**
 * 3개 삽화를 단락 수에 따라 균등하게 분배
 * 예: 14개 단락이면 1-5번 단락은 1번 그림, 6-10번 단락은 2번 그림, 11-14번 단락은 3번 그림
 *
 * @param totalSections - 총 단락 수
 * @param illustrations - 삽화 배열 (3개)
 * @returns 각 단락에 매핑된 삽화 배열
 */
export const distributeIllustrationsToSections = (
  totalSections: number,
  illustrations: Illustration[]
): Illustration[] => {
  if (illustrations.length === 0 || totalSections === 0) {
    return [];
  }

  const result: Illustration[] = [];
  const illustrationsCount = Math.min(illustrations.length, 3); // 최대 3개만 사용

  // 각 단락에 삽화 배치
  for (let i = 0; i < totalSections; i++) {
    // 단락 인덱스를 삽화 인덱스로 매핑
    let illustrationIndex: number;

    if (illustrationsCount === 1) {
      // 삽화가 1개면 모든 단락에 동일한 삽화
      illustrationIndex = 0;
    } else if (illustrationsCount === 2) {
      // 삽화가 2개면 절반씩 분배
      illustrationIndex = i < Math.ceil(totalSections / 2) ? 0 : 1;
    } else {
      // 삽화가 3개면 3등분으로 분배
      const sectionPerIllustration = Math.ceil(totalSections / 3);
      if (i < sectionPerIllustration) {
        illustrationIndex = 0;
      } else if (i < sectionPerIllustration * 2) {
        illustrationIndex = 1;
      } else {
        illustrationIndex = 2;
      }
    }

    result.push(illustrations[illustrationIndex]);
  }

  console.log(`🎨 삽화 배치 완료: ${totalSections}개 단락에 ${illustrationsCount}개 삽화 분배`);
  return result;
};

export type { TTSAudioInfo };

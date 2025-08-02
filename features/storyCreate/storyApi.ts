import { apiClient } from '@/shared/api/client';
import { CreateStoryRequest, CreateStoryResponse, StoryData } from './types';
import {
  addStoryToStorage,
  removeStoryFromStorage,
  loadStoriesFromStorage,
  clearStoriesFromStorage,
} from './storyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AI 기반 동화 생성 API
 * 키워드들을 프롬프트로 변환하여 서버에 요청
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
    const response = await apiClient.post<CreateStoryResponse>('/stories', request, {
      timeout: 60000, // 60초로 늘림 (서버의 GPT API 호출 시간 포함)
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 서버 응답 완료 (소요시간: ${duration}ms)`);
    console.log('동화 생성 성공:', {
      status: response.status,
      storyId: response.data.data?.storyId,
      title: response.data.data?.title,
      keywords: response.data.data?.keywords,
    });

    // 생성된 동화를 로컬에 저장
    try {
      const storyData = {
        ...response.data.data, // response.data.data에서 실제 동화 데이터 추출
        childId: request.childId || 0, // childId가 없으면 기본값 사용
        isBookmarked: false,
        isLiked: false,
      };
      await addStoryToStorage(storyData);
      console.log('동화 로컬 저장 완료:', storyData.storyId);
    } catch (storageError) {
      console.error('동화 로컬 저장 실패:', storageError);
      // 로컬 저장 실패는 동화 생성 실패로 처리하지 않음
    }

    return response.data.data; // 실제 동화 데이터 반환
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
 * 삽화 다운로드 API (추후 구현 예정)
 * 별도 API로 삽화 URL을 받아와서 로컬에 저장
 *
 * @param storyId - 동화 ID
 * @returns Promise<string> - 로컬 저장된 삽화 경로
 */
export const downloadStoryIllustration = async (storyId: number): Promise<string | null> => {
  try {
    console.log(`동화 ${storyId} 삽화 다운로드 시작...`);

    // TODO: 추후 별도 API로 삽화 URL 받아오기
    // const response = await apiClient.get(`/stories/${storyId}/illustration`);
    // const illustrationUrl = response.data.illustrationUrl;

    // 현재는 임시로 null 반환 (추후 구현)
    console.log(`동화 ${storyId} 삽화 다운로드 기능은 추후 구현 예정`);
    return null;
  } catch (error) {
    console.error(`동화 ${storyId} 삽화 다운로드 실패:`, error);
    return null;
  }
};

/**
 * 동화 삭제 API 응답 타입
 */
interface DeleteStoryResponse {
  status: number;
  message: string;
  data: string;
}

/**
 * 동화 삭제 API
 * 서버에서 동화를 삭제하고 로컬에서도 동시에 삭제
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
    console.log('동화 삭제 요청:', {
      url: `/stories/${storyId}`,
      method: 'DELETE',
      childId,
      storyId,
    });

    // 서버에 삭제 요청
    const response = await apiClient.delete<DeleteStoryResponse>(`/stories/${storyId}`);

    console.log('동화 삭제 성공:', {
      status: response.status,
      data: response.data,
    });

    // API 스펙에 따른 응답 검증
    if (response.status === 200 && response.data.status === 200) {
      console.log('서버 삭제 성공:', response.data.message);

      // 서버 삭제 성공 시 로컬에서도 삭제
      try {
        await removeStoryFromStorage(childId, storyId);
        console.log('동화 로컬 삭제 완료:', storyId);
      } catch (localDeleteError) {
        console.error('동화 로컬 삭제 실패:', localDeleteError);
        // 로컬 삭제 실패는 전체 삭제 실패로 처리하지 않음
        // 서버에서는 이미 삭제되었으므로 성공으로 처리
      }

      return true;
    } else {
      throw new Error(`서버 응답 오류: ${response.data.message || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('동화 삭제 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '동화 삭제에 실패했습니다.';
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

    // 서버에서 받은 동화들을 로컬에 저장/업데이트
    if (storiesArray && Array.isArray(storiesArray)) {
      try {
        // 로컬 데이터 완전 삭제
        console.log(`프로필 ${childId} 기존 로컬 동화 데이터 삭제 중...`);
        await clearStoriesFromStorage(childId);
        console.log(`프로필 ${childId} 기존 로컬 동화 데이터 삭제 완료`);

        // 서버 데이터를 로컬에 저장 (기본값 설정)
        const stories = storiesArray.map((story: any) => ({
          ...story,
          childId,
          isBookmarked: false, // 기본값 설정
          isLiked: false, // 기본값 설정
        }));

        // 서버 데이터를 로컬에 저장
        await Promise.all(stories.map((story) => addStoryToStorage(story)));

        console.log('동화 목록 서버 데이터로 덮어쓰기 완료:', stories.length, '개');
        console.log(`프로필 ${childId} 전체 동화 목록 저장 완료: ${stories.length} 개`);
        return stories;
      } catch (syncError) {
        console.error('동화 목록 서버 데이터 덮어쓰기 실패:', syncError);
      }
    } else {
      console.log(
        '서버 응답의 data 필드가 배열이 아니거나 빈 데이터입니다. 로컬 데이터를 반환합니다.'
      );
    }

    // 서버 데이터가 없거나 배열이 아닌 경우 빈 배열 반환
    return [];
  } catch (error: any) {
    console.error('사용자 동화 목록 조회 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 서버 요청 실패 시 로컬 데이터 반환
    try {
      const localStories = await loadStoriesFromStorage(childId);
      console.log('로컬 동화 목록 반환:', localStories.length, '개');
      return localStories;
    } catch (localError) {
      console.error('로컬 동화 목록 조회 실패:', localError);
      return [];
    }
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

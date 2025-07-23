import { apiClient } from '@/shared/api/client';
import { CreateStoryRequest, CreateStoryResponse } from './types';
import { downloadStoryIllustration } from './storyUtils';

/**
 * AI 기반 동화 생성 API
 * 키워드들을 프롬프트로 변환하여 서버에 요청
 */
export const createStory = async (request: CreateStoryRequest): Promise<CreateStoryResponse> => {
  try {
    console.log('동화 생성 요청:', {
      url: '/stories',
      method: 'POST',
      data: request,
    });

    const response = await apiClient.post<CreateStoryResponse>('/stories', request);

    console.log('동화 생성 성공:', {
      status: response.status,
      data: response.data,
    });

    // 삽화 URL이 있으면 다운로드
    if (response.data.data?.thumbnailUrl) {
      try {
        const localImagePath = await downloadStoryIllustration(
          response.data.data.thumbnailUrl,
          response.data.data.storyId
        );
        console.log('삽화 다운로드 완료:', localImagePath);
      } catch (downloadError) {
        console.error('삽화 다운로드 실패:', downloadError);
        // 삽화 다운로드 실패는 동화 생성 실패로 처리하지 않음
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('동화 생성 실패:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    // 에러 응답에서 상세 메시지 추출
    const errorMessage =
      error.response?.data?.message || error.message || '동화 생성에 실패했습니다.';
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

import { apiClient } from '@/shared/api/client';
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
} from './types';
import {
  addStoryToStorage,
  removeStoryFromStorage,
  loadStoriesFromStorage,
  clearStoriesFromStorage,
  saveStories,
  saveStorySections,
  loadStorySections,
  removeStorySections,
  clearAllStorySections,
} from './storyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

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

    const storyData = response.data.data;

    // 생성된 동화를 로컬에 저장
    try {
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

    // 동화 생성 성공 후 삽화 생성 시도
    try {
      console.log('🎨 삽화 생성 시작...');

      // 첫 번째 단락(sectionId: 1)에 대한 삽화 생성
      const illustrationRequest = {
        storyId: storyData.storyId,
        sectionId: 1, // 첫 번째 단락
      };

      const illustration = await createIllustration(illustrationRequest);
      console.log('삽화 생성 성공:', {
        illustrationId: illustration.illustrationId,
        imageUrl: illustration.imageUrl,
        description: illustration.description,
      });

      // 삽화 다운로드 및 로컬 저장
      try {
        const localIllustration = await downloadIllustration(illustration);
        console.log('삽화 로컬 저장 완료:', localIllustration.localPath);

        // 동화 데이터에 삽화 정보 추가
        storyData.thumbnailUrl = localIllustration.localPath;
      } catch (downloadError) {
        console.error('삽화 다운로드 실패:', downloadError);
        // 다운로드 실패는 삽화 생성 실패로 처리하지 않음
        // 원본 URL을 사용
        storyData.thumbnailUrl = illustration.imageUrl;
      }
    } catch (illustrationError) {
      console.error('삽화 생성 실패:', illustrationError);
      // 삽화 생성 실패는 동화 생성 실패로 처리하지 않음
      // 삽화 없이 동화만 반환
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
  request: CreateIllustrationRequest
): Promise<Illustration> => {
  try {
    console.log('삽화 생성 요청:', {
      url: '/illustrations',
      method: 'POST',
      data: request,
    });

    // 인증 토큰 상태 확인
    console.log('🔐 인증 토큰 상태 확인 중...');
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    console.log('✅ 인증 토큰 확인 완료');

    // 서버에 삽화 생성 요청 (서버가 내부적으로 DALL·E API 호출)
    console.log('🎨 서버에 삽화 생성 요청 전송 중...');
    console.log('   ⏱️ 최대 30초 대기 (DALL·E API 응답 시간 포함)...');

    const startTime = Date.now();
    const response = await apiClient.post<CreateIllustrationResponse>('/illustrations', request, {
      timeout: 30000, // 30초로 설정 (DALL·E API 호출 시간 포함)
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ 삽화 생성 응답 완료 (소요시간: ${duration}ms)`);
    console.log('삽화 생성 성공:', {
      status: response.status,
      illustrationId: response.data.data?.illustrationId,
      storyId: response.data.data?.storyId,
      imageUrl: response.data.data?.imageUrl,
    });

    return response.data.data; // 실제 삽화 데이터 반환
  } catch (error: any) {
    console.error('삽화 생성 실패:', {
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
      console.error('   - 서버에서 DALL·E API 호출 중 문제 발생 가능성');
      console.error('   - 서버 로그 확인 필요 (DALL·E API 키, 할당량, 응답 시간 등)');
      throw new Error(
        '서버에 연결할 수 없습니다. 서버에서 DALL·E API 호출 중 문제가 발생했을 수 있습니다.'
      );
    }

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
export const fetchIllustrations = async (): Promise<Illustration[]> => {
  try {
    console.log('삽화 목록 조회 요청:', {
      url: '/illustrations',
      method: 'GET',
    });

    const response = await apiClient.get('/illustrations');

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
  onProgress?: (message: string, current?: number, total?: number) => void
): Promise<void> => {
  try {
    console.log('누락된 삽화 동기화 시작...');
    console.log('사용자 동화 ID 목록:', userStoryIds);

    onProgress?.('삽화 목록을 확인하는 중...');

    // 서버에서 삽화 목록 조회
    const serverIllustrations = await fetchIllustrations();
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
  const response = await apiClient.post<TTSResponse>('/speech/tts', request);
  const ttsData = response.data;
  if (!ttsData.ttsUrl) throw new Error('TTS URL 없음');

  // 오디오 파일 다운로드
  const audioFileName = `tts_${request.storyId}_${request.sectionId}.mp3`;
  const audioPath = `${FileSystem.documentDirectory}tts/${audioFileName}`;
  const audioDir = `${FileSystem.documentDirectory}tts`;
  const dirInfo = await FileSystem.getInfoAsync(audioDir);
  if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

  const downloadResult = await FileSystem.downloadAsync(ttsData.ttsUrl, audioPath);
  if (downloadResult.status !== 200) throw new Error('TTS 오디오 다운로드 실패');

  return {
    storyId: request.storyId,
    sectionId: request.sectionId,
    audioPath: downloadResult.uri,
    ttsUrl: ttsData.ttsUrl,
  };
};

/**
 * 동화의 모든 단락에 대해 TTS 요청 및 오디오 다운로드
 */
export const requestAllSectionsTTS = async (
  storyId: number,
  sections: StorySection[],
  voiceId: string = 'Seoyeon',
  speechRate: number = 0.8
): Promise<TTSAudioInfo[]> => {
  const ttsPromises = sections.map((section) =>
    requestTTS({
      storyId,
      sectionId: section.sectionId,
      voiceId,
      speechRate,
    }).catch(() => null)
  );
  const results = await Promise.all(ttsPromises);
  return results.filter(Boolean) as TTSAudioInfo[];
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
export const deleteIllustration = async (illustrationId: number): Promise<boolean> => {
  try {
    console.log('삽화 삭제 요청:', {
      url: `/illustrations/${illustrationId}`,
      method: 'DELETE',
      illustrationId,
    });

    // 서버에 삭제 요청
    const response = await apiClient.delete<DeleteIllustrationResponse>(
      `/illustrations/${illustrationId}`
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

    // 서버에 삭제 요청 시도
    try {
      const response = await apiClient.delete<DeleteStoryResponse>(`/stories/${storyId}`);

      console.log('동화 삭제 성공:', {
        status: response.status,
        data: response.data,
      });

      // API 스펙에 따른 응답 검증
      if (response.status === 200 && response.data.status === 200) {
        console.log('서버 삭제 성공:', response.data.message);
      } else {
        throw new Error(`서버 응답 오류: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (serverError: any) {
      console.error('서버 삭제 실패:', {
        error: serverError.response?.data || serverError.message,
        status: serverError.response?.status,
        statusText: serverError.response?.statusText,
        url: serverError.config?.url,
        method: serverError.config?.method,
        headers: serverError.config?.headers,
      });

      // 서버 측 문제 가능성 로깅
      console.log('서버 측 문제 가능성:');
      console.log('  - 외래 키 제약 조건 위반 (삽화, 단락 등이 먼저 삭제되지 않음)');
      console.log('  - 데이터베이스 연결 문제');
      console.log('  - 서버 내부 로직 오류');
      console.log('  - 권한 문제');
      console.log('  - 서버 리소스 부족 (메모리, CPU 등)');
      console.log('  - 네트워크 타임아웃');

      // 서버 삭제 실패 시 에러 throw (로컬 삭제하지 않음)
      const errorMessage =
        serverError.response?.data?.message || serverError.message || '동화 삭제에 실패했습니다.';
      throw new Error(errorMessage);
    }

    // 서버 삭제가 성공한 경우에만 로컬에서 삭제
    try {
      await removeStoryFromStorage(childId, storyId);
      console.log('동화 로컬 삭제 완료:', storyId);

      // 동화 단락도 함께 삭제
      await removeStorySections(childId, storyId);
      console.log('동화 단락 로컬 삭제 완료:', storyId);

      // 해당 동화의 삽화 삭제 (서버 + 로컬)
      try {
        // 먼저 해당 동화의 삽화 목록을 조회
        const illustrations = await fetchIllustrations();
        const storyIllustrations = illustrations.filter((ill) => ill.storyId === storyId);

        console.log(`동화 ${storyId}에 해당하는 삽화 ${storyIllustrations.length}개 발견`);

        // 각 삽화를 서버에서 삭제
        for (const illustration of storyIllustrations) {
          try {
            await deleteIllustration(illustration.illustrationId);
            console.log(`삽화 ${illustration.illustrationId} 서버 삭제 완료`);
          } catch (serverDeleteError) {
            console.error(`삽화 ${illustration.illustrationId} 서버 삭제 실패:`, serverDeleteError);
            // 삽화 서버 삭제 실패해도 로컬 삭제는 계속 진행
          }
        }

        // 로컬 삽화 파일들도 삭제 (illustrationId 기반)
        for (const illustration of storyIllustrations) {
          const illustrationPath = `${FileSystem.documentDirectory}illustrations/illustration_${illustration.illustrationId}.jpg`;
          const fileInfo = await FileSystem.getInfoAsync(illustrationPath);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(illustrationPath);
            console.log(
              `로컬 삽화 파일 삭제 완료: ${illustration.illustrationId}`,
              illustrationPath
            );
          }
        }
      } catch (illustrationDeleteError) {
        console.error('삽화 삭제 실패:', illustrationDeleteError);
        // 삽화 삭제 실패해도 동화 삭제는 성공으로 처리
      }
    } catch (localDeleteError) {
      console.error('동화 로컬 삭제 실패:', localDeleteError);
      throw new Error('로컬 삭제에 실패했습니다.');
    }

    return true;
  } catch (error: any) {
    console.error('동화 삭제 최종 실패:', error.message);
    throw error;
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

    // 서버에서 받은 동화들을 로컬에 저장/업데이트 (서버 우선, 로컬 보존)
    if (storiesArray && Array.isArray(storiesArray)) {
      try {
        // 기존 로컬 동화 목록 가져오기
        const localStories = await loadStoriesFromStorage(childId);
        console.log(`기존 로컬 동화 ${localStories.length}개 발견`);

        // 서버 데이터를 로컬에 저장 (기본값 설정)
        const serverStories = storiesArray.map((story: any) => ({
          ...story,
          childId,
          isBookmarked: false, // 기본값 설정
          isLiked: false, // 기본값 설정
        }));

        // 서버에 없는 로컬 동화 찾기 (최근 생성된 동화들)
        const serverStoryIds = new Set(serverStories.map((story) => story.storyId));

        const localOnlyStories = localStories.filter((story) => {
          // storyId 또는 id 필드로 비교 (필드명 불일치 문제 해결)
          const localStoryId = story.storyId || (story as any).id;
          return !serverStoryIds.has(localStoryId);
        });
        console.log(
          `서버에 없는 로컬 동화 ${localOnlyStories.length}개 발견:`,
          localOnlyStories.map((s) => s.title)
        );

        // 서버 데이터 + 로컬 전용 데이터 합치기
        const allStories = [...serverStories, ...localOnlyStories];
        console.log(
          `총 ${allStories.length}개 동화 (서버: ${serverStories.length}개, 로컬전용: ${localOnlyStories.length}개)`
        );

        // 기존 데이터 삭제 후 새로운 데이터 저장
        await clearStoriesFromStorage(childId);
        await clearAllStorySections(childId);

        // 한 번에 모든 동화를 저장 (개별 저장 대신)
        await saveStories(childId, allStories);

        console.log('동화 목록 서버+로컬 데이터 저장 완료:', allStories.length, '개');
        console.log(`프로필 ${childId} 데이터 저장 완료: ${allStories.length} 개`);
        return allStories;
      } catch (syncError) {
        console.error('동화 목록 데이터 저장 실패:', syncError);
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
export const fetchIllustrationList = async (): Promise<Illustration[]> => {
  try {
    console.log('🎨 삽화 목록 조회 요청:', {
      url: '/illustrations',
      method: 'GET',
    });

    const response = await apiClient.get('/illustrations');

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
  childId?: number
): Promise<StorySection[]> => {
  try {
    console.log('동화 단락 조회 요청:', {
      url: `/stories/${storyId}/sections`,
      method: 'GET',
      storyId,
    });

    const response = await apiClient.get<StorySectionsResponse>(`/stories/${storyId}/sections`);

    console.log('동화 단락 조회 성공:', {
      status: response.status,
      sectionCount: response.data?.data?.length || 0,
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

      // 서버 데이터를 로컬에 캐시로 저장
      if (childId) {
        try {
          await saveStorySections(childId, storyId, sortedSections);
          console.log(`동화 ${storyId} 단락 로컬 캐시 저장 완료`);
        } catch (saveError) {
          console.error(`동화 ${storyId} 단락 로컬 캐시 저장 실패:`, saveError);
          // 로컬 저장 실패는 API 응답 실패로 처리하지 않음
        }
      }

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

    // API 실패 시 로컬 캐시에서 fallback 시도
    if (childId) {
      try {
        const localSections = await loadStorySections(childId, storyId);
        if (localSections && localSections.length > 0) {
          console.log(`동화 ${storyId} API 실패, 로컬 캐시 사용:`, localSections.length, '개 단락');
          return localSections;
        }
      } catch (localError) {
        console.error(`동화 ${storyId} 로컬 캐시 조회도 실패:`, localError);
      }
    }

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

export type { TTSAudioInfo };

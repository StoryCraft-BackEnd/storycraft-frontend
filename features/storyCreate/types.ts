// 동화 생성 요청 타입
export interface CreateStoryRequest {
  keywords: string[]; // 키워드 배열 (API 스펙에 맞춤)
  childId: number; // 동화를 생성할 아이의 프로필 ID
  voice?: string; // 선택된 성우 ID (선택적)
}

// 서버에서 실제 반환하는 동화 데이터 타입
export interface StoryData {
  storyId: number; // 생성된 동화의 고유 ID
  title: string; // 동화 제목
  content: string; // 동화 내용 (영어)
  contentKr: string; // 동화 내용 (한국어)
  thumbnailUrl?: string; // 동화 썸네일 이미지 URL (선택적, 나중에 제거 예정)
  keywords: string[]; // 생성에 사용된 키워드들 (API 스펙에 맞춤)
  createdAt: string; // 생성 시간 (ISO 8601 형식)
  updatedAt: string; // 수정 시간 (ISO 8601 형식)
}

// 동화 생성 응답 타입 (API 스펙에 맞춤)
export interface CreateStoryResponse {
  status: number;
  message: string;
  data: StoryData;
}

// 로컬에 저장할 삽화 정보 타입
export interface LocalIllustration {
  illustrationId: number; // 서버의 삽화 ID
  storyId: number; // 동화 ID
  orderIndex: number; // 삽화 순서 (단락 순서와 매칭)
  localPath: string; // 로컬 파일 경로
  imageUrl: string; // 원본 URL
  description: string; // 삽화 설명
  createdAt: string; // 생성 시간
}

// 로컬에 저장할 동화 데이터 타입
export interface Story {
  storyId: number; // 동화 ID
  title: string; // 동화 제목
  content: string; // 동화 내용 (영어)
  contentKr: string; // 동화 내용 (한국어)
  thumbnailUrl?: string; // 썸네일 URL (선택적, 나중에 제거 예정)
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
  childId: number; // 어떤 아이의 동화인지 (로컬 저장용)
  keywords: string[]; // 생성에 사용된 키워드들 (로컬 저장용)
  isBookmarked?: boolean; // 북마크 여부 (선택적)
  isLiked?: boolean; // 좋아요 여부 (선택적)
  illustrations?: LocalIllustration[]; // 해당 동화의 삽화 목록
}

// 동화 생성 상태 타입
export interface StoryCreationState {
  isLoading: boolean; // 생성 중인지 여부
  error: string | null; // 에러 메시지
  createdStory: Story | null; // 생성된 동화
}

// 영어 학습용 동화 데이터 타입
export interface LearningStory {
  storyId: number; // 동화 ID
  title: string; // 동화 제목
  content: string; // 동화 내용 (영어)
  contentKr: string; // 동화 내용 (한국어)
  thumbnailUrl?: string; // 썸네일 URL (선택적, 나중에 제거 예정)
  childId: number; // 아이 ID
  keywords: string[]; // 생성 키워드들
  // 영어 학습에 필요한 추가 데이터
  totalPages: number; // 총 페이지 수 (추후 구현)
  highlightedWords: HighlightedWord[]; // 강조된 단어들
}

// 강조된 단어 타입
export interface HighlightedWord {
  word: string; // 영어 단어
  korean: string; // 한국어 뜻
  pronunciation: string; // 발음 기호
}

// 저장된 단어 타입 (단어 저장 API 응답)
export interface SavedWord {
  savedId: number; // 저장된 단어의 고유 ID
  childId: number; // 자녀 프로필 ID
  word: string; // 영어 단어
  meaning: string; // 한국어 뜻
  exampleEng: string; // 영어 예문
  exampleKor: string; // 한국어 예문
  savedAt: string; // 저장 시간 (ISO 8601 형식)
}

export interface FavoriteWord {
  word: string; // 영어 단어
  meaning: string; // 한국어 뜻
  exampleEng?: string; // 영어 예문
  exampleKor?: string; // 한국어 예문
  storyId: number; // 동화 ID (즐겨찾기한 동화)
  favoritedAt: string; // 즐겨찾기 추가 시간 (ISO 8601 형식)
}

// API 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

// 동화 단락 데이터 타입
export interface StorySection {
  sectionId: number; // 단락 ID
  orderIndex: number; // 단락 순서
  paragraphText: string; // 영어 단락 텍스트
  paragraphTextKr: string; // 한국어 단락 텍스트
  storyId: number; // 동화 ID
  illustrationId?: number; // 삽화 ID (선택적)
  imageUrl?: string; // 삽화 이미지 URL (선택적)
  description?: string; // 삽화 설명 (선택적)
}

// 동화 단락 조회 응답 타입
export interface StorySectionsResponse {
  status: number;
  message: string;
  data: StorySection[];
}

// 영어 학습용 동화 데이터 타입 (단락 기반)
export interface LearningStoryWithSections {
  storyId: number; // 동화 ID
  title: string; // 동화 제목
  content: string; // 동화 내용 (영어)
  contentKr: string; // 동화 내용 (한국어)
  thumbnailUrl?: string; // 썸네일 URL (선택적, 나중에 제거 예정)
  childId: number; // 아이 ID
  keywords: string[]; // 생성 키워드들
  // 영어 학습에 필요한 추가 데이터
  totalPages: number; // 총 페이지 수 (단락 수)
  highlightedWords: HighlightedWord[]; // 강조된 단어들
  sections: StorySection[]; // 단락별 내용
  illustrations?: LocalIllustration[]; // 삽화 정보
  savedWords?: SavedWord[]; // 저장된 단어 정보
}

// 삽화 생성 요청 타입
// API 스펙: storyId만 전송하면 서버에서 모든 단락에 대해 삽화 자동 생성
export interface CreateIllustrationRequest {
  storyId: number;
  sectionId?: number; // 선택적 - storyId만으로도 삽화 생성 가능
}

// 삽화 생성 응답 타입
export interface CreateIllustrationResponse {
  status: number;
  message: string;
  data: {
    storyId: number;
    illustrations: {
      illustrationId: number;
      storyId: number;
      orderIndex: number;
      imageUrl: string;
      description: string;
      createdAt: string;
    }[];
  };
}

// 삽화 데이터 타입
export interface Illustration {
  illustrationId: number;
  storyId: number;
  orderIndex: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}

// TTS 요청 타입
export interface TTSRequest {
  childId: number;
  storyId: number;
  sectionId: number;
  voiceId: string;
  speechRate: number;
}

// TTS 응답 타입 (서버 응답 구조에 맞춤)
export interface TTSResponse {
  data: {
    ttsId: number;
    storyId: number;
    sectionId: number;
    voiceId: string;
    speechRate: number;
    language: string;
    ttsUrl: string;
    createdAt: string;
  };
  message: string;
  status: number;
}

// TTS 오디오 파일 정보 타입
export interface TTSAudioInfo {
  storyId: number;
  sectionId: number;
  audioPath: string;
  ttsUrl: string;
}

// 음성별 TTS 정보를 저장하는 타입
export interface VoiceBasedTTSInfo {
  [voiceId: string]: {
    [sectionId: number]: TTSAudioInfo;
  };
}

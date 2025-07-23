// 동화 생성 요청 타입
export interface CreateStoryRequest {
  keywords: string[]; // 키워드 배열 (API 스펙에 맞춤)
  childId: number; // 동화를 생성할 아이의 프로필 ID
}

// 서버에서 실제 반환하는 동화 데이터 타입
export interface StoryData {
  storyId: number; // 생성된 동화의 고유 ID
  title: string; // 동화 제목
  content: string; // 동화 내용
  thumbnailUrl: string | null; // 동화 썸네일 이미지 URL (null일 수 있음)
  keywords: string[]; // 생성에 사용된 키워드들 (API 스펙에 맞춤)
  createdAt: string; // 생성 시간 (ISO 8601 형식)
  updatedAt: string; // 수정 시간 (ISO 8601 형식)
}

// 동화 생성 응답 타입 (서버 응답 구조)
export interface CreateStoryResponse {
  status: number;
  message: string;
  data: StoryData;
}

// 로컬에 저장할 동화 데이터 타입
export interface Story {
  storyId: number; // 동화 ID
  title: string; // 동화 제목
  content: string; // 동화 내용
  thumbnailUrl: string; // 썸네일 URL
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
  childId: number; // 어떤 아이의 동화인지 (로컬 저장용)
  keywords: string[]; // 생성에 사용된 키워드들 (로컬 저장용)
  isBookmarked?: boolean; // 북마크 여부 (선택적)
  isLiked?: boolean; // 좋아요 여부 (선택적)
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
  content: string; // 동화 내용
  thumbnailUrl: string | null; // 썸네일 URL (null일 수 있음)
  childId: number; // 아이 ID
  keywords: string[]; // 생성 키워드들
  // 영어 학습에 필요한 추가 데이터
  totalPages: number; // 총 페이지 수 (추후 구현)
  highlightedWords: HighlightedWord[]; // 강조된 단어들
  koreanTranslation?: string; // 한국어 번역 (추후 구현)
}

// 강조된 단어 타입
export interface HighlightedWord {
  word: string; // 영어 단어
  korean: string; // 한국어 뜻
  pronunciation: string; // 발음 기호
}

// API 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

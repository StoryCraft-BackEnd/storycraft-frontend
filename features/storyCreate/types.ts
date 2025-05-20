// 동화 생성 요청 타입
export interface CreateStoryRequest {
  prompt: string;
  childId: string;
}

// 동화 응답 타입
export interface Story {
  storyId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

// 동화 생성 응답 타입
export type CreateStoryResponse = ApiResponse<Story>;

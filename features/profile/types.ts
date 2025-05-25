// 학습 레벨 타입
export type LearningLevel = '초급' | '중급' | '고급';

// 자녀 프로필 타입
export interface ChildProfile {
  child_id: number;
  name: string;
  age: number;
  learning_level: LearningLevel;
  created_at?: string;
}

// API 응답 타입
export interface ProfileResponse {
  status: number;
  message: string;
  data: ChildProfile[];
}

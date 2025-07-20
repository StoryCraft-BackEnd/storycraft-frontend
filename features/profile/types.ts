// 학습 레벨 타입 (초급, 중급, 고급 중 하나)
export type LearningLevel = '초급' | '중급' | '고급';

// 자녀 프로필 타입
export interface ChildProfile {
  // 프로필 고유 ID (서버에서 사용하는 camelCase 형태)
  childId: number; // 프로필 고유 번호

  // 프로필 기본 정보
  name: string; // 자녀 이름
  age: number; // 자녀 나이

  // 학습 레벨 (서버에서 사용하는 camelCase 형태)
  learningLevel: LearningLevel; // 학습 레벨 (초급, 중급, 고급)

  // 생성 시간 (선택사항)
  createdAt?: string; // 프로필 생성 날짜/시간
}

// API 응답 타입 (서버에서 받는 응답의 기본 구조)
export interface ProfileResponse {
  status: number; // HTTP 상태 코드 (200: 성공, 400: 오류 등)
  message: string; // 서버에서 보내는 메시지
  data: ChildProfile[]; // 실제 프로필 데이터 배열
}

// 프로필 생성 응답 타입 (새 프로필 만들기 성공 시)
export interface CreateProfileResponse {
  status: number; // HTTP 상태 코드
  message: string; // 성공 메시지
  data: {
    childId: number; // 새로 생성된 프로필의 ID
  };
}

// 프로필 삭제 응답 타입 (프로필 삭제 성공 시)
export interface DeleteProfileResponse {
  status: number; // HTTP 상태 코드
  message: string; // 성공 메시지
  data: {
    childId: number; // 삭제된 프로필의 ID
  };
}

// 프로필 수정 응답 타입 (프로필 수정 성공 시)
export interface UpdateProfileResponse {
  status: number; // HTTP 상태 코드
  message: string; // 성공 메시지
  data: {
    childId: number; // 수정된 프로필의 ID
  };
}

/**
 * Children API
 *
 * 아이들 프로필 생성, 조회, 수정, 삭제와 관련된 API 요청 함수들
 *
 * @author StoryCraft Team
 * @version 1.0.0
 */

import { apiClient } from './client';

// 타입 정의
export interface CreateChildRequest {
  name: string;
  age: number;
  learningLevel: '초급' | '중급' | '고급';
}

export interface CreateChildResponse {
  status: number;
  message: string;
  data: {
    childId: number; // integer($int64)
  };
}

export interface Child {
  childId: number; // integer($int64)
  name: string;
  age: number;
  learningLevel: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 아이 프로필 생성
 *
 * @param childData 아이 정보 (이름, 나이, 학습 레벨)
 * @returns Promise<CreateChildResponse> 생성된 아이의 ID를 포함한 응답
 *
 * @example
 * const newChild = await createChild({
 *   name: "김철수",
 *   age: 7,
 *   learningLevel: "초급"
 * });
 * console.log("생성된 아이 ID:", newChild.data.childId);
 */
export const createChild = async (childData: CreateChildRequest): Promise<CreateChildResponse> => {
  try {
    console.log('🚀 프로필 생성 요청:', childData);

    const response = await apiClient.post<CreateChildResponse>('/children', childData);

    console.log('✅ 프로필 생성 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 프로필 생성 실패:', error);

    // 에러 응답 구조화
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드
      throw new Error(
        `서버 오류 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
      );
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청 설정 중 오류
      throw new Error(`요청 설정 오류: ${error.message}`);
    }
  }
};

/**
 * 아이 프로필 목록 조회
 *
 * @returns Promise<Child[]> 아이 프로필 목록
 */
export const getChildren = async (): Promise<Child[]> => {
  try {
    console.log('🔍 프로필 목록 조회 요청');

    const response = await apiClient.get<{ data: Child[] }>('/children');

    console.log('✅ 프로필 목록 조회 성공:', response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ 프로필 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 아이 프로필 조회
 *
 * @param childId 아이 ID (integer($int64))
 * @returns Promise<Child> 아이 프로필 정보
 */
export const getChild = async (childId: number): Promise<Child> => {
  try {
    console.log('🔍 프로필 조회 요청:', childId);

    const response = await apiClient.get<{ data: Child }>(`/children/${childId}`);

    console.log('✅ 프로필 조회 성공:', response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ 프로필 조회 실패:', error);
    throw error;
  }
};

/**
 * 아이 프로필 수정
 *
 * @param childId 아이 ID (integer($int64))
 * @param updateData 수정할 데이터
 * @returns Promise<Child> 수정된 아이 프로필
 */
export const updateChild = async (
  childId: number,
  updateData: Partial<CreateChildRequest>
): Promise<Child> => {
  try {
    console.log('📝 프로필 수정 요청:', { childId, updateData });

    const response = await apiClient.put<{ data: Child }>(`/children/${childId}`, updateData);

    console.log('✅ 프로필 수정 성공:', response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ 프로필 수정 실패:', error);
    throw error;
  }
};

/**
 * 아이 프로필 삭제
 *
 * @param childId 아이 ID (integer($int64))
 * @returns Promise<boolean> 삭제 성공 여부
 */
export const deleteChild = async (childId: number): Promise<boolean> => {
  try {
    console.log('🗑️ 프로필 삭제 요청:', childId);

    await apiClient.delete(`/children/${childId}`);

    console.log('✅ 프로필 삭제 성공');
    return true;
  } catch (error: any) {
    console.error('❌ 프로필 삭제 실패:', error);
    throw error;
  }
};

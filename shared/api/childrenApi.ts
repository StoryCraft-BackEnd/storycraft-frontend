/**
 * Children Profile API
 *
 * 아이들의 프로필 관리와 관련된 모든 API 요청을 담당하는 모듈입니다.
 * 프로필 생성, 조회, 수정, 삭제(CRUD) 기능을 제공합니다.
 * 모든 API 요청에는 인증 토큰이 필요합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 외부 라이브러리 import 섹션 =====
// HTTP 요청을 처리하기 위한 Axios 기반 API 클라이언트를 가져옵니다
import { apiClient } from './client';

// ===== 타입 정의 섹션 =====

/**
 * 아이 프로필 생성 요청 데이터 타입 정의
 *
 * 새로운 아이 프로필을 생성할 때 서버로 전송하는 데이터의 구조입니다.
 * 모든 필드가 필수이며, 서버의 유효성 검증을 거쳐야 합니다.
 */
export interface CreateChildRequest {
  name: string; // 아이의 이름 (최소 1자 이상, 특수문자 제한)
  age: number; // 아이의 나이 (1~100 사이의 정수)
  learningLevel: '초급' | '중급' | '고급'; // 학습 레벨 (enum 형태로 제한됨)
}

/**
 * 아이 프로필 생성 응답 데이터 타입 정의
 *
 * 서버에서 아이 프로필 생성 요청을 처리한 후 반환하는 응답의 구조입니다.
 * 성공 시 생성된 프로필의 고유 ID를 포함합니다.
 */
export interface CreateChildResponse {
  status: number; // HTTP 상태 코드 (200: 성공, 400: 잘못된 요청, 401: 인증 필요)
  message: string; // 서버에서 제공하는 응답 메시지 (성공/실패 안내)
  data: {
    // 프로필 생성 성공 시 반환되는 데이터
    childId: number; // 새로 생성된 아이 프로필의 고유 ID (integer($int64))
  };
}

/**
 * 아이 프로필 데이터 타입 정의
 *
 * 데이터베이스에 저장된 완전한 아이 프로필 정보의 구조입니다.
 * 조회, 수정, 삭제 작업에서 사용됩니다.
 */
export interface Child {
  childId: number; // 아이 프로필의 고유 식별자 (integer($int64))
  name: string; // 아이의 이름
  age: number; // 아이의 나이
  learningLevel: string; // 아이의 학습 레벨 (초급/중급/고급)
  createdAt?: string; // 프로필 생성 일시 (ISO 8601 형식, 선택적)
  updatedAt?: string; // 프로필 마지막 수정 일시 (ISO 8601 형식, 선택적)
}

// ===== API 함수 정의 섹션 =====

/**
 * 아이 프로필 생성 API 함수
 *
 * 새로운 아이의 프로필을 생성하기 위해 서버로 POST 요청을 보냅니다.
 * 요청 헤더에 자동으로 Authorization Bearer 토큰이 포함됩니다.
 *
 * @param childData - 생성할 아이 프로필의 기본 정보 (이름, 나이, 학습레벨)
 * @returns Promise<CreateChildResponse> - 생성 결과와 새 프로필 ID를 담은 Promise
 * @throws Error - 인증 실패, 네트워크 오류, 서버 오류, 또는 데이터 검증 실패 시 발생
 *
 * @example
 * ```typescript
 * const newProfile = await createChild({
 *   name: "김민수",
 *   age: 7,
 *   learningLevel: "초급"
 * });
 * console.log("생성된 프로필 ID:", newProfile.data.childId);
 * ```
 */
export const createChild = async (childData: CreateChildRequest): Promise<CreateChildResponse> => {
  try {
    // 요청할 완전한 URL을 생성합니다 (기본 URL + 프로필 생성 엔드포인트)
    const url = `${apiClient.defaults.baseURL}/children`;

    // 디버깅 및 모니터링을 위해 요청 정보를 콘솔에 상세히 로깅합니다
    console.log('🚀 프로필 생성 요청:', {
      url, // 요청 대상 서버 URL
      method: 'POST', // HTTP 메서드 (데이터 생성용)
      data: childData, // 전송할 아이 프로필 데이터 (모든 필드 포함)
    });

    // 실제 HTTP POST 요청을 서버로 전송합니다
    // apiClient에서 자동으로 Authorization 헤더가 추가됩니다
    const response = await apiClient.post<CreateChildResponse>('/children', childData);

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 프로필 생성 성공:', response.data);

    // 서버 응답에서 실제 데이터 부분만 추출하여 반환합니다
    return response.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 프로필 생성 실패:', error);

    // 에러 타입별로 적절한 사용자 친화적 메시지를 생성합니다
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드인 경우
      // HTTP 상태 코드별로 다른 처리가 가능합니다 (401: 인증 실패, 400: 잘못된 데이터 등)
      throw new Error(
        `서버 오류 (${error.response.status}): ${error.response.data?.message || '알 수 없는 오류'}`
      );
    } else if (error.request) {
      // 요청은 보냈지만 서버로부터 응답을 받지 못한 경우 (네트워크 문제)
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청 설정 과정에서 발생한 오류 (클라이언트 측 문제)
      throw new Error(`요청 설정 오류: ${error.message}`);
    }
  }
};

/**
 * 아이 프로필 목록 조회 API 함수
 *
 * 현재 로그인한 사용자의 모든 아이 프로필 목록을 서버에서 가져옵니다.
 * 인증 토큰을 기반으로 해당 사용자의 프로필만 반환됩니다.
 *
 * @returns Promise<Child[]> - 아이 프로필들의 배열을 담은 Promise
 * @throws Error - 인증 실패, 네트워크 오류, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const profiles = await getChildren();
 * console.log(`총 ${profiles.length}개의 프로필이 있습니다.`);
 * profiles.forEach(child => {
 *   console.log(`${child.name} (${child.age}세, ${child.learningLevel})`);
 * });
 * ```
 */
export const getChildren = async (): Promise<Child[]> => {
  try {
    // 프로필 목록 조회를 위한 완전한 URL을 생성합니다
    const url = `${apiClient.defaults.baseURL}/children`;

    // 요청 정보를 콘솔에 로깅합니다 (GET 요청이므로 body 없음)
    console.log('🔍 프로필 목록 조회 요청:', {
      url, // 요청 대상 URL
      method: 'GET', // HTTP 메서드 (데이터 조회용)
    });

    // 전체 URL을 별도로 로깅
    console.log('🌐 프로필 목록 조회 전체 URL:', url);

    // 서버로 GET 요청을 전송하여 프로필 목록을 가져옵니다
    // 응답 타입을 { data: Child[] }로 지정하여 타입 안전성을 보장합니다
    const response = await apiClient.get<{ data: Child[] }>('/children');

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 프로필 목록 조회 성공:', response.data.data);

    // 서버 응답의 data 필드에서 실제 프로필 배열을 추출하여 반환합니다
    return response.data.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 프로필 목록 조회 실패:', error);

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 특정 아이 프로필 조회 API 함수
 *
 * 주어진 ID에 해당하는 특정 아이의 프로필 정보를 서버에서 가져옵니다.
 * 해당 프로필이 현재 사용자의 소유인지 서버에서 확인됩니다.
 *
 * @param childId - 조회할 아이 프로필의 고유 ID (integer($int64))
 * @returns Promise<Child> - 해당 아이의 완전한 프로필 정보를 담은 Promise
 * @throws Error - 인증 실패, 프로필 없음, 권한 없음, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const profile = await getChild(123);
 * console.log(`조회된 프로필: ${profile.name} (ID: ${profile.childId})`);
 * console.log(`나이: ${profile.age}세, 레벨: ${profile.learningLevel}`);
 * ```
 */
export const getChild = async (childId: number): Promise<Child> => {
  try {
    // 특정 프로필 조회를 위한 완전한 URL을 생성합니다 (ID 포함)
    const url = `${apiClient.defaults.baseURL}/children/${childId}`;

    // 요청 정보를 콘솔에 로깅합니다 (조회할 프로필 ID 포함)
    console.log('🔍 프로필 조회 요청:', {
      url, // 요청 대상 URL (프로필 ID 포함)
      method: 'GET', // HTTP 메서드
      childId, // 조회 대상 프로필 ID
    });

    // 서버로 특정 프로필 조회 요청을 전송합니다
    // URL 경로에 프로필 ID를 포함하여 RESTful API 규칙을 따릅니다
    const response = await apiClient.get<{ data: Child }>(`/children/${childId}`);

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 프로필 조회 성공:', response.data.data);

    // 서버 응답의 data 필드에서 실제 프로필 객체를 추출하여 반환합니다
    return response.data.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 프로필 조회 실패:', error);

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 아이 프로필 수정 API 함수
 *
 * 기존 아이 프로필의 정보를 수정하기 위해 서버로 PUT 요청을 보냅니다.
 * 부분 수정이 가능하며, 제공된 필드만 업데이트됩니다.
 *
 * @param childId - 수정할 아이 프로필의 고유 ID (integer($int64))
 * @param updateData - 수정할 필드들의 정보 (모든 필드 선택적)
 * @returns Promise<Child> - 수정된 완전한 프로필 정보를 담은 Promise
 * @throws Error - 인증 실패, 프로필 없음, 권한 없음, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * // 이름과 나이만 수정하는 경우
 * const updated = await updateChild(123, {
 *   name: "김민수 (수정됨)",
 *   age: 8
 * });
 * console.log("수정 완료:", updated.name);
 *
 * // 학습 레벨만 수정하는 경우
 * const levelUpdated = await updateChild(123, {
 *   learningLevel: "중급"
 * });
 * ```
 */
export const updateChild = async (
  childId: number,
  updateData: Partial<CreateChildRequest>
): Promise<Child> => {
  try {
    // 프로필 수정을 위한 완전한 URL을 생성합니다 (수정 대상 ID 포함)
    const url = `${apiClient.defaults.baseURL}/children/${childId}`;

    // 요청 정보를 콘솔에 상세히 로깅합니다
    console.log('📝 프로필 수정 요청:', {
      url, // 요청 대상 URL
      method: 'PUT', // HTTP 메서드 (전체 리소스 수정용)
      childId, // 수정 대상 프로필 ID
      data: updateData, // 수정할 필드들의 데이터
    });

    // 서버로 PUT 요청을 전송하여 프로필을 수정합니다
    // RESTful API 규칙에 따라 PUT 메서드와 ID를 URL 경로에 포함합니다
    const response = await apiClient.put<{ data: Child }>(`/children/${childId}`, updateData);

    // 성공적인 응답을 받았을 때 결과를 콘솔에 로깅합니다
    console.log('✅ 프로필 수정 성공:', response.data.data);

    // 서버 응답에서 수정된 완전한 프로필 정보를 추출하여 반환합니다
    return response.data.data;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 프로필 수정 실패:', error);

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 아이 프로필 삭제 API 함수
 *
 * 지정된 ID의 아이 프로필을 완전히 삭제하기 위해 서버로 DELETE 요청을 보냅니다.
 * 삭제된 데이터는 복구할 수 없으므로 신중하게 사용해야 합니다.
 *
 * @param childId - 삭제할 아이 프로필의 고유 ID (integer($int64))
 * @returns Promise<boolean> - 삭제 성공 여부를 나타내는 Promise
 * @throws Error - 인증 실패, 프로필 없음, 권한 없음, 또는 서버 오류 시 발생
 *
 * @example
 * ```typescript
 * const confirmDelete = confirm("정말로 이 프로필을 삭제하시겠습니까?");
 * if (confirmDelete) {
 *   const success = await deleteChild(123);
 *   if (success) {
 *     console.log("프로필이 성공적으로 삭제되었습니다.");
 *     // UI에서 해당 프로필을 제거하는 로직 추가
 *   }
 * }
 * ```
 */
export const deleteChild = async (childId: number): Promise<boolean> => {
  try {
    // 프로필 삭제를 위한 완전한 URL을 생성합니다 (삭제 대상 ID 포함)
    const url = `${apiClient.defaults.baseURL}/children/${childId}`;

    // 요청 정보를 콘솔에 로깅합니다
    console.log('🗑️ 프로필 삭제 요청:', {
      url, // 요청 대상 URL
      method: 'DELETE', // HTTP 메서드 (리소스 삭제용)
      childId, // 삭제 대상 프로필 ID
    });

    // 서버로 DELETE 요청을 전송하여 프로필을 삭제합니다
    // RESTful API 규칙에 따라 DELETE 메서드와 ID를 URL 경로에 포함합니다
    await apiClient.delete(`/children/${childId}`);

    // 삭제 성공을 콘솔에 기록합니다
    console.log('✅ 프로필 삭제 성공');

    // 삭제 성공을 나타내는 true 값을 반환합니다
    return true;
  } catch (error: any) {
    // 에러 발생 시 상세 정보를 콘솔에 기록합니다
    console.error('❌ 프로필 삭제 실패:', error);

    // 에러를 다시 던져서 호출자가 적절히 처리할 수 있도록 합니다
    throw error;
  }
};

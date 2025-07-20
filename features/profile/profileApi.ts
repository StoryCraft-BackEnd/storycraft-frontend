import {
  ProfileResponse,
  ChildProfile,
  CreateProfileResponse,
  DeleteProfileResponse,
  UpdateProfileResponse,
} from './types';
import { apiClient } from '@/shared/api/client';

/**
 * 자녀 프로필 목록을 조회합니다.
 * GET /children 엔드포인트를 사용하여 현재 로그인한 사용자의 자녀 프로필 목록을 가져옵니다.
 *
 * @returns {Promise<ProfileResponse>} 프로필 목록 응답
 * @throws {Error} 토큰이 없거나 서버 오류 시
 *
 * @example
 * ```typescript
 * try {
 *   const response = await getProfiles();
 *   console.log('프로필 목록:', response.data);
 * } catch (error) {
 *   console.error('프로필 조회 실패:', error.message);
 * }
 * ```
 */
export const getProfiles = async (): Promise<ProfileResponse> => {
  try {
    console.log('🏷️ 자녀 프로필 목록 조회 시작...');
    console.log(`   🌐 요청 URL: /children`);
    console.log(`   🔧 Method: GET`);

    // apiClient를 사용하여 자동으로 토큰이 헤더에 추가됨
    const response = await apiClient.get('/children');

    console.log(`   📊 응답 상태: ${response.status} ${response.statusText}`);

    const data: ProfileResponse = response.data;

    console.log('✅ 자녀 프로필 목록 조회 성공:');
    console.log(`   📊 응답 코드: ${response.status}`);
    console.log(`   📋 프로필 개수: ${data.data?.length || 0}개`);
    if (data.data && data.data.length > 0) {
      data.data.forEach((profile, index) => {
        console.log(`   👤 프로필 ${index + 1}:`, {
          childId: profile.childId,
          name: profile.name,
          age: profile.age,
          learningLevel: profile.learningLevel,
          allKeys: Object.keys(profile),
          fullProfile: profile,
        });
      });
    } else {
      console.log('   ℹ️ 등록된 프로필이 없습니다.');
    }

    return data;
  } catch (error: any) {
    console.error('❌ 자녀 프로필 목록 조회 실패:', error);

    if (error.response?.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    } else if (error.response?.data) {
      throw new Error(`프로필 조회 실패 (${error.response.status}): ${error.response.data}`);
    } else {
      throw new Error('프로필 조회 중 예상치 못한 오류가 발생했습니다.');
    }
  }
};

/**
 * 새로운 자녀 프로필을 생성합니다.
 * POST /children 엔드포인트를 사용하여 새로운 자녀 프로필을 생성합니다.
 *
 * @param {Omit<ChildProfile, 'child_id'>} profileData 생성할 프로필 데이터
 * @returns {Promise<{ status: number; message: string; data: { childId: number } }>} 생성된 프로필 응답
 * @throws {Error} 토큰이 없거나 서버 오류 시
 *
 * @example
 * ```typescript
 * try {
 *   const result = await createProfile({
 *     name: "아이",
 *     age: 7,
 *     learning_level: "초급"
 *   });
 *   console.log('생성된 프로필 ID:', result.data.childId);
 * } catch (error) {
 *   console.error('프로필 생성 실패:', error.message);
 * }
 * ```
 */
export const createProfile = async (
  profileData: Omit<ChildProfile, 'childId'>
): Promise<CreateProfileResponse> => {
  try {
    console.log('👶 자녀 프로필 생성 시작...');
    console.log(`   🌐 요청 URL: /children`);
    console.log(`   🔧 Method: POST`);
    console.log(`   📋 프로필 데이터:`, profileData);

    // apiClient를 사용하여 자동으로 토큰이 헤더에 추가됨
    const response = await apiClient.post('/children', {
      name: profileData.name, // 이름
      age: profileData.age, // 나이
      learningLevel: profileData.learningLevel, // 학습레벨
    });

    console.log(`   📊 응답 상태: ${response.status} ${response.statusText}`);

    const data = response.data;
    console.log('✅ 자녀 프로필 생성 성공:');
    console.log(`   📊 응답 코드: ${response.status}`);
    console.log(`   📋 응답 데이터:`, data);
    return data;
  } catch (error: any) {
    console.error('❌ 자녀 프로필 생성 실패:', error);
    if (error.response?.data) {
      throw new Error(`프로필 생성 실패 (${error.response.status}): ${error.response.data}`);
    }
    throw error;
  }
};

/**
 * 자녀 프로필을 수정합니다.
 * @param {number} childId 수정할 프로필 ID
 * @param {Partial<ChildProfile>} profileData 수정할 프로필 데이터
 * @returns {Promise<UpdateProfileResponse>} 수정된 프로필 응답
 */
export const updateProfile = async (
  childId: number,
  profileData: Partial<ChildProfile>
): Promise<UpdateProfileResponse> => {
  try {
    console.log('✏️ 자녀 프로필 수정 시작...');
    console.log(`   🌐 요청 URL: /children/${childId}`);
    console.log(`   🔧 Method: PUT`);
    console.log(`   📋 수정 데이터:`, profileData);

    // 서버 요청 형식에 맞게 데이터 변환
    const requestData = {
      name: profileData.name, // 이름
      age: profileData.age, // 나이
      learningLevel: profileData.learningLevel, // 학습레벨
    };

    // apiClient를 사용하여 자동으로 토큰이 헤더에 추가됨
    const response = await apiClient.put(`/children/${childId}`, requestData);

    console.log(`   📊 응답 상태: ${response.status} ${response.statusText}`);

    const data = response.data;
    console.log('✅ 자녀 프로필 수정 성공:');
    console.log(`   📊 응답 코드: ${response.status}`);
    console.log(`   📋 응답 데이터:`, data);
    return data;
  } catch (error: any) {
    console.error('❌ 자녀 프로필 수정 실패:', error);
    if (error.response?.data) {
      throw new Error(`프로필 수정 실패 (${error.response.status}): ${error.response.data}`);
    }
    throw error;
  }
};

/**
 * 자녀 프로필을 삭제합니다.
 * @param {number} childId 삭제할 프로필 ID
 * @returns {Promise<DeleteProfileResponse>} 삭제된 프로필 응답
 */
export const deleteProfile = async (childId: number): Promise<DeleteProfileResponse> => {
  try {
    console.log('🗑️ 자녀 프로필 삭제 시작...');
    console.log(`   🌐 요청 URL: /children/${childId}`);
    console.log(`   🔧 Method: DELETE`);

    // apiClient를 사용하여 자동으로 토큰이 헤더에 추가됨
    const response = await apiClient.delete(`/children/${childId}`);

    console.log(`   📊 응답 상태: ${response.status} ${response.statusText}`);

    const data = response.data;
    console.log('✅ 자녀 프로필 삭제 성공:');
    console.log(`   📊 응답 코드: ${response.status}`);
    console.log(`   📋 응답 데이터:`, data);
    return data;
  } catch (error: any) {
    console.error('❌ 자녀 프로필 삭제 실패:', error);
    if (error.response?.data) {
      throw new Error(`프로필 삭제 실패 (${error.response.status}): ${error.response.data}`);
    }
    throw error;
  }
};

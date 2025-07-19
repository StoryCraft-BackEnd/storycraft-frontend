/**
 * API 테스트 함수들
 *
 * 개발 중 API 서버와의 연결 및 기능을 테스트하기 위한 함수들
 *
 * @author StoryCraft Team
 * @version 1.0.0
 */

import { createChild, getChildren, getChild, updateChild, deleteChild } from './childrenApi';
import { checkServerConnection } from './client';

/**
 * 서버 연결 테스트
 */
export const testServerConnection = async (): Promise<void> => {
  console.log('🔗 서버 연결 테스트 시작...');

  try {
    const isConnected = await checkServerConnection();

    if (isConnected) {
      console.log('✅ 서버 연결 성공!');
    } else {
      console.log('❌ 서버 연결 실패');
    }
  } catch (error) {
    console.error('❌ 서버 연결 테스트 중 오류:', error);
  }
};

/**
 * 프로필 생성 테스트
 */
export const testCreateChild = async () => {
  console.log('\n📝 프로필 생성 테스트 시작...');

  try {
    const testData = {
      name: '테스트 아이',
      age: 7,
      learningLevel: '초급' as const,
    };

    const result = await createChild(testData);
    console.log('✅ 프로필 생성 테스트 성공:', result);

    return result;
  } catch (error) {
    console.error('❌ 프로필 생성 테스트 실패:', error);
    throw error;
  }
};

/**
 * 프로필 목록 조회 테스트
 */
export const testGetChildren = async () => {
  console.log('\n📋 프로필 목록 조회 테스트 시작...');

  try {
    const children = await getChildren();
    console.log('✅ 프로필 목록 조회 테스트 성공:', children);

    return children;
  } catch (error) {
    console.error('❌ 프로필 목록 조회 테스트 실패:', error);
    throw error;
  }
};

/**
 * 특정 프로필 조회 테스트
 */
export const testGetChild = async (childId: number) => {
  // childId: integer($int64)
  console.log(`\n🔍 프로필 조회 테스트 시작 (ID: ${childId})...`);

  try {
    const child = await getChild(childId);
    console.log('✅ 프로필 조회 테스트 성공:', child);

    return child;
  } catch (error) {
    console.error('❌ 프로필 조회 테스트 실패:', error);
    throw error;
  }
};

/**
 * 프로필 수정 테스트
 */
export const testUpdateChild = async (childId: number) => {
  // childId: integer($int64)
  console.log(`\n📝 프로필 수정 테스트 시작 (ID: ${childId})...`);

  try {
    const updateData = {
      name: '수정된 이름',
      age: 8,
      learningLevel: '중급' as const,
    };

    const updatedChild = await updateChild(childId, updateData);
    console.log('✅ 프로필 수정 테스트 성공:', updatedChild);

    return updatedChild;
  } catch (error) {
    console.error('❌ 프로필 수정 테스트 실패:', error);
    throw error;
  }
};

/**
 * 프로필 삭제 테스트
 */
export const testDeleteChild = async (childId: number) => {
  // childId: integer($int64)
  console.log(`\n🗑️ 프로필 삭제 테스트 시작 (ID: ${childId})...`);

  try {
    const result = await deleteChild(childId);
    console.log('✅ 프로필 삭제 테스트 성공:', result);

    return result;
  } catch (error) {
    console.error('❌ 프로필 삭제 테스트 실패:', error);
    throw error;
  }
};

/**
 * 전체 API 테스트 실행
 *
 * 모든 API 엔드포인트를 순차적으로 테스트합니다.
 */
export const runAllApiTests = async (): Promise<void> => {
  console.log('🚀 전체 API 테스트 시작...\n');

  try {
    // 1. 서버 연결 테스트
    await testServerConnection();

    // 2. 프로필 생성 테스트
    const createResult = await testCreateChild();
    const childId = createResult.data.childId;

    // 3. 프로필 목록 조회 테스트
    await testGetChildren();

    // 4. 특정 프로필 조회 테스트
    await testGetChild(childId);

    // 5. 프로필 수정 테스트
    await testUpdateChild(childId);

    // 6. 프로필 삭제 테스트
    await testDeleteChild(childId);

    console.log('\n🎉 모든 API 테스트가 성공적으로 완료되었습니다!');
  } catch (error) {
    console.error('\n💥 API 테스트 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 간단한 프로필 생성 테스트 (빠른 테스트용)
 */
export const quickCreateTest = async () => {
  console.log('⚡ 빠른 프로필 생성 테스트...');

  const testData = {
    name: '김민수',
    age: 6,
    learningLevel: '초급' as const,
  };

  try {
    const result = await createChild(testData);
    console.log('✅ 빠른 테스트 성공! 생성된 아이 ID:', result.data.childId);
    return result;
  } catch (error) {
    console.error('❌ 빠른 테스트 실패:', error);
    throw error;
  }
};

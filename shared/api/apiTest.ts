/**
 * API 테스트 함수 모음
 *
 * 개발 및 디버깅 목적으로 사용되는 API 테스트 함수들을 모아둔 모듈입니다.
 * 각 API 엔드포인트의 정상 동작을 확인하고, 실제 데이터로 테스트할 수 있습니다.
 *
 * 주요 기능:
 * - 서버 연결 상태 테스트
 * - 프로필 CRUD 작업 테스트 (생성, 조회, 수정, 삭제)
 * - 통합 테스트 시나리오 실행
 * - 빠른 테스트 데이터 생성
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 내부 모듈 import 섹션 =====
// API 클라이언트와 관련 함수들을 가져옵니다
import { checkServerConnection } from './client';
// 프로필 관련 API 함수들과 타입 정의를 가져옵니다
import {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  CreateChildRequest,
} from './childrenApi';

// ===== 서버 연결 테스트 함수 =====

/**
 * 서버 연결 상태 테스트 함수
 *
 * API 서버와의 기본적인 연결 상태를 확인하는 테스트 함수입니다.
 * 앱 시작 시 또는 네트워크 문제 진단 시 사용됩니다.
 *
 * @async
 * @function testServerConnection
 * @returns {Promise<boolean>} 서버 연결 테스트 결과 (true: 성공, false: 실패)
 * @throws {Error} 예상치 못한 오류 발생 시
 *
 * @example
 * ```typescript
 * const isServerOk = await testServerConnection();
 * if (isServerOk) {
 *   console.log('서버가 정상 작동 중입니다');
 * } else {
 *   console.log('서버에 문제가 있습니다');
 * }
 * ```
 */
export const testServerConnection = async (): Promise<boolean> => {
  // 테스트 시작을 알리는 로그 출력 (이모지와 함께 명확한 구분)
  console.log('\n🔗 서버 연결 테스트 시작...');

  try {
    // client.ts에 정의된 서버 연결 확인 함수를 호출합니다
    const isConnected = await checkServerConnection();

    // 연결 테스트 결과 확인 (상세 메시지는 runTest에서 출력)
    // 중복 로그 방지를 위해 여기서는 결과만 확인하고 메시지는 출력하지 않음

    // 테스트 결과를 반환합니다
    return isConnected;
  } catch (error) {
    // 예상치 못한 에러가 발생한 경우 상세 정보를 로깅합니다
    console.error('❌ 서버 연결 테스트 중 오류 발생:', error);

    // 에러 발생 시에도 false를 반환하여 연결 실패로 처리합니다
    return false;
  }
};

// ===== 프로필 생성 테스트 함수 =====

/**
 * 아이 프로필 생성 테스트 함수
 *
 * 새로운 아이 프로필을 생성하는 API의 정상 동작을 테스트합니다.
 * 고정된 테스트 데이터를 사용하여 일관된 테스트 결과를 보장합니다.
 *
 * @async
 * @function testCreateChild
 * @returns {Promise<any>} 생성된 프로필 정보 또는 에러
 * @throws {Error} 프로필 생성 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const newProfile = await testCreateChild();
 *   console.log('생성된 프로필 ID:', newProfile.data.childId);
 * } catch (error) {
 *   console.error('프로필 생성 실패:', error.message);
 * }
 * ```
 */
export const testCreateChild = async () => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n👶 프로필 생성 테스트 시작...');

  try {
    // 테스트용 아이 프로필 데이터를 정의합니다
    // 실제 서비스에서 사용될 수 있는 현실적인 데이터를 사용합니다
    const testChildData: CreateChildRequest = {
      name: '테스트 아이', // 테스트임을 명시하는 이름
      age: 7, // 일반적인 초등학생 나이
      learningLevel: '초급', // 기본 학습 레벨
    };

    // childrenApi.ts의 createChild 함수를 호출하여 프로필을 생성합니다
    const result = await createChild(testChildData);

    // 성공적인 생성 결과를 콘솔에 로깅합니다
    console.log('✅ 프로필 생성 테스트 성공:', result);

    // 생성된 프로필 정보를 반환합니다 (호출자가 추가 작업에 사용 가능)
    return result;
  } catch (error) {
    // 프로필 생성 실패 시 에러 정보를 로깅하고 에러를 다시 던집니다
    console.error('❌ 프로필 생성 테스트 실패:', error);
    throw error;
  }
};

// ===== 프로필 목록 조회 테스트 함수 =====

/**
 * 아이 프로필 목록 조회 테스트 함수
 *
 * 현재 사용자의 모든 아이 프로필 목록을 가져오는 API의 정상 동작을 테스트합니다.
 * 결과 데이터의 구조와 내용을 확인하여 API 응답의 유효성을 검증합니다.
 *
 * @async
 * @function testGetChildren
 * @returns {Promise<any[]>} 프로필 목록 배열 또는 빈 배열
 * @throws {Error} 프로필 목록 조회 실패 시
 *
 * @example
 * ```typescript
 * const profiles = await testGetChildren();
 * console.log(`현재 ${profiles.length}개의 프로필이 등록되어 있습니다.`);
 * ```
 */
export const testGetChildren = async () => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n📋 프로필 목록 조회 테스트 시작...');

  try {
    // childrenApi.ts의 getChildren 함수를 호출하여 프로필 목록을 가져옵니다
    const children = await getChildren();

    // 조회 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 프로필 목록 조회 테스트 성공:');
    console.log(`   📊 총 프로필 수: ${children.length}개`);

    // 각 프로필의 기본 정보를 요약하여 출력합니다
    children.forEach((child, index) => {
      console.log(
        `   ${index + 1}. ${child.name} (${child.age}세, ${child.learningLevel}) - ID: ${child.childId}`
      );
    });

    // 조회된 프로필 목록을 반환합니다
    return children;
  } catch (error) {
    // 프로필 목록 조회 실패 시 에러 정보를 로깅하고 에러를 다시 던집니다
    console.error('❌ 프로필 목록 조회 테스트 실패:', error);
    throw error;
  }
};

// ===== 특정 프로필 조회 테스트 함수 =====

/**
 * 특정 아이 프로필 조회 테스트 함수
 *
 * 지정된 ID의 아이 프로필 상세 정보를 가져오는 API의 정상 동작을 테스트합니다.
 * 유효하지 않은 ID에 대한 에러 처리도 함께 확인합니다.
 *
 * @async
 * @function testGetChild
 * @param {number} [childId=1] - 조회할 아이 프로필의 ID (기본값: 1)
 * @returns {Promise<any>} 조회된 프로필 정보
 * @throws {Error} 프로필 조회 실패 시 (존재하지 않는 ID 등)
 *
 * @example
 * ```typescript
 * // 기본 ID(1)로 조회
 * const profile = await testGetChild();
 *
 * // 특정 ID로 조회
 * const specificProfile = await testGetChild(123);
 * console.log('조회된 프로필:', specificProfile.name);
 * ```
 */
export const testGetChild = async (childId: number = 1) => {
  // 테스트 시작과 대상 ID를 알리는 로그 출력
  console.log(`\n🔍 프로필 조회 테스트 시작... (ID: ${childId})`);

  try {
    // childrenApi.ts의 getChild 함수를 호출하여 특정 프로필을 가져옵니다
    const child = await getChild(childId);

    // 조회 성공 시 프로필의 상세 정보를 로깅합니다
    console.log('✅ 프로필 조회 테스트 성공:');
    console.log(`   👤 이름: ${child.name}`);
    console.log(`   🎂 나이: ${child.age}세`);
    console.log(`   📚 학습 레벨: ${child.learningLevel}`);
    console.log(`   🆔 프로필 ID: ${child.childId}`);

    // 선택적 필드들이 있는 경우에만 출력합니다
    if (child.createdAt) {
      console.log(`   📅 생성일: ${child.createdAt}`);
    }
    if (child.updatedAt) {
      console.log(`   🔄 수정일: ${child.updatedAt}`);
    }

    // 조회된 프로필 정보를 반환합니다
    return child;
  } catch (error) {
    // 프로필 조회 실패 시 에러 정보를 로깅하고 에러를 다시 던집니다
    console.error('❌ 프로필 조회 테스트 실패:', error);
    throw error;
  }
};

// ===== 프로필 수정 테스트 함수 =====

/**
 * 아이 프로필 수정 테스트 함수
 *
 * 기존 아이 프로필의 정보를 수정하는 API의 정상 동작을 테스트합니다.
 * 부분 수정(partial update) 기능을 테스트하여 필요한 필드만 업데이트할 수 있음을 확인합니다.
 *
 * @async
 * @function testUpdateChild
 * @param {number} [childId=1] - 수정할 아이 프로필의 ID (기본값: 1)
 * @returns {Promise<any>} 수정된 프로필 정보
 * @throws {Error} 프로필 수정 실패 시
 *
 * @example
 * ```typescript
 * // 기본 ID(1)의 프로필 수정
 * const updated = await testUpdateChild();
 *
 * // 특정 ID의 프로필 수정
 * const specificUpdated = await testUpdateChild(123);
 * console.log('수정된 프로필:', specificUpdated.name);
 * ```
 */
export const testUpdateChild = async (childId: number = 1) => {
  // 테스트 시작과 대상 ID를 알리는 로그 출력
  console.log(`\n✏️ 프로필 수정 테스트 시작... (ID: ${childId})`);

  try {
    // 수정할 데이터를 정의합니다 (부분 수정 테스트)
    // 모든 필드를 수정할 필요 없이 변경하고 싶은 필드만 포함합니다
    const updateData = {
      name: '수정된 테스트 아이', // 이름만 수정
      age: 8, // 나이도 함께 수정
      // learningLevel은 수정하지 않음 (기존 값 유지)
    };

    // childrenApi.ts의 updateChild 함수를 호출하여 프로필을 수정합니다
    const updatedChild = await updateChild(childId, updateData);

    // 수정 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 프로필 수정 테스트 성공:');
    console.log('   📝 수정된 내용:');
    console.log(`      이름: ${updatedChild.name}`);
    console.log(`      나이: ${updatedChild.age}세`);
    console.log(`      학습 레벨: ${updatedChild.learningLevel} (변경 안 됨)`);

    // 수정된 프로필 정보를 반환합니다
    return updatedChild;
  } catch (error) {
    // 프로필 수정 실패 시 에러 정보를 로깅하고 에러를 다시 던집니다
    console.error('❌ 프로필 수정 테스트 실패:', error);
    throw error;
  }
};

// ===== 프로필 삭제 테스트 함수 =====

/**
 * 아이 프로필 삭제 테스트 함수
 *
 * 지정된 아이 프로필을 삭제하는 API의 정상 동작을 테스트합니다.
 * 삭제는 되돌릴 수 없는 작업이므로 신중하게 사용해야 합니다.
 *
 * @async
 * @function testDeleteChild
 * @param {number} [childId=1] - 삭제할 아이 프로필의 ID (기본값: 1)
 * @returns {Promise<boolean>} 삭제 성공 여부
 * @throws {Error} 프로필 삭제 실패 시
 *
 * @example
 * ```typescript
 * // 기본 ID(1)의 프로필 삭제
 * const isDeleted = await testDeleteChild();
 * if (isDeleted) {
 *   console.log('프로필이 성공적으로 삭제되었습니다');
 * }
 *
 * // 특정 ID의 프로필 삭제
 * await testDeleteChild(123);
 * ```
 */
export const testDeleteChild = async (childId: number = 1) => {
  // 테스트 시작과 대상 ID를 알리는 로그 출력
  // 삭제는 중요한 작업이므로 경고 이모지 사용
  console.log(`\n🗑️ 프로필 삭제 테스트 시작... (ID: ${childId})`);

  try {
    // childrenApi.ts의 deleteChild 함수를 호출하여 프로필을 삭제합니다
    const isDeleted = await deleteChild(childId);

    // 삭제 성공 시 결과를 로깅합니다
    if (isDeleted) {
      console.log('✅ 프로필 삭제 테스트 성공');
      console.log(`   🗑️ ID ${childId}번 프로필이 영구적으로 삭제되었습니다`);
    } else {
      // 삭제 함수가 false를 반환한 경우 (일반적이지 않은 상황)
      console.log('⚠️ 프로필 삭제 결과가 예상과 다릅니다');
    }

    // 삭제 결과를 반환합니다
    return isDeleted;
  } catch (error) {
    // 프로필 삭제 실패 시 에러 정보를 로깅하고 에러를 다시 던집니다
    console.error('❌ 프로필 삭제 테스트 실패:', error);
    throw error;
  }
};

// ===== 통합 테스트 함수 =====

/**
 * 전체 API 통합 테스트 실행 함수
 *
 * 모든 API 엔드포인트를 순차적으로 테스트하여 전체 시스템의 정상 동작을 확인합니다.
 * 실제 사용 시나리오를 모방하여 데이터의 생성부터 삭제까지 전 과정을 테스트합니다.
 *
 * 테스트 시나리오:
 * 1. 서버 연결 확인
 * 2. 기존 프로필 목록 조회
 * 3. 새 프로필 생성
 * 4. 생성된 프로필 조회
 * 5. 프로필 정보 수정
 * 6. 수정된 프로필 조회
 * 7. 프로필 삭제 (선택적)
 *
 * @async
 * @function runAllApiTests
 * @param {boolean} [includeDelete=false] - 삭제 테스트 포함 여부 (기본값: false)
 * @returns {Promise<void>} 모든 테스트 완료 시 resolve
 * @throws {Error} 테스트 중 실패 시
 *
 * @example
 * ```typescript
 * // 삭제 테스트 없이 실행
 * await runAllApiTests();
 *
 * // 삭제 테스트 포함하여 실행
 * await runAllApiTests(true);
 * ```
 */
export const runAllApiTests = async (includeDelete: boolean = false): Promise<void> => {
  // 통합 테스트 시작을 알리는 헤더 출력
  console.log('\n' + '='.repeat(50));
  console.log('🚀 전체 API 통합 테스트 시작');
  console.log('='.repeat(50));

  // 생성된 프로필의 ID를 저장할 변수 (후속 테스트에서 사용)
  let createdChildId: number | null = null;

  try {
    // === 1단계: 서버 연결 테스트 ===
    console.log('\n📍 1단계: 서버 연결 상태 확인');
    const isServerConnected = await testServerConnection();

    // 서버 연결에 실패한 경우 후속 테스트를 진행할 수 없으므로 중단
    if (!isServerConnected) {
      throw new Error('서버 연결 실패로 인해 테스트를 중단합니다');
    }

    // === 2단계: 기존 프로필 목록 조회 ===
    console.log('\n📍 2단계: 기존 프로필 목록 조회');
    const initialChildren = await testGetChildren();
    console.log(`   ℹ️ 테스트 시작 전 프로필 수: ${initialChildren.length}개`);

    // === 3단계: 새 프로필 생성 ===
    console.log('\n📍 3단계: 새 프로필 생성');
    const createdChild = await testCreateChild();
    createdChildId = createdChild.data.childId; // 생성된 프로필 ID 저장
    console.log(`   ✨ 새로 생성된 프로필 ID: ${createdChildId}`);

    // === 4단계: 생성된 프로필 조회 확인 ===
    console.log('\n📍 4단계: 생성된 프로필 조회 확인');
    await testGetChild(createdChildId);

    // === 5단계: 프로필 정보 수정 ===
    console.log('\n📍 5단계: 프로필 정보 수정');
    await testUpdateChild(createdChildId);

    // === 6단계: 수정된 프로필 재조회 ===
    console.log('\n📍 6단계: 수정 결과 확인');
    await testGetChild(createdChildId);

    // === 7단계: 프로필 삭제 (선택적) ===
    if (includeDelete && createdChildId) {
      console.log('\n📍 7단계: 프로필 삭제 (정리 작업)');
      await testDeleteChild(createdChildId);
      console.log('   🧹 테스트용 프로필이 정리되었습니다');
    } else {
      console.log('\n📍 7단계: 프로필 삭제 건너뛰기');
      console.log(`   ℹ️ 테스트용 프로필 (ID: ${createdChildId})이 유지됩니다`);
    }

    // === 테스트 완료 메시지 ===
    console.log('\n' + '='.repeat(50));
    console.log('🎉 모든 API 테스트가 성공적으로 완료되었습니다!');
    console.log('='.repeat(50));
  } catch (error) {
    // 테스트 중 에러가 발생한 경우 상세 정보를 로깅합니다
    console.log('\n' + '='.repeat(50));
    console.error('💥 API 테스트 중 오류가 발생했습니다:');
    console.error(error);
    console.log('='.repeat(50));

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 빠른 테스트 함수 =====

/**
 * 빠른 프로필 생성 테스트 함수
 *
 * 단순히 프로필을 생성하고 결과를 확인하는 최소한의 테스트 함수입니다.
 * 개발 중 빠른 검증이나 데모 데이터 생성 시 사용됩니다.
 *
 * @async
 * @function quickCreateTest
 * @returns {Promise<any>} 생성된 프로필 정보
 * @throws {Error} 프로필 생성 실패 시
 *
 * @example
 * ```typescript
 * // 빠른 테스트 실행
 * const profile = await quickCreateTest();
 * console.log('빠르게 생성된 프로필:', profile.data.childId);
 * ```
 */
export const quickCreateTest = async () => {
  // 빠른 테스트임을 알리는 로그 출력
  console.log('\n⚡ 빠른 프로필 생성 테스트...');

  try {
    // 간단한 테스트 데이터로 프로필을 생성합니다
    const quickTestData: CreateChildRequest = {
      name: '빠른테스트', // 빠른 테스트임을 명시하는 이름
      age: 6, // 기본 나이
      learningLevel: '초급', // 기본 학습 레벨
    };

    // 프로필 생성 API를 호출합니다
    const result = await createChild(quickTestData);

    // 생성 결과를 간단히 로깅합니다
    console.log(`⚡ 빠른 생성 완료! ID: ${result.data.childId}`);

    // 생성된 프로필 정보를 반환합니다
    return result;
  } catch (error) {
    // 생성 실패 시 에러를 로깅하고 다시 던집니다
    console.error('⚡ 빠른 생성 실패:', error);
    throw error;
  }
};

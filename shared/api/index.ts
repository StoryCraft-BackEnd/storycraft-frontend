/**
 * API 모듈 Index
 *
 * 모든 API 함수들을 한 곳에서 export하여 쉽게 import할 수 있도록 합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 */

// API 클라이언트 및 설정
export { apiClient, checkServerConnection } from './client';

// Children API 함수들
export {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  // 타입들
  type CreateChildRequest,
  type CreateChildResponse,
  type Child,
} from './childrenApi';

// API 테스트 함수들
export {
  testServerConnection,
  testCreateChild,
  testGetChildren,
  testGetChild,
  testUpdateChild,
  testDeleteChild,
  runAllApiTests,
  quickCreateTest,
} from './apiTest';

// 사용 예시:
// import { createChild, quickCreateTest } from '@/shared/api';
//
// // 프로필 생성
// const result = await createChild({ name: "김철수", age: 7, learningLevel: "초급" });
//
// // 빠른 테스트
// await quickCreateTest();

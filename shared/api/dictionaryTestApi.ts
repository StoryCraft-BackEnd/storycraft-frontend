/**
 * 단어 사전 API 테스트 함수들
 *
 * 단어 조회 및 저장 API의 정상 동작을 검증하는 테스트 함수들을 제공합니다.
 * 개발 및 디버깅 목적으로 사용할 수 있습니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import { saveWord, SaveWordRequest } from './dictionaryApi';
import { getStoredUserId } from './authApi';

// ===== 단어 저장 테스트 함수 =====

/**
 * 단어 저장 API 테스트 함수
 *
 * 영어 단어를 조회하고 사용자 사전에 저장하는 API의 정상 동작을 검증합니다.
 * 저장된 단어의 상세 정보(의미, 예문 등)를 확인할 수 있습니다.
 *
 * 테스트 과정:
 * 1. 저장된 사용자 ID 확인
 * 2. 테스트용 단어 저장 요청 데이터 준비
 * 3. 단어 저장 API 호출
 * 4. 저장 결과 검증
 *
 * @async
 * @function testSaveWord
 * @param {number} childId - 테스트할 자녀 프로필 ID
 * @param {string} testWord - 테스트할 영어 단어
 * @returns {Promise<any>} 단어 저장 성공 결과 (저장된 단어 정보)
 * @throws {Error} 단어 저장 실패 시 (잘못된 데이터, 서버 오류 등)
 *
 * @example
 * ```typescript
 * try {
 *   const result = await testSaveWord(123, "adventure");
 *   console.log('저장된 단어:', result.word);
 *   console.log('의미:', result.meaning);
 *   console.log('예문:', result.exampleEng);
 * } catch (error) {
 *   console.error('단어 저장 테스트 실패:', error.message);
 * }
 * ```
 */
export const testSaveWord = async (childId: number, testWord: string) => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n📚 단어 저장 테스트 시작...');

  try {
    // 저장된 사용자 ID를 확인합니다
    const userId = await getStoredUserId();
    if (!userId) {
      throw new Error('사용자 ID가 없습니다. 먼저 로그인해주세요.');
    }

    // 테스트용 단어 저장 요청 데이터를 준비합니다
    const testData: SaveWordRequest = {
      userID: userId,
      childID: childId,
      word: testWord,
    };

    // 단어 저장 시도할 정보를 로깅합니다
    console.log('   🔧 단어 저장 시도 정보:');
    console.log(`      사용자 ID: ${testData.userID}`);
    console.log(`      자녀 ID: ${testData.childID}`);
    console.log(`      단어: ${testData.word}`);

    // dictionaryApi.ts의 saveWord 함수를 호출하여 실제 단어 저장을 시도합니다
    const result = await saveWord(testData);

    // 단어 저장 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 단어 저장 테스트 성공:');
    console.log('   🎯 반환된 정보:');
    console.log(`      저장 ID: ${result.savedId}`);
    console.log(`      자녀 ID: ${result.childId}`);
    console.log(`      단어: ${result.word}`);
    console.log(`      의미: ${result.meaning}`);
    console.log(`      영어 예문: ${result.exampleEng}`);
    console.log(`      한국어 예문: ${result.exampleKor}`);
    console.log(`      저장 시간: ${result.savedAt}`);

    // 단어 저장 성공 결과를 반환합니다
    return result;
  } catch (error) {
    // 단어 저장 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 단어 저장 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

/**
 * 여러 단어 저장 테스트 함수
 *
 * 여러 개의 영어 단어를 연속으로 저장하여 API의 안정성을 테스트합니다.
 * 다양한 단어에 대한 처리 능력을 확인할 수 있습니다.
 *
 * @async
 * @function testMultipleWords
 * @param {number} childId - 테스트할 자녀 프로필 ID
 * @returns {Promise<any[]>} 모든 단어 저장 성공 결과 배열
 * @throws {Error} 단어 저장 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const results = await testMultipleWords(123);
 *   console.log(`${results.length}개 단어 저장 완료`);
 * } catch (error) {
 *   console.error('다중 단어 저장 테스트 실패:', error.message);
 * }
 * ```
 */
export const testMultipleWords = async (childId: number) => {
  console.log('\n📚 다중 단어 저장 테스트 시작...');

  const testWords = ['adventure', 'brave', 'curious', 'dream', 'explore'];

  const results = [];

  try {
    for (const word of testWords) {
      console.log(`\n   🔤 "${word}" 단어 저장 중...`);
      const result = await testSaveWord(childId, word);
      results.push(result);
      console.log(`   ✅ "${word}" 저장 완료`);

      // API 호출 간격을 두어 서버 부하 방지
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`\n🎉 모든 단어 저장 완료! 총 ${results.length}개 단어`);
    return results;
  } catch (error) {
    console.error('❌ 다중 단어 저장 테스트 실패:', error);
    throw error;
  }
};

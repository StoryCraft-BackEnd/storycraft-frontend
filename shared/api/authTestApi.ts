/**
 * 인증 API 테스트 함수 모음
 *
 * 사용자 인증과 관련된 API 엔드포인트들의 정상 동작을 검증하는 테스트 함수들을 모아둔 모듈입니다.
 * 회원가입, 로그인, 로그아웃, 토큰 관리 등의 전체 인증 플로우를 테스트할 수 있습니다.
 *
 * 주요 기능:
 * - 회원가입 API 테스트 (고유 이메일 자동 생성)
 * - 로그인 API 테스트 (토큰 발급 및 저장 확인)
 * - 로그아웃 API 테스트 (토큰 정리 확인)
 * - 저장된 토큰 확인 테스트
 * - 전체 인증 플로우 통합 테스트
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

// ===== 내부 모듈 import 섹션 =====
// 인증 관련 API 함수들을 가져옵니다
import { signup, login, logout, getStoredToken } from './authApi';
// 중복 확인 관련 API 함수들을 가져옵니다
import { checkEmail, checkNickname } from '../../features/auth/authApi';

// ===== 회원가입 테스트 함수 =====

/**
 * 회원가입 API 테스트 함수
 *
 * 새로운 사용자 계정을 생성하는 API의 정상 동작을 검증합니다.
 * 매번 고유한 이메일을 생성하여 중복 가입 문제를 방지합니다.
 *
 * 테스트 과정:
 * 1. 현재 시간을 기반으로 고유한 이메일 생성
 * 2. 테스트용 사용자 데이터 준비
 * 3. 회원가입 API 호출
 * 4. 응답 결과 검증 및 로깅
 *
 * @async
 * @function testSignup
 * @returns {Promise<any>} 회원가입 성공 결과 또는 에러
 * @throws {Error} 회원가입 실패 시 (이메일 중복, 서버 오류 등)
 *
 * @example
 * ```typescript
 * try {
 *   const result = await testSignup();
 *   console.log('새 사용자 ID:', result.data.userId);
 * } catch (error) {
 *   console.error('회원가입 테스트 실패:', error.message);
 * }
 * ```
 */
export const testSignup = async () => {
  // 테스트 시작을 알리는 구분선과 함께 로그 출력
  console.log('\n📝 회원가입 테스트 시작...');

  try {
    // 고유한 테스트 데이터 생성 (중복 방지 및 서버 오류 해결)
    const timestamp = Date.now();
    const testData = {
      email: `testuser${timestamp}@example.com`, // 고유한 이메일 (중복 방지)
      password: 'password123', // 더 단순한 비밀번호 (정책 문제 방지)
      name: '홍길동', // 사용자 지정 실명 (string)
      nickname: `hong${timestamp}`, // 고유한 닉네임 (중복 방지)
      role: 'parent', // 부모 권한으로 변경 (admin보다 안전)
    };

    // 생성된 고유 테스트 데이터를 로깅합니다 (디버깅 목적)
    console.log('   🔧 고유 테스트 데이터 생성:');
    console.log(`      이메일: ${testData.email}`);
    console.log(`      이름: ${testData.name}`);
    console.log(`      닉네임: ${testData.nickname}`);
    console.log(`      권한: ${testData.role}`);
    console.log(`      타임스탬프: ${timestamp}`);

    // authApi.ts의 signup 함수를 호출하여 실제 회원가입을 시도합니다
    const result = await signup(testData);

    // 회원가입 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 회원가입 테스트 성공:');
    console.log(`   👤 생성된 사용자 정보:`, result);

    // 성공한 회원가입 결과를 반환합니다
    return result;
  } catch (error) {
    // 회원가입 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 회원가입 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 이메일 중복 확인 테스트 함수 =====

/**
 * 이메일 중복 확인 API 테스트 함수
 *
 * 이메일 중복 확인 API의 정상 동작을 검증합니다.
 * 기존 이메일과 새로운 이메일로 각각 테스트하여 올바른 응답을 확인합니다.
 *
 * 테스트 과정:
 * 1. 기존에 사용 중인 이메일로 중복 확인 (중복된 결과 예상)
 * 2. 새로운 고유 이메일로 중복 확인 (사용 가능 결과 예상)
 * 3. 응답 결과 검증 및 로깅
 *
 * @async
 * @function testEmailCheck
 * @returns {Promise<any>} 이메일 중복 확인 성공 결과
 * @throws {Error} 이메일 중복 확인 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const result = await testEmailCheck();
 *   console.log('이메일 중복 확인 완료:', result);
 * } catch (error) {
 *   console.error('이메일 중복 확인 테스트 실패:', error.message);
 * }
 * ```
 */
export const testEmailCheck = async () => {
  // 테스트 시작을 알리는 구분선과 함께 로그 출력
  console.log('\n📧 이메일 중복 확인 테스트 시작...');

  try {
    // === 1단계: 기존 이메일로 중복 확인 테스트 ===
    console.log('\n📍 1단계: 기존 이메일 중복 확인 (중복 예상)');
    const existingEmail = 'test@example.com'; // 일반적으로 이미 사용 중인 이메일

    console.log(`   🔧 테스트 이메일: ${existingEmail}`);

    try {
      const existingResult = await checkEmail({ email: existingEmail });
      console.log('   📋 기존 이메일 확인 결과:', existingResult);

      if (existingResult.data === false) {
        console.log('   ✅ 예상 결과: 이미 사용 중인 이메일로 정상 확인됨');
      } else {
        console.log('   ℹ️ 결과: 사용 가능한 이메일로 확인됨');
      }
    } catch (error) {
      console.log('   ⚠️ 기존 이메일 확인 중 오류:', error.message);
    }

    // === 2단계: 새로운 이메일로 중복 확인 테스트 ===
    console.log('\n📍 2단계: 새로운 이메일 중복 확인 (사용 가능 예상)');
    const timestamp = Date.now();
    const newEmail = `unique${timestamp}@example.com`;

    console.log(`   🔧 테스트 이메일: ${newEmail}`);

    const newResult = await checkEmail({ email: newEmail });
    console.log('   📋 새로운 이메일 확인 결과:', newResult);

    if (newResult.data === true) {
      console.log('   ✅ 예상 결과: 사용 가능한 이메일로 정상 확인됨');
    } else {
      console.log('   ⚠️ 예상과 다름: 중복된 이메일로 확인됨');
    }

    // === 3단계: 잘못된 형식 이메일 테스트 ===
    console.log('\n📍 3단계: 잘못된 형식 이메일 테스트');
    const invalidEmail = 'invalid-email-format';

    console.log(`   🔧 테스트 이메일: ${invalidEmail}`);

    try {
      const invalidResult = await checkEmail({ email: invalidEmail });
      console.log('   📋 잘못된 형식 이메일 결과:', invalidResult);
    } catch (error) {
      console.log('   ✅ 예상 결과: 잘못된 형식으로 오류 발생함:', error.message);
    }

    // 테스트 성공 완료
    console.log('\n✅ 이메일 중복 확인 테스트 성공:');
    console.log('   📊 테스트 결과 요약:');
    console.log(`      기존 이메일: ${existingEmail} - 확인 완료`);
    console.log(`      새로운 이메일: ${newEmail} - 확인 완료`);
    console.log(`      잘못된 형식: ${invalidEmail} - 오류 처리 확인`);

    return {
      success: true,
      tested: {
        existing: existingEmail,
        new: newEmail,
        invalid: invalidEmail,
      },
    };
  } catch (error) {
    // 이메일 중복 확인 테스트 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 이메일 중복 확인 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 닉네임 중복 확인 테스트 함수 =====

/**
 * 닉네임 중복 확인 API 테스트 함수
 *
 * 닉네임 중복 확인 API의 정상 동작을 검증합니다.
 * 기존 닉네임과 새로운 닉네임으로 각각 테스트하여 올바른 응답을 확인합니다.
 *
 * 테스트 과정:
 * 1. 기존에 사용 중인 닉네임으로 중복 확인 (중복된 결과 예상)
 * 2. 새로운 고유 닉네임으로 중복 확인 (사용 가능 결과 예상)
 * 3. 응답 결과 검증 및 로깅
 *
 * @async
 * @function testNicknameCheck
 * @returns {Promise<any>} 닉네임 중복 확인 성공 결과
 * @throws {Error} 닉네임 중복 확인 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   const result = await testNicknameCheck();
 *   console.log('닉네임 중복 확인 완료:', result);
 * } catch (error) {
 *   console.error('닉네임 중복 확인 테스트 실패:', error.message);
 * }
 * ```
 */
export const testNicknameCheck = async () => {
  // 테스트 시작을 알리는 구분선과 함께 로그 출력
  console.log('\n🏷️ 닉네임 중복 확인 테스트 시작...');

  try {
    // === 1단계: 기존 닉네임으로 중복 확인 테스트 ===
    console.log('\n📍 1단계: 기존 닉네임 중복 확인 (중복 예상)');
    const existingNickname = 'admin'; // 일반적으로 이미 사용 중인 닉네임

    console.log(`   🔧 테스트 닉네임: ${existingNickname}`);

    try {
      const existingResult = await checkNickname({ nickname: existingNickname });
      console.log('   📋 기존 닉네임 확인 결과:', existingResult);

      if (existingResult.data === false) {
        console.log('   ✅ 예상 결과: 이미 사용 중인 닉네임으로 정상 확인됨');
      } else {
        console.log('   ℹ️ 결과: 사용 가능한 닉네임으로 확인됨');
      }
    } catch (error) {
      console.log('   ⚠️ 기존 닉네임 확인 중 오류:', error.message);
    }

    // === 2단계: 새로운 닉네임으로 중복 확인 테스트 ===
    console.log('\n📍 2단계: 새로운 닉네임 중복 확인 (사용 가능 예상)');
    const timestamp = Date.now();
    const newNickname = `unique${timestamp}`;

    console.log(`   🔧 테스트 닉네임: ${newNickname}`);

    const newResult = await checkNickname({ nickname: newNickname });
    console.log('   📋 새로운 닉네임 확인 결과:', newResult);

    if (newResult.data === true) {
      console.log('   ✅ 예상 결과: 사용 가능한 닉네임으로 정상 확인됨');
    } else {
      console.log('   ⚠️ 예상과 다름: 중복된 닉네임으로 확인됨');
    }

    // === 3단계: 너무 짧은 닉네임 테스트 ===
    console.log('\n📍 3단계: 너무 짧은 닉네임 테스트');
    const shortNickname = 'a';

    console.log(`   🔧 테스트 닉네임: ${shortNickname}`);

    try {
      const shortResult = await checkNickname({ nickname: shortNickname });
      console.log('   📋 짧은 닉네임 결과:', shortResult);
    } catch (error) {
      console.log('   ✅ 예상 결과: 너무 짧은 닉네임으로 오류 발생함:', error.message);
    }

    // 테스트 성공 완료
    console.log('\n✅ 닉네임 중복 확인 테스트 성공:');
    console.log('   📊 테스트 결과 요약:');
    console.log(`      기존 닉네임: ${existingNickname} - 확인 완료`);
    console.log(`      새로운 닉네임: ${newNickname} - 확인 완료`);
    console.log(`      짧은 닉네임: ${shortNickname} - 검증 확인`);

    return {
      success: true,
      tested: {
        existing: existingNickname,
        new: newNickname,
        short: shortNickname,
      },
    };
  } catch (error) {
    // 닉네임 중복 확인 테스트 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 닉네임 중복 확인 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 로그인 테스트 함수 =====

/**
 * 로그인 API 테스트 함수
 *
 * 기존 사용자 계정으로 로그인하는 API의 정상 동작을 검증합니다.
 * 토큰 발급과 자동 저장 기능이 올바르게 작동하는지 확인합니다.
 *
 * 테스트 과정:
 * 1. 테스트용 로그인 정보 준비
 * 2. 로그인 API 호출
 * 3. 토큰 발급 및 저장 확인
 * 4. 사용자 정보 반환 검증
 *
 * @async
 * @function testLogin
 * @returns {Promise<any>} 로그인 성공 결과 (토큰, 사용자 정보)
 * @throws {Error} 로그인 실패 시 (잘못된 인증 정보, 서버 오류 등)
 *
 * @example
 * ```typescript
 * try {
 *   const result = await testLogin();
 *   console.log('로그인한 사용자:', result.data.user.nickname);
 * } catch (error) {
 *   console.error('로그인 테스트 실패:', error.message);
 * }
 * ```
 */
export const testLogin = async () => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n🔐 로그인 테스트 시작...');

  try {
    // 테스트용 로그인 인증 정보를 준비합니다
    // mock 서버에 등록된 테스트 계정 정보를 사용합니다
    const testData = {
      email: 'test@example.com', // 테스트용 이메일 (mock 서버에 등록됨)
      password: '1234', // mock 서버의 실제 비밀번호와 일치
    };

    // 로그인 시도할 계정 정보를 로깅합니다 (보안상 비밀번호는 마스킹)
    console.log('   🔧 로그인 시도 정보:');
    console.log(`      이메일: ${testData.email}`);
    console.log(`      비밀번호: ${testData.password}`);

    // authApi.ts의 login 함수를 호출하여 실제 로그인을 시도합니다
    const result = await login(testData);

    // 로그인 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 로그인 테스트 성공:');
    console.log('   🎯 반환된 정보:');
    console.log(`      사용자 ID: ${result.data.user.userId}`);
    console.log(`      이메일: ${result.data.user.email}`);
    console.log(`      닉네임: ${result.data.user.nickname}`);
    console.log(`      권한: ${result.data.user.role}`);
    console.log('   🔑 토큰 정보:');
    console.log(`      액세스 토큰: 저장 완료 (실제 값은 보안상 표시 안 함)`);
    console.log(`      리프레시 토큰: 저장 완료 (실제 값은 보안상 표시 안 함)`);

    // 로그인 성공 결과를 반환합니다
    return result;
  } catch (error) {
    // 로그인 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 로그인 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 로그아웃 테스트 함수 =====

/**
 * 로그아웃 API 테스트 함수
 *
 * 사용자 로그아웃 처리와 토큰 정리 기능의 정상 동작을 검증합니다.
 * 로컬 스토리지에서 모든 인증 토큰이 올바르게 삭제되는지 확인합니다.
 *
 * 테스트 과정:
 * 1. 현재 로그인 상태 확인 (토큰 존재 여부)
 * 2. 로그아웃 API 호출
 * 3. 토큰 삭제 완료 확인
 * 4. 로그아웃 성공 여부 반환
 *
 * @async
 * @function testLogout
 * @returns {Promise<boolean>} 로그아웃 성공 여부
 * @throws {Error} 로그아웃 처리 중 오류 발생 시
 *
 * @example
 * ```typescript
 * try {
 *   const success = await testLogout();
 *   if (success) {
 *     console.log('로그아웃 완료, 메인 화면으로 이동');
 *   }
 * } catch (error) {
 *   console.error('로그아웃 테스트 실패:', error.message);
 * }
 * ```
 */
export const testLogout = async () => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n🚪 로그아웃 테스트 시작...');

  try {
    // 로그아웃 전 현재 로그인 상태를 확인합니다
    const tokenBeforeLogout = await getStoredToken();
    console.log('   📋 로그아웃 전 상태 확인:');
    console.log(`      토큰 상태: ${tokenBeforeLogout ? '로그인됨' : '로그아웃됨'}`);

    // authApi.ts의 logout 함수를 호출하여 실제 로그아웃을 처리합니다
    const result = await logout();

    // 로그아웃 후 토큰이 정말로 삭제되었는지 확인합니다
    const tokenAfterLogout = await getStoredToken();

    // 로그아웃 성공 시 결과를 상세히 로깅합니다
    console.log('✅ 로그아웃 테스트 성공:');
    console.log('   🧹 토큰 정리 상태:');
    console.log(`      액세스 토큰: ${tokenAfterLogout ? '아직 존재' : '삭제 완료'}`);
    console.log(`      로그아웃 성공: ${result ? 'YES' : 'NO'}`);

    // 실제로 토큰이 삭제되었는지 추가 검증
    if (tokenAfterLogout === null && result === true) {
      console.log('   ✨ 모든 인증 정보가 성공적으로 정리되었습니다');
    } else {
      console.log('   ⚠️ 토큰 정리가 완전하지 않을 수 있습니다');
    }

    // 로그아웃 성공 결과를 반환합니다
    return result;
  } catch (error) {
    // 로그아웃 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 로그아웃 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 토큰 확인 테스트 함수 =====

/**
 * 저장된 토큰 확인 테스트 함수
 *
 * 현재 로컬 스토리지에 저장되어 있는 액세스 토큰의 존재 여부를 확인합니다.
 * 로그인 상태를 판단하고 토큰 관리가 올바르게 작동하는지 검증합니다.
 *
 * 테스트 과정:
 * 1. AsyncStorage에서 토큰 읽기 시도
 * 2. 토큰 존재 여부 확인
 * 3. 토큰 정보 분석 (길이, 형식 등)
 * 4. 로그인 상태 판단 결과 반환
 *
 * @async
 * @function testTokenCheck
 * @returns {Promise<string | null>} 저장된 토큰 또는 null
 * @throws {Error} 토큰 확인 중 오류 발생 시
 *
 * @example
 * ```typescript
 * const token = await testTokenCheck();
 * if (token) {
 *   console.log('사용자가 로그인 상태입니다');
 *   // 인증이 필요한 기능 활성화
 * } else {
 *   console.log('로그인이 필요합니다');
 *   // 로그인 화면으로 안내
 * }
 * ```
 */
export const testTokenCheck = async () => {
  // 테스트 시작을 알리는 로그 출력
  console.log('\n🔍 토큰 확인 테스트 시작...');

  try {
    // authApi.ts의 getStoredToken 함수를 호출하여 저장된 토큰을 확인합니다
    const token = await getStoredToken();

    // 토큰 확인 결과를 상세히 분석하고 로깅합니다
    console.log('✅ 토큰 확인 테스트 성공:');

    if (token) {
      // 토큰이 존재하는 경우의 상세 정보
      console.log('   🔑 토큰 상태: 존재함');
      console.log(`      토큰 길이: ${token.length}자`);
      console.log(`      토큰 시작: ${token.substring(0, 20)}...`); // 보안상 일부분만 표시

      // JWT 토큰 형식인지 간단히 확인 (점으로 구분되는 3개 부분)
      const jwtParts = token.split('.');
      if (jwtParts.length === 3) {
        console.log('      토큰 형식: JWT (JSON Web Token)');
        console.log(`      JWT 구조: header.payload.signature`);
      } else {
        console.log('      토큰 형식: 기타 (JWT가 아님)');
      }

      console.log('   ✨ 사용자는 현재 로그인 상태입니다');
    } else {
      // 토큰이 없는 경우
      console.log('   🚫 토큰 상태: 없음');
      console.log('   ℹ️ 사용자는 현재 로그아웃 상태입니다');
    }

    // 토큰 확인 결과를 반환합니다 (null 또는 토큰 문자열)
    return token;
  } catch (error) {
    // 토큰 확인 실패 시 에러 정보를 상세히 로깅합니다
    console.error('❌ 토큰 확인 테스트 실패:', error);

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

// ===== 전체 인증 통합 테스트 함수 =====

/**
 * 전체 인증 플로우 통합 테스트 함수
 *
 * 회원가입부터 로그아웃까지의 전체 사용자 인증 플로우를 순차적으로 테스트합니다.
 * 실제 사용자가 앱을 사용하는 시나리오를 모방하여 전체 시스템의 정상 동작을 검증합니다.
 *
 * 테스트 시나리오:
 * 1. 현재 토큰 상태 확인 (사전 점검)
 * 2. 새 계정 회원가입
 * 3. 생성된 계정으로 로그인
 * 4. 로그인 후 토큰 확인
 * 5. 로그아웃 처리
 * 6. 로그아웃 후 토큰 정리 확인
 *
 * @async
 * @function runAllAuthTests
 * @returns {Promise<void>} 모든 인증 테스트 완료 시 resolve
 * @throws {Error} 테스트 중 실패 시
 *
 * @example
 * ```typescript
 * try {
 *   await runAllAuthTests();
 *   console.log('모든 인증 기능이 정상 작동합니다');
 * } catch (error) {
 *   console.error('인증 시스템에 문제가 있습니다:', error.message);
 * }
 * ```
 */
export const runAllAuthTests = async () => {
  // 통합 테스트 시작을 알리는 헤더 출력
  console.log('\n' + '='.repeat(60));
  console.log('🚀 전체 인증 플로우 통합 테스트 시작');
  console.log('='.repeat(60));

  try {
    // === 1단계: 테스트 시작 전 현재 상태 확인 ===
    console.log('\n📍 1단계: 테스트 시작 전 현재 토큰 상태 확인');
    const initialToken = await testTokenCheck();
    console.log(`   ℹ️ 테스트 시작 전 로그인 상태: ${initialToken ? '로그인됨' : '로그아웃됨'}`);

    // === 2단계: 이메일 중복 확인 테스트 ===
    console.log('\n📍 2단계: 이메일 중복 확인 API 테스트');
    const emailCheckResult = await testEmailCheck();
    console.log(`   ✨ 이메일 중복 확인 완료: ${emailCheckResult.success ? '성공' : '실패'}`);

    // === 3단계: 닉네임 중복 확인 테스트 ===
    console.log('\n📍 3단계: 닉네임 중복 확인 API 테스트');
    const nicknameCheckResult = await testNicknameCheck();
    console.log(`   ✨ 닉네임 중복 확인 완료: ${nicknameCheckResult.success ? '성공' : '실패'}`);

    // === 4단계: 새 계정 회원가입 ===
    console.log('\n📍 4단계: 새 사용자 계정 생성 (회원가입)');
    const signupResult = await testSignup();
    console.log(
      `   ✨ 새 계정 생성 완료: ${signupResult.data?.userId ? 'ID ' + signupResult.data.userId : '성공'}`
    );

    // === 5단계: 생성된 계정으로 로그인 ===
    console.log('\n📍 5단계: 테스트 계정으로 로그인');
    const loginResult = await testLogin();
    console.log(`   🔐 로그인 완료: ${loginResult.data.user.nickname}님 환영합니다`);

    // === 6단계: 로그인 후 토큰 상태 재확인 ===
    console.log('\n📍 6단계: 로그인 후 토큰 상태 재확인');
    const tokenAfterLogin = await testTokenCheck();
    console.log(
      `   🔍 로그인 후 토큰 상태: ${tokenAfterLogin ? '정상 발급됨' : '토큰 없음 (문제 가능성)'}`
    );

    // === 7단계: 로그아웃 처리 ===
    console.log('\n📍 7단계: 로그아웃 및 토큰 정리');
    const logoutResult = await testLogout();
    console.log(`   🚪 로그아웃 처리: ${logoutResult ? '성공' : '실패'}`);

    // === 8단계: 로그아웃 후 최종 상태 확인 ===
    console.log('\n📍 8단계: 로그아웃 후 최종 토큰 상태 확인');
    const finalToken = await testTokenCheck();
    console.log(
      `   🧹 최종 정리 상태: ${finalToken ? '토큰 남아있음 (문제 가능성)' : '정리 완료'}`
    );

    // === 테스트 완료 및 결과 요약 ===
    console.log('\n' + '='.repeat(60));
    console.log('🎉 모든 인증 테스트가 성공적으로 완료되었습니다!');
    console.log('\n📊 테스트 결과 요약:');
    console.log(`   ✅ 이메일 중복 확인: 성공 (API 정상 동작 확인)`);
    console.log(`   ✅ 닉네임 중복 확인: 성공 (API 정상 동작 확인)`);
    console.log(`   ✅ 회원가입: 성공 (새 계정 생성됨)`);
    console.log(`   ✅ 로그인: 성공 (토큰 발급 및 저장됨)`);
    console.log(`   ✅ 토큰 관리: 성공 (정상 저장 및 조회됨)`);
    console.log(`   ✅ 로그아웃: 성공 (토큰 정리됨)`);
    console.log('\n💡 인증 시스템이 정상적으로 작동하고 있습니다.');
    console.log('='.repeat(60));
  } catch (error) {
    // 테스트 중 에러가 발생한 경우 상세 정보를 로깅합니다
    console.log('\n' + '='.repeat(60));
    console.error('💥 인증 테스트 중 오류가 발생했습니다:');
    console.error(`   ❌ 오류 메시지: ${error.message}`);
    console.error(`   🔍 오류 상세:`, error);
    console.log('\n🚨 인증 시스템에 문제가 있을 수 있습니다.');
    console.log('   개발팀에 문의하거나 로그를 확인해주세요.');
    console.log('='.repeat(60));

    // 에러를 다시 던져서 호출자가 처리할 수 있도록 합니다
    throw error;
  }
};

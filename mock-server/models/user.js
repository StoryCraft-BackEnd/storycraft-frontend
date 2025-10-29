// mock-server/models/user.js
/**
 * 사용자 데이터 모델
 * 실제 프로덕션 환경에서는 데이터베이스와 연동되어야 하지만,
 * 현재는 테스트를 위한 더미 데이터를 사용합니다.
 */

const TEST_USER = {
  id: 1, // 사용자 고유 식별자
  email: 'test@example.com', // 로그인에 사용되는 이메일
  password: '1234', // 로그인 비밀번호 (실제 환경에서는 해시화되어야 함)
  name: '테스트 사용자', // 사용자 표시 이름
};

export { TEST_USER };

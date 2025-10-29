/**
 * 인증 관련 비즈니스 로직을 처리하는 컨트롤러
 * 로그인, 회원가입, 토큰 갱신 등의 인증 관련 기능을 담당합니다.
 */
import { TEST_USER } from '../models/user.js';

/**
 * 사용자 로그인 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 로그인 성공 시 토큰과 사용자 정보, 실패 시 에러 메시지
 */
const login = (req, res) => {
  const { email, password } = req.body;

  // 입력값 검증
  if (!email || !password) {
    return res.status(400).json({
      message: '이메일과 비밀번호를 모두 입력해주세요.',
    });
  }

  // 테스트 계정 확인
  if (email === TEST_USER.email && password === TEST_USER.password) {
    return res.json({
      access_token: 'test-access-token-1234', // 실제 환경에서는 JWT 토큰 사용
      refresh_token: 'test-refresh-token-5678', // 토큰 갱신용
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      },
    });
  }

  // 로그인 실패
  return res.status(401).json({
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  });
};

/**
 * 회원가입 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 회원가입 성공/실패 메시지
 */
const signup = (req, res) => {
  const { email, password, name, nickname, role } = req.body;

  // 간단한 유효성 검사
  if (!email || !password || !name || !nickname || !role) {
    return res.status(400).json({
      status: 400,
      message: '모든 필드를 입력해주세요.',
      data: false,
    });
  }

  // 실제로는 DB에서 중복 체크 필요 (여기선 생략)
  return res.status(201).json({
    status: 201,
    message: '회원가입이 완료되었습니다.',
    data: true,
  });
};

/**
 * 이메일 중복확인 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 이메일 사용 가능 여부
 */
const checkEmail = (req, res) => {
  const { email } = req.body;
  // 예시: test@example.com만 이미 사용 중이라고 가정
  if (email === 'test@example.com') {
    return res.json({
      status: 200,
      message: '이미 사용 중인 이메일입니다.',
      data: false,
    });
  }
  return res.json({
    status: 200,
    message: '이메일 사용 가능',
    data: true,
  });
};

/**
 * 닉네임 중복확인 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 닉네임 사용 가능 여부
 */
const checkNickname = (req, res) => {
  const { nickname } = req.body;
  // 예시: "스토리"만 이미 사용 중이라고 가정
  if (nickname === '스토리') {
    return res.json({
      status: 200,
      message: '이미 사용 중인 닉네임입니다.',
      data: false,
    });
  }
  return res.json({
    status: 200,
    message: '닉네임 사용 가능',
    data: true,
  });
};

/**
 * 이메일 인증 코드 전송 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 인증 코드 전송 결과
 */
const sendEmailVerificationCode = (req, res) => {
  const { email } = req.body;

  // 가입된 이메일인지 확인 (테스트용: test@example.com만 가입된 이메일로 가정)
  if (email !== 'test@example.com') {
    return res.status(404).json({
      status: 404,
      message: '가입되지 않은 이메일입니다.',
      data: false,
    });
  }

  // 실제로는 이메일로 인증코드를 전송해야 함
  return res.json({
    status: 200,
    message: '비밀번호 재설정을 위한 인증코드가 이메일로 전송되었습니다.',
    data: true,
  });
};

/**
 * 이메일 인증번호 확인 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 인증 결과
 */
const checkEmailVerificationCode = (req, res) => {
  const { email, code } = req.body;
  if (email === 'test@example.com' && code === '123456') {
    return res.json({
      status: 200,
      message: '인증에 성공했습니다.',
      data: {
        reset_token: 'mock-reset-token',
      },
    });
  }
  return res.status(400).json({
    status: 400,
    message: '인증번호가 올바르지 않습니다.',
    data: false,
  });
};

/**
 * 비밀번호 재설정 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 비밀번호 재설정 결과
 */
const resetPassword = (req, res) => {
  const { token, new_password } = req.body;
  // 실제로는 token 검증 및 비밀번호 변경 로직 필요
  if (token === 'mock-reset-token' && new_password) {
    return res.json({
      status: 200,
      message: '비밀번호가 성공적으로 재설정되었습니다.',
      data: true,
    });
  }
  return res.status(400).json({
    status: 400,
    message: '비밀번호 재설정에 실패했습니다.',
    data: false,
  });
};

/**
 * 액세스 토큰 재발급 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 새 access_token 반환
 */
const refreshAccessToken = (req, res) => {
  // 실제로는 refreshToken 검증 필요, 여기선 무조건 성공 응답
  return res.json({
    status: 200,
    message: '액세스 토큰이 재발급되었습니다.',
    data: {
      access_token: 'mocked_jwt_access_token',
    },
  });
};

/**
 * 로그아웃 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 로그아웃 결과
 */
const logout = (req, res) => {
  return res.json({
    status: 200,
    message: '로그아웃이 완료되었습니다.',
    data: true,
  });
};

/**
 * 회원 탈퇴 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @returns {Object} 회원 탈퇴 결과
 */
const withdraw = (req, res) => {
  return res.json({
    status: 200,
    message: '회원 탈퇴가 완료되었습니다.',
    data: true,
  });
};

export {
  login,
  signup,
  checkEmail,
  checkNickname,
  sendEmailVerificationCode,
  checkEmailVerificationCode,
  resetPassword,
  refreshAccessToken,
  logout,
  withdraw,
};

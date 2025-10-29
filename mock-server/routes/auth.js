/**
 * 인증 관련 라우트 정의
 * /api/auth/* 경로로 들어오는 요청을 처리합니다.
 */
import express from 'express';
import {
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
} from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/login - 사용자 로그인
router.post('/login', login);

// POST /api/auth/signup - 회원가입
router.post('/signup', signup);

// POST /api/auth/email/verification/exists - 이메일 중복확인
router.post('/email/verification/exists', checkEmail);

// POST /api/auth/nickname/exists - 닉네임 중복확인
router.post('/nickname/exists', checkNickname);

// POST /api/auth/request-reset-code - 이메일 인증 코드 전송
router.post('/request-reset-code', sendEmailVerificationCode);

// POST /api/auth/verify-reset-code - 이메일 인증번호 확인
router.post('/verify-reset-code', checkEmailVerificationCode);

// POST /api/auth/reset-password - 비밀번호 재설정
router.post('/reset-password', resetPassword);

// POST /api/auth/token/refresh - 액세스 토큰 재발급
router.post('/token/refresh', refreshAccessToken);

// POST /api/auth/logout - 로그아웃
router.post('/logout', logout);

// DELETE /api/users - 회원 탈퇴
router.delete('/users', withdraw);

export default router;

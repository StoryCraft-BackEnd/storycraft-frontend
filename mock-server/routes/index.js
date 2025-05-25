/**
 * 메인 라우터
 * 모든 API 라우트를 통합하고 관리합니다.
 * 각 기능별 라우터를 여기서 import하여 사용합니다.
 */
import express from 'express';
import authRoutes from './auth.js';
import storycreate from './storycreate.js';

const router = express.Router();

// 인증 관련 라우트 (/api/auth/*)
router.use('/auth', authRoutes);

// 내 정보 조회 라우트 (/api/users/me)
router.get('/users/me', (req, res) => {
  res.json({
    status: 200,
    message: '내 정보 조회 성공',
    data: {
      email: 'user@example.com',
      name: '홍길동',
      nickname: 'hong',
      role: 'parent',
      signup_date: '2024-01-01T00:00:00.000Z',
    },
  });
});

// 동화 생성 라우트
router.use('/stories', storycreate);

// 닉네임 수정 라우트 (/api/users)
router.patch('/users', (req, res) => {
  const { nickname } = req.body;
  if (!nickname) {
    return res.status(400).json({
      status: 400,
      message: '닉네임이 필요합니다.',
      data: false,
    });
  }
  res.json({
    status: 200,
    message: '닉네임 수정이 완료되었습니다.',
    data: true,
  });
});

export default router;

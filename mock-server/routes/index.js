/**
 * 메인 라우터
 * 모든 API 라우트를 통합하고 관리합니다.
 * 각 기능별 라우터를 여기서 import하여 사용합니다.
 */
import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

// 인증 관련 라우트 (/api/auth/*)
router.use('/auth', authRoutes);

export default router;

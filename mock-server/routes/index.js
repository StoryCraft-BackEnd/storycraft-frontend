/**
 * 메인 라우터
 * 모든 API 라우트를 통합하고 관리합니다.
 * 각 기능별 라우터를 여기서 import하여 사용합니다.
 */
import express from 'express';
import authRoutes from './auth.js';
import storyRoutes from './story.js';
import profile from './profile.js';
import userRoutes from './users.js';

const router = express.Router();

// 인증 관련 라우트 (/api/auth/*)
router.use('/auth', authRoutes);

// 사용자 관련 라우트 (/api/users/*)
router.use('/users', userRoutes);

// 동화 관련 라우트 (/api/stories/*)
router.use('/stories', storyRoutes);

// 프로필 관련 라우트
router.use('/profiles', profile);

export default router;

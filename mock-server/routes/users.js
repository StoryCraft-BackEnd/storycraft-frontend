/**
 * 사용자 관련 라우트 정의
 * /api/users/* 경로로 들어오는 요청을 처리합니다.
 */
import express from 'express';
import { getMyInfo, updateNickname } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/me - 내 정보 조회
router.get('/me', getMyInfo);

// PATCH /api/users - 닉네임 수정
router.patch('/', updateNickname);

export default router;

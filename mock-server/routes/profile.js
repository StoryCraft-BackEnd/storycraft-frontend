import express from 'express';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profileController.js';

const router = express.Router();

// 프로필 조회 라우트
router.get('/', getProfiles);

// 프로필 생성
router.post('/', createProfile);

// 프로필 수정
router.put('/:id', updateProfile);

// 프로필 삭제
router.delete('/:id', deleteProfile);

export default router;

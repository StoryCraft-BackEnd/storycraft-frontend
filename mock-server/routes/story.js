/**
 * 동화 관련 라우터
 * 동화 생성, 조회, 수정, 삭제 등의 라우트를 관리합니다.
 */
import express from 'express';
import { createStory, getStories, deleteStory } from '../controllers/storyController.js';

const router = express.Router();

// 동화 생성 라우트
router.post('/', createStory);

// 동화 목록 조회 라우트
router.get('/lists', getStories);

// 동화 삭제 라우트
router.delete('/:storyId', deleteStory);

export default router;

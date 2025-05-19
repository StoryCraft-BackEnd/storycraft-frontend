import express from 'express';
import { createStory } from '../controllers/storyController.js';

const router = express.Router();

// 동화 생성 라우트
router.post('/create', createStory);

export default router;

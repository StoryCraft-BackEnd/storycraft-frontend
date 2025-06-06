/**
 * 동화 관련 컨트롤러
 * 동화 생성, 조회 등의 비즈니스 로직을 처리합니다.
 */

import Story from '../models/Story.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storiesFilePath = path.join(__dirname, '../models/stories.json');

// JSON 파일 읽기 함수
const readStoriesFile = async () => {
  const data = await fs.readFile(storiesFilePath, 'utf-8');
  return JSON.parse(data);
};

// JSON 파일 업데이트 함수
const updateStoriesFile = async (stories) => {
  await fs.writeFile(storiesFilePath, JSON.stringify({ stories }, null, 2), 'utf-8');
};

// 동화 생성 컨트롤러
export const createStory = async (req, res) => {
  try {
    const { prompt, childId } = req.body;
    const storiesData = await readStoriesFile();

    if (!prompt || !childId) {
      return res.status(400).json({
        status: 400,
        message: '동화 생성 키워드와 자녀 프로필ID가 필요합니다.',
      });
    }

    // 새로운 동화 생성
    const newStory = {
      storyId: Date.now(),
      title: '꼬마 용사와 동물 친구들의 모험',
      summary: 'AI가 생성한 동화입니다.',
      thumbnailUrl: 'https://cdn/default-story.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // JSON 파일에 새로운 동화 추가
    const updatedStories = [...storiesData.stories, newStory];
    await updateStoriesFile(updatedStories);

    // 성공 응답
    res.status(201).json({
      status: 201,
      message: '동화 생성에 성공했습니다.',
      data: newStory,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '동화 생성 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// 동화 목록 조회 컨트롤러
export const getStories = async (req, res) => {
  try {
    const { childId } = req.query;
    const storiesData = await readStoriesFile();

    if (!childId) {
      return res.status(400).json({
        status: 400,
        message: '자녀 프로필ID가 필요합니다.',
      });
    }

    const stories = storiesData.stories.map((story) => Story.fromJSON(story));

    res.status(200).json({
      status: 200,
      message: '동화 목록 조회에 성공했습니다.',
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '동화 목록 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

// 동화 삭제 컨트롤러
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const storiesData = await readStoriesFile();

    if (!storyId) {
      return res.status(400).json({
        status: 400,
        message: '삭제할 동화 ID가 필요합니다.',
      });
    }

    // 해당 ID의 동화 찾기
    const storyIndex = storiesData.stories.findIndex(
      (story) => story.storyId === parseInt(storyId)
    );

    if (storyIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: '해당 ID의 동화를 찾을 수 없습니다.',
      });
    }

    // 동화 삭제
    const updatedStories = storiesData.stories.filter(
      (story) => story.storyId !== parseInt(storyId)
    );
    await updateStoriesFile(updatedStories);

    res.status(200).json({
      status: 200,
      message: '동화가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '동화 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};

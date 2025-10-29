/* eslint-disable no-undef */
// mock-server/server.js
/**
 * 메인 서버 파일
 * Express 서버를 설정하고 실행합니다.
 * 미들웨어 설정과 라우트 연결을 담당합니다.
 */
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { TEST_USER } from './models/user.js';

const app = express();

// CORS 설정 - 프론트엔드에서의 API 요청을 허용
app.use(cors());
// JSON 요청 본문 파싱
app.use(express.json());

// 모든 요청을 콘솔에 출력하는 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// API 라우트 설정 - /api 경로로 시작하는 모든 요청을 routes로 전달
app.use('/api', routes);

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`테스트 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('테스트 계정:');
  console.log('이메일:', TEST_USER.email);
  console.log('비밀번호:', TEST_USER.password);
});

// mock-server/server.js
const express = require('express');
const cors = require('cors');
const app = express();

// CORS 설정
app.use(cors());
app.use(express.json());

// 테스트 계정 정보
const TEST_USER = {
  id: 1,
  email: 'test@example.com',
  password: '1234',
  name: '테스트 사용자',
};

// 로그인 API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // 입력값 검증
  if (!email || !password) {
    return res.status(400).json({
      message: '이메일과 비밀번호를 모두 입력해주세요.',
    });
  }

  // 테스트 계정 확인
  if (email === TEST_USER.email && password === TEST_USER.password) {
    return res.json({
      access_token: 'test-access-token-1234',
      refresh_token: 'test-refresh-token-5678',
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      },
    });
  }

  // 로그인 실패
  return res.status(401).json({
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  });
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`테스트 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('테스트 계정:');
  console.log('이메일:', TEST_USER.email);
  console.log('비밀번호:', TEST_USER.password);
});

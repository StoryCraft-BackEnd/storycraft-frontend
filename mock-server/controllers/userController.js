/**
 * 사용자 관련 컨트롤러 함수들
 */

// 내 정보 조회
export const getMyInfo = (req, res) => {
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
};

// 닉네임 수정
export const updateNickname = (req, res) => {
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
};

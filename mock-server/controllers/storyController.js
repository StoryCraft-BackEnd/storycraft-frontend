/**
 * 동화 관련 컨트롤러
 * 동화 생성, 조회 등의 비즈니스 로직을 처리합니다.
 */

// 동화 생성 컨트롤러
export const createStory = async (req, res) => {
  try {
    const { prompt, childId } = req.body;

    if (!prompt || !childId) {
      return res.status(400).json({
        status: 400,
        message: '동화 생성 키워드와 자녀 프로필ID가 필요합니다.',
      });
    }

    // 실제 구현에서는 여기서 AI 모델을 호출하여 동화를 생성합니다.
    // 현재는 목업 데이터를 반환합니다.
    const mockStory = {
      storyId: Date.now(),
      title: '꼬마 용사와 동물 친구들의 모험',
      content: '옛날 옛적에...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 성공 응답
    res.status(201).json({
      status: 201,
      message: '동화 생성에 성공했습니다.',
      data: mockStory,
    });
  } catch (error) {
    console.error('동화 생성 중 오류 발생:', error);
    res.status(500).json({
      status: 500,
      message: '동화 생성 중 오류가 발생했습니다.',
    });
  }
};

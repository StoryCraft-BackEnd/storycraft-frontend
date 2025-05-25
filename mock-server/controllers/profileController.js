import profiles from '../models/Profile.js';

// 사용자의 모든 프로필 조회
const getProfiles = (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: '자녀 프로필 목록 조회에 성공했습니다.',
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '프로필 조회 실패',
      error: error.message,
    });
  }
};

// 프로필 생성
const createProfile = (req, res) => {
  try {
    const { name, age, learning_level } = req.body;

    // 필수 필드 검증
    if (!name || !age) {
      return res.status(400).json({
        status: 400,
        message: '이름과 나이는 필수 입력 항목입니다.',
      });
    }

    const newProfile = {
      child_id: profiles.length + 1,
      name,
      age,
      learning_level: learning_level || '미정',
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);

    res.status(201).json({
      status: 201,
      message: '자녀 프로필이 생성되었습니다.',
      data: {
        child_id: newProfile.child_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '프로필 생성 실패',
      error: error.message,
    });
  }
};

// 프로필 수정
const updateProfile = (req, res) => {
  try {
    const { id } = req.params;
    const profileIndex = profiles.findIndex((profile) => profile.id === parseInt(id));

    if (profileIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: '해당 ID의 프로필을 찾을 수 없습니다.',
      });
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileIndex] = updatedProfile;

    res.status(200).json({
      status: 200,
      message: '프로필 수정에 성공했습니다.',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '프로필 수정 실패',
      error: error.message,
    });
  }
};

// 프로필 삭제
const deleteProfile = (req, res) => {
  try {
    const { id } = req.params;
    const profileIndex = profiles.findIndex((profile) => profile.child_id === parseInt(id));

    if (profileIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: '해당 ID의 프로필을 찾을 수 없습니다.',
      });
    }

    const deletedProfile = profiles[profileIndex];
    profiles.splice(profileIndex, 1);

    res.status(200).json({
      status: 200,
      message: '자녀 프로필이 삭제되었습니다.',
      data: {
        child_id: deletedProfile.child_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: '프로필 삭제 실패',
      error: error.message,
    });
  }
};

export { getProfiles, createProfile, updateProfile, deleteProfile };

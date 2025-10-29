import { profiles, writeProfiles } from '../models/Profile.js';

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
    if (!name || !age || !learning_level) {
      return res.status(400).json({
        status: 400,
        message: '이름, 나이, 학습 레벨은 필수 입력 항목입니다.',
      });
    }

    // 학습 레벨 검증
    if (!['초급', '중급', '고급'].includes(learning_level)) {
      return res.status(400).json({
        status: 400,
        message: '학습 레벨은 초급, 중급, 고급 중 하나여야 합니다.',
      });
    }

    // 새로운 프로필 생성
    const newProfile = {
      child_id: profiles.length + 1,
      name,
      age,
      learning_level,
      created_at: new Date().toISOString(),
    };

    // 프로필 배열에 추가
    profiles.push(newProfile);
    // 파일에 저장
    writeProfiles(profiles);

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
    const { learning_level } = req.body;
    const profileIndex = profiles.findIndex((profile) => profile.child_id === parseInt(id));

    if (profileIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: '해당 ID의 프로필을 찾을 수 없습니다.',
      });
    }

    // 학습 레벨 검증
    if (learning_level && !['초급', '중급', '고급'].includes(learning_level)) {
      return res.status(400).json({
        status: 400,
        message: '학습 레벨은 초급, 중급, 고급 중 하나여야 합니다.',
      });
    }

    // 프로필 업데이트
    const updatedProfile = {
      ...profiles[profileIndex],
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    profiles[profileIndex] = updatedProfile;
    // 파일에 저장
    writeProfiles(profiles);

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

    // 프로필 삭제
    const deletedProfile = profiles[profileIndex];
    profiles.splice(profileIndex, 1);
    // 파일에 저장
    writeProfiles(profiles);

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

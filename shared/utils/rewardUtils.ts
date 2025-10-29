import { rewardsApi } from '@/shared/api/rewardsApi';
import { Alert } from 'react-native';

// 포인트 지급 타입 정의
export type RewardType =
  | 'POINT_STORY_READ'
  | 'POINT_WORD_CLICK'
  | 'POINT_QUIZ_CORRECT'
  | 'POINT_DAILY_MISSION'
  | 'POINT_STREAK_3'
  | 'POINT_STREAK_7'
  | 'POINT_STREAK_14';

export type ContextType =
  | 'STORY_READ'
  | 'WORD_CLICK'
  | 'QUIZ_CORRECT'
  | 'DAILY_MISSION_COMPLETED'
  | 'STREAK_DAYS'
  | 'LEVEL_UP';

// 포인트 지급 함수
export const rewardPoints = async (
  childId: number,
  rewardType: RewardType,
  context: ContextType,
  storyId?: number
) => {
  try {
    const response = await rewardsApi.rewardPoints(childId, rewardType, context, storyId);

    // 레벨업 알림
    if (response.levelUp?.levelUp) {
      Alert.alert('레벨업! 🎉', `축하합니다! 레벨 ${response.levelUp.newLevel}이 되었습니다!`, [
        { text: '확인' },
      ]);
    }

    // 새로운 배지 알림
    if (response.newBadges.length > 0) {
      const badgeNames = response.newBadges.map((badge) => badge.badgeName).join(', ');
      Alert.alert('새로운 배지 획득! 🏆', `${badgeNames} 배지를 획득했습니다!`, [{ text: '확인' }]);
    }

    return response;
  } catch (error) {
    console.error('포인트 지급 실패:', error);
    throw error;
  }
};

// 학습 활동별 포인트 지급 함수들
export const rewardStoryRead = async (childId: number, storyId?: number) => {
  return await rewardPoints(childId, 'POINT_STORY_READ', 'STORY_READ', storyId);
};

export const rewardWordClick = async (childId: number) => {
  return await rewardPoints(childId, 'POINT_WORD_CLICK', 'WORD_CLICK');
};

export const rewardQuizCorrect = async (childId: number) => {
  return await rewardPoints(childId, 'POINT_QUIZ_CORRECT', 'QUIZ_CORRECT');
};

export const rewardDailyMission = async (childId: number) => {
  return await rewardPoints(childId, 'POINT_DAILY_MISSION', 'DAILY_MISSION_COMPLETED');
};

// 연속 학습 체크
export const checkStreak = async (childId: number) => {
  try {
    const response = await rewardsApi.checkStreak(childId);

    if (response.streakRewarded && response.rewardedPoint > 0) {
      Alert.alert(
        '연속 학습 보상! 🔥',
        `${response.currentStreak}일 연속 학습! ${response.rewardedPoint}포인트를 획득했습니다!`,
        [{ text: '확인' }]
      );
    }

    return response;
  } catch (error) {
    console.error('연속 학습 체크 실패:', error);
    throw error;
  }
};

// 데일리 미션 완료 체크
export const checkDailyMission = async (childId: number) => {
  try {
    const response = await rewardsApi.checkDailyMission(childId);

    if (response.rewardedPoint > 0) {
      Alert.alert(
        '데일리 미션 완료! 🎯',
        `모든 미션을 완료했습니다! ${response.rewardedPoint}포인트를 획득했습니다!`,
        [{ text: '확인' }]
      );
    } else if (response.alreadyClaimed) {
      Alert.alert('알림', '이미 오늘 데일리 미션 보상을 받았습니다.');
    } else {
      Alert.alert('알림', '아직 데일리 미션을 모두 완료하지 않았습니다.');
    }

    return response;
  } catch (error) {
    console.error('데일리 미션 체크 실패:', error);
    throw error;
  }
};

// 배지 체크
export const checkBadges = async (childId: number, activityType: string) => {
  try {
    const response = await rewardsApi.checkBadges(childId, activityType);

    if (response.newBadges.length > 0) {
      const badgeNames = response.newBadges.map((badge) => badge.badgeName).join(', ');

      // 퀴즈 관련 배지 체크 시에는 팝업을 표시하지 않음 (퀴즈창과 겹치는 문제 방지)
      if (activityType !== 'QUIZ_CORRECT') {
        Alert.alert('새로운 배지 획득! 🏆', `${badgeNames} 배지를 획득했습니다!`, [
          { text: '확인' },
        ]);
      } else {
        // 퀴즈 관련 배지 획득 시에는 콘솔 로그만 남김
        console.log('🏆 퀴즈 관련 배지 획득:', badgeNames);
      }
    }

    return response;
  } catch (error) {
    console.error('배지 체크 실패:', error);
    throw error;
  }
};

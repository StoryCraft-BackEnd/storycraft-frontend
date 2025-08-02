import { apiClient } from './client';

// 타입 정의
export interface RewardProfile {
  points: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  dailyMissionStatus: 'completed' | 'in_progress' | 'not_started';
}

export interface Badge {
  id: number;
  badgeCode: string;
  badgeName: string;
  awardedAt: string;
}

export interface DailyMission {
  missionCode: string;
  description: string;
  progressCount: number;
  completed: boolean;
}

export interface PointRewardResponse {
  rewardedPoint: number;
  totalPoint: number;
  levelUp: {
    levelUp: boolean;
    newLevel: number;
  } | null;
  newBadges: {
    badgeCode: string;
    badgeName: string;
  }[];
}

export interface RewardHistoryItem {
  date: string;
  type: 'POINT' | 'BADGE';
  rewardType?: string;
  context?: string;
  value?: number;
  badgeCode?: string;
  badgeName?: string;
}

export interface AvailableBadge {
  badgeCode: string;
  badgeName: string;
  condition: string;
  category: string;
}

// API 함수들
export const rewardsApi = {
  // GET /rewards/profiles - 자녀의 보상 현황 조회 API
  getProfile: async (childId: number): Promise<RewardProfile> => {
    const response = await apiClient.get(`/rewards/profiles?childId=${childId}`);
    return response.data.data;
  },

  // POST /rewards/points - 포인트 지급 API (모든 포인트 지급의 기본)
  rewardPoints: async (
    childId: number,
    rewardType: string,
    context: string
  ): Promise<PointRewardResponse> => {
    const response = await apiClient.post('/rewards/points', {
      childId,
      rewardType,
      context,
    });
    return response.data.data;
  },

  // GET /rewards/daily-mission - 데일리 미션 상태 조회 API
  getDailyMission: async (childId: number): Promise<DailyMission[]> => {
    const response = await apiClient.get(`/rewards/daily-mission?childId=${childId}`);
    return response.data.data;
  },

  // POST /rewards/daily-mission/check-daily-mission - 데일리 미션 완료 체크 API
  checkDailyMission: async (
    childId: number
  ): Promise<{
    rewardedPoint: number;
    alreadyClaimed: boolean;
  }> => {
    const response = await apiClient.post('/rewards/daily-mission/check-daily-mission', {
      childId,
    });
    return response.data.data;
  },

  // POST /rewards/check-streak - 연속 학습 조건 판단 API
  checkStreak: async (
    childId: number
  ): Promise<{
    currentStreak: number;
    streakRewarded: boolean;
    rewardedPoint: number;
  }> => {
    const response = await apiClient.post('/rewards/check-streak', {
      childId,
    });
    return response.data.data;
  },

  // POST /rewards/check-level-up - 레벨업 조건 판단 API
  checkLevelUp: async (
    childId: number
  ): Promise<{
    levelUp: boolean;
    newLevel: number;
  }> => {
    const response = await apiClient.post('/rewards/check-level-up', {
      childId,
    });
    return response.data.data;
  },

  // POST /rewards/check-badges - 배지 조건 판단 및 지급 여부 확인 API
  checkBadges: async (
    childId: number,
    activityType: string
  ): Promise<{
    newBadges: {
      badgeCode: string;
      badgeName: string;
    }[];
  }> => {
    const response = await apiClient.post('/rewards/check-badges', {
      childId,
      activityType,
    });
    return response.data.data;
  },

  // GET /rewards/badge/available - 시스템에서 제공하는 모든 배지 목록 조회 API
  getAvailableBadges: async (): Promise<AvailableBadge[]> => {
    const response = await apiClient.get('/rewards/badge/available');
    return response.data.data;
  },

  // GET /rewards/history - 보상 히스토리 조회 API
  getHistory: async (
    childId: number,
    from: string,
    to: string,
    type?: 'point' | 'badge'
  ): Promise<RewardHistoryItem[]> => {
    let url = `/rewards/history?childId=${childId}&from=${from}&to=${to}`;
    if (type) {
      url += `&type=${type}`;
    }
    const response = await apiClient.get(url);
    return response.data.data;
  },
};

import { apiClient } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.warn('🔥 checkStreak API 호출:', { childId });
    const response = await apiClient.post('/rewards/check-streak', {
      childId,
    });
    console.warn('🔥 checkStreak API 응답 전체:', response.data);
    console.warn('🔥 checkStreak API data 필드:', response.data.data);
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
    console.warn('🏆 getAvailableBadges API 호출 시작');
    console.warn('🌐 요청 URL:', '/rewards/badge/available');
    console.warn('🔧 API 클라이언트 설정:', {
      baseURL: apiClient.defaults.baseURL,
      timeout: apiClient.defaults.timeout,
    });

    // 인증 토큰 상태 확인
    try {
      const token = await AsyncStorage.getItem('token');
      console.warn('🔐 인증 토큰 상태:', token ? '토큰 있음' : '토큰 없음');
      if (token) {
        console.warn('🔐 토큰 일부:', token.substring(0, 20) + '...');
      }
    } catch (error) {
      console.warn('🔐 토큰 확인 실패:', error);
    }

    try {
      // 요청 전 헤더 확인
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      };
      console.warn('📋 요청 헤더:', requestConfig.headers);

      const response = await apiClient.get('/rewards/badge/available', requestConfig);
      console.warn('✅ getAvailableBadges API 응답 전체:', response.data);
      console.warn('📊 getAvailableBadges API data 필드:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ getAvailableBadges API 에러:', error);
      if (error.response) {
        console.error('❌ 서버 응답 에러:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
        // 요청 헤더도 확인
        console.error('📤 실제 전송된 요청 헤더:', error.response.config?.headers);
      }
      throw error;
    }
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

// 기존 getAvailableBadges 함수를 새로운 엔드포인트에 맞게 수정
export const getAvailableBadges = async (): Promise<AvailableBadge[]> => {
  const requestUrl = '/rewards/badges/available';
  const fullUrl = `${apiClient.defaults.baseURL}${requestUrl}`;

  console.log('🏆 배지 API 요청 시작...');
  console.log('🌐 요청 URL:', requestUrl);
  console.log('🔗 전체 URL:', fullUrl);
  console.log('🔧 API 클라이언트 설정:', {
    baseURL: apiClient.defaults.baseURL,
    timeout: apiClient.defaults.timeout,
  });

  try {
    const response = await apiClient.get(requestUrl);
    console.log('✅ 배지 API 응답 성공');
    console.log('📊 응답 데이터:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ 배지 목록 조회 실패:', error);
    if (error.response) {
      console.error('❌ 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.response.config?.url,
        method: error.response.config?.method,
      });
    }
    throw error;
  }
};

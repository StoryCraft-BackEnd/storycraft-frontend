/**
 * 학습시간 측정 및 추적 유틸리티
 *
 * 프로필 선택 후 메인화면 진입부터 앱 종료까지의 학습시간을 측정하고
 * 백엔드에 자동으로 저장하는 기능을 제공합니다.
 *
 * @author StoryCraft Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { saveLearningTime, type SaveLearningTimeRequest } from '../api/statisticsApi';
import { loadSelectedProfile } from '../../features/profile/profileStorage';

// ===== 상수 정의 =====

const LEARNING_TIME_STORAGE_KEY = 'learning_time_data';
const MIN_SAVE_INTERVAL = 5 * 60 * 1000; // 5분마다 저장

// ===== 타입 정의 =====

interface LearningTimeData {
  childId: number;
  startTime: number; // 시작 시간 (timestamp)
  totalMinutes: number; // 누적된 총 학습시간 (분)
  lastSaveTime: number; // 마지막 저장 시간 (timestamp)
  isActive: boolean; // 현재 학습 중인지 여부
}

// ===== 전역 변수 =====

let currentLearningData: LearningTimeData | null = null;
let appStateListener: any = null;

// ===== 핵심 함수들 =====

/**
 * 학습시간 측정 시작
 *
 * 프로필이 선택되고 메인화면에 진입할 때 호출됩니다.
 *
 * @param childId - 학습할 자녀의 ID
 */
export const startLearningTimeTracking = async (childId: number): Promise<void> => {
  try {
    console.log('⏰ 학습시간 측정 시작:', { childId });

    // 기존 데이터가 있다면 중단
    if (currentLearningData) {
      console.log('⚠️ 이미 학습시간 측정 중입니다. 기존 세션을 종료합니다.');
      await stopLearningTimeTracking();
    }

    // 새로운 학습 세션 시작
    const now = Date.now();
    currentLearningData = {
      childId,
      startTime: now,
      totalMinutes: 0,
      lastSaveTime: now,
      isActive: true,
    };

    // 로컬 스토리지에 저장
    await saveLearningTimeToStorage(currentLearningData);

    // 앱 상태 변화 감지 시작
    startAppStateListener();

    console.log('✅ 학습시간 측정 시작 완료');
  } catch (error) {
    console.error('❌ 학습시간 측정 시작 실패:', error);
  }
};

/**
 * 학습시간 측정 중단
 *
 * 앱 종료나 프로필 변경 시 호출됩니다.
 */
export const stopLearningTimeTracking = async (): Promise<void> => {
  try {
    if (!currentLearningData) {
      console.log('ℹ️ 측정 중인 학습시간이 없습니다.');
      return;
    }

    console.log('⏰ 학습시간 측정 중단:', {
      childId: currentLearningData.childId,
      totalMinutes: currentLearningData.totalMinutes,
    });

    // 현재까지의 학습시간을 최종 저장
    await saveLearningTimeToBackend();

    // 앱 상태 리스너 제거
    stopAppStateListener();

    // 전역 변수 초기화
    currentLearningData = null;

    // 로컬 스토리지에서 삭제
    await AsyncStorage.removeItem(LEARNING_TIME_STORAGE_KEY);

    console.log('✅ 학습시간 측정 중단 완료');
  } catch (error) {
    console.error('❌ 학습시간 측정 중단 실패:', error);
  }
};

/**
 * 현재 학습시간 데이터 조회
 */
export const getCurrentLearningData = (): LearningTimeData | null => {
  return currentLearningData;
};

/**
 * 학습시간 측정 상태 확인
 */
export const isLearningTimeTracking = (): boolean => {
  return currentLearningData?.isActive || false;
};

// ===== 앱 상태 관리 =====

/**
 * 앱 상태 변화 감지 시작
 */
const startAppStateListener = (): void => {
  // 기존 리스너가 있다면 정리
  if (appStateListener) {
    appStateListener = null;
  }

  appStateListener = (nextAppState: AppStateStatus) => {
    console.log('📱 앱 상태 변화:', nextAppState);

    if (nextAppState === 'active') {
      // 앱이 포그라운드로 돌아옴
      handleAppForeground();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // 앱이 백그라운드로 감
      handleAppBackground();
    }
  };

  // 새로운 리스너 등록
  AppState.addEventListener('change', appStateListener);
  console.log('👂 앱 상태 변화 감지 시작');
};

/**
 * 앱 상태 변화 감지 중단
 */
const stopAppStateListener = (): void => {
  if (appStateListener) {
    // React Native의 최신 버전에서는 removeEventListener가 지원되지 않으므로
    // 리스너를 null로 설정하여 가비지 컬렉션되도록 함
    appStateListener = null;
    console.log('👂 앱 상태 변화 감지 중단');
  }
};

/**
 * 앱 포그라운드 진입 처리
 */
const handleAppForeground = async (): Promise<void> => {
  try {
    if (!currentLearningData) return;

    console.log('📱 앱 포그라운드 진입');

    // 백그라운드에서 보낸 시간을 계산하여 누적
    const backgroundTime = calculateBackgroundTime();
    if (backgroundTime > 0) {
      currentLearningData.totalMinutes += backgroundTime;
      console.log(`⏰ 백그라운드 시간 누적: ${backgroundTime}분`);
    }

    // 학습시간을 활성화
    currentLearningData.isActive = true;
    currentLearningData.startTime = Date.now();

    // 로컬 스토리지 업데이트
    await saveLearningTimeToStorage(currentLearningData);
  } catch (error) {
    console.error('❌ 앱 포그라운드 처리 실패:', error);
  }
};

/**
 * 앱 백그라운드 진입 처리
 */
const handleAppBackground = async (): Promise<void> => {
  try {
    if (!currentLearningData) return;

    console.log('📱 앱 백그라운드 진입');

    // 현재까지의 학습시간을 계산하여 누적
    const foregroundTime = calculateForegroundTime();
    if (foregroundTime > 0) {
      currentLearningData.totalMinutes += foregroundTime;
      console.log(`⏰ 포그라운드 시간 누적: ${foregroundTime}분`);
    }

    // 학습시간을 비활성화
    currentLearningData.isActive = false;

    // 로컬 스토리지 업데이트
    await saveLearningTimeToStorage(currentLearningData);

    // 일정 시간이 지났다면 백엔드에 저장
    const timeSinceLastSave = Date.now() - currentLearningData.lastSaveTime;
    if (timeSinceLastSave >= MIN_SAVE_INTERVAL) {
      await saveLearningTimeToBackend();
    }
  } catch (error) {
    console.error('❌ 앱 백그라운드 처리 실패:', error);
  }
};

// ===== 시간 계산 함수들 =====

/**
 * 포그라운드에서 보낸 시간 계산 (분 단위)
 */
const calculateForegroundTime = (): number => {
  if (!currentLearningData || !currentLearningData.isActive) return 0;

  const now = Date.now();
  const elapsedMs = now - currentLearningData.startTime;
  return Math.floor(elapsedMs / (1000 * 60)); // 분 단위로 변환
};

/**
 * 백그라운드에서 보낸 시간 계산 (분 단위)
 *
 * 실제로는 정확한 백그라운드 시간을 측정하기 어려우므로
 * 앱이 비활성화된 시간을 추정합니다.
 */
const calculateBackgroundTime = (): number => {
  // 백그라운드 시간은 정확히 측정하기 어려우므로
  // 최소값(1분)을 반환하거나, 사용자가 설정한 최대값을 적용
  return 1; // 최소 1분으로 설정
};

// ===== 저장 함수들 =====

/**
 * 학습시간 데이터를 로컬 스토리지에 저장
 */
const saveLearningTimeToStorage = async (data: LearningTimeData): Promise<void> => {
  try {
    await AsyncStorage.setItem(LEARNING_TIME_STORAGE_KEY, JSON.stringify(data));
    console.log('💾 학습시간 데이터 로컬 저장 완료');
  } catch (error) {
    console.error('❌ 학습시간 데이터 로컬 저장 실패:', error);
  }
};

/**
 * 학습시간 데이터를 로컬 스토리지에서 불러오기
 */
export const loadLearningTimeFromStorage = async (): Promise<LearningTimeData | null> => {
  try {
    const stored = await AsyncStorage.getItem(LEARNING_TIME_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as LearningTimeData;
      console.log('📖 학습시간 데이터 로컬 불러오기 완료:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('❌ 학습시간 데이터 로컬 불러오기 실패:', error);
    return null;
  }
};

/**
 * 학습시간을 백엔드에 저장
 */
const saveLearningTimeToBackend = async (): Promise<void> => {
  try {
    if (!currentLearningData) {
      console.log('ℹ️ 저장할 학습시간 데이터가 없습니다.');
      return;
    }

    // 현재까지의 총 학습시간 계산
    const currentTime = calculateForegroundTime();
    const totalMinutes = currentLearningData.totalMinutes + currentTime;

    if (totalMinutes <= 0) {
      console.log('ℹ️ 저장할 학습시간이 없습니다.');
      return;
    }

    console.log('⏰ 백엔드에 학습시간 저장:', {
      childId: currentLearningData.childId,
      totalMinutes,
    });

    // 현재 시간을 YYYY-MM-DD HH:MM:SS 형식으로 포맷팅
    const now = new Date();
    const updatedAt = now.toISOString().slice(0, 19).replace('T', ' ');

    const request: SaveLearningTimeRequest = {
      childId: currentLearningData.childId,
      totalLearningTimeMinutes: totalMinutes,
      updatedAt,
    };

    // 백엔드 API 호출
    const response = await saveLearningTime(request);
    console.log('✅ 학습시간 백엔드 저장 성공:', response.message);

    // 저장 성공 시 로컬 데이터 업데이트
    if (currentLearningData) {
      currentLearningData.lastSaveTime = Date.now();
      currentLearningData.totalMinutes = 0; // 저장 완료 후 초기화
      await saveLearningTimeToStorage(currentLearningData);
    } else {
      console.warn('⚠️ currentLearningData가 null입니다. 로컬 업데이트를 건너뜁니다.');
    }
  } catch (error) {
    console.error('❌ 학습시간 백엔드 저장 실패:', error);
  }
};

// ===== 초기화 함수 =====

/**
 * 앱 시작 시 기존 학습시간 데이터 복원
 */
export const initializeLearningTimeTracker = async (): Promise<void> => {
  try {
    console.log('🔄 학습시간 추적기 초기화 시작');

    // 로컬 스토리지에서 기존 데이터 불러오기
    const storedData = await loadLearningTimeFromStorage();

    if (storedData) {
      // 24시간이 지난 데이터는 무효화
      const now = Date.now();
      const timeDiff = now - storedData.lastSaveTime;
      const oneDay = 24 * 60 * 60 * 1000;

      if (timeDiff > oneDay) {
        console.log('⏰ 24시간이 지난 학습시간 데이터를 삭제합니다.');
        await AsyncStorage.removeItem(LEARNING_TIME_STORAGE_KEY);
        return;
      }

      // 유효한 데이터라면 복원
      currentLearningData = storedData;
      console.log('📖 기존 학습시간 데이터 복원:', currentLearningData);

      // 앱 상태 감지 시작
      startAppStateListener();
    }

    console.log('✅ 학습시간 추적기 초기화 완료');
  } catch (error) {
    console.error('❌ 학습시간 추적기 초기화 실패:', error);
  }
};

// ===== 유틸리티 함수들 =====

/**
 * 현재까지의 총 학습시간 조회 (분 단위)
 */
export const getCurrentTotalLearningTime = (): number => {
  if (!currentLearningData) return 0;

  const currentTime = calculateForegroundTime();
  return currentLearningData.totalMinutes + currentTime;
};

/**
 * 학습시간을 시간:분 형식으로 포맷팅
 */
export const formatLearningTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}분`;
  } else if (remainingMinutes === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${remainingMinutes}분`;
  }
};

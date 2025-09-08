/**
 * 데일리 미션 화면 컴포넌트
 * 사용자의 포인트, 성취도, 일일 미션, 배지 등을 관리하는 화면입니다.
 * 연속 학습, 포인트, 레벨, 미션 진행률, 배지 현황을 종합적으로 표시합니다.
 */
// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  ScrollView, // 스크롤 가능한 컨테이너
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  Image, // 이미지 표시 컴포넌트
  Alert, // 알림 팝업 표시용
  ImageBackground, // 배경 이미지가 있는 컨테이너
} from 'react-native';
// AsyncStorage: 로컬 데이터 저장소 (보상 수령 상태 저장용)
import AsyncStorage from '@react-native-async-storage/async-storage';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router } from 'expo-router';
// 커스텀 테마 컴포넌트
import { ThemedText } from '@/components/ui/ThemedText';
// 데일리 미션 화면 전용 스타일
import { DailyMissionScreenStyles as styles } from '@/styles/DailyMissionScreen.styles';
// 뒤로가기 버튼 컴포넌트
import BackButton from '@/components/ui/BackButton';
// 아이콘 라이브러리
import { Ionicons } from '@expo/vector-icons';
// 배경 이미지 (밤하늘 배경)
import nightBg from '@/assets/images/background/night-bg.png';
// 포인트 아이콘 이미지
import pointImage from '@/assets/images/rewards/point_icon.png';
// 기본 성취 아이콘 이미지
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';

// 배지 이미지들 (각 배지 타입별 이미지 파일)
// 레벨 배지 이미지들 (사용자 레벨 달성 시 획득)
import badgeLevel1 from '@/assets/images/badge/BADGE_LEVEL_1.png'; // 레벨 1 달성
import badgeLevel5 from '@/assets/images/badge/BADGE_LEVEL_5.png'; // 레벨 5 달성
import badgeLevel10 from '@/assets/images/badge/BADGE_LEVEL_10.png'; // 레벨 10 달성
// 스토리 배지 이미지들 (스토리 완주 시 획득)
import badgeStory1 from '@/assets/images/badge/BADGE_STORY_1.png'; // 스토리 1개 완주
import badgeStory10 from '@/assets/images/badge/BADGE_STORY_10.png'; // 스토리 10개 완주
import badgeStory50 from '@/assets/images/badge/BADGE_STORY_50.png'; // 스토리 50개 완주
// 단어 배지 이미지들 (단어 학습 시 획득)
import badgeWord1 from '@/assets/images/badge/BADGE_WORD_1.png'; // 단어 1개 학습
import badgeWord100 from '@/assets/images/badge/BADGE_WORD_100.png'; // 단어 100개 학습
import badgeWord500 from '@/assets/images/badge/BADGE_WORD_500.png'; // 단어 500개 학습
// 퀴즈 배지 이미지들 (퀴즈 완료 시 획득)
import badgeQuiz1 from '@/assets/images/badge/BADGE_QUIZ_1.png'; // 퀴즈 1개 완료
import badgeQuiz10 from '@/assets/images/badge/BADGE_QUIZ_10.png'; // 퀴즈 10개 완료
import badgeQuiz50 from '@/assets/images/badge/BADGE_QUIZ_50.png'; // 퀴즈 50개 완료
// 연속 학습 배지 이미지들 (연속 학습 시 획득)
import badgeStreak3 from '@/assets/images/badge/BADGE_STREAK_3.png'; // 3일 연속 학습
import badgeStreak7 from '@/assets/images/badge/BADGE_STREAK_7.png'; // 7일 연속 학습
import badgeStreak14 from '@/assets/images/badge/BADGE_STREAK_14.png'; // 14일 연속 학습
import badgeStreak30 from '@/assets/images/badge/BADGE_STREAK_30.png'; // 30일 연속 학습
// 특별 배지 이미지들 (특별한 조건 달성 시 획득)
import badgeDaily7 from '@/assets/images/badge/BADGE_DAILY_7.png'; // 7일 연속 데일리 미션 완료
// 미션 아이콘 이미지들 (미션 타입별 아이콘)
import bookIcon from '@/assets/images/icons/book.png'; // 동화 읽기 미션 아이콘
import quizIcon from '@/assets/images/icons/quiz.png'; // 퀴즈 미션 아이콘
import dictionaryIcon from '@/assets/images/icons/dictionary.png'; // 단어 학습 미션 아이콘
import heartIcon from '@/assets/images/icons/heart.png'; // 기본 미션 아이콘
// 보상 관련 API 함수들과 타입 정의
import {
  rewardsApi, // 보상 관련 API 함수들
  RewardProfile, // 사용자 보상 프로필 타입
  DailyMission as ApiDailyMission, // API에서 받아오는 데일리 미션 타입
} from '@/shared/api/rewardsApi';
// 보상 관련 유틸리티 함수들
import { checkDailyMission, checkStreak } from '@/shared/utils/rewardUtils';
// 프로필 저장소에서 선택된 프로필 정보 로드
import { loadSelectedProfile } from '@/features/profile/profileStorage';

// screenWidth는 현재 사용되지 않으므로 제거

// 타입 정의
// 데일리 미션 타입 정의 (UI에서 사용하는 미션 정보)
interface DailyMission {
  id: number; // 미션 고유 ID
  title: string; // 미션 제목
  description: string; // 미션 설명
  reward: number; // 미션 완료 시 보상 포인트
  isCompleted: boolean; // 미션 완료 여부
  type: 'quiz' | 'story' | 'dictionary' | 'daily'; // 미션 타입
  progress: number; // 현재 진행도
  target: number; // 목표 진행도
}

// 배지 타입 정의 (배지 정보와 획득 여부)
interface Badge {
  badgeCode: string; // 배지 고유 코드
  badgeName: string; // 배지 이름
  isEarned: boolean; // 배지 획득 여부
  description: string; // 배지 설명
  category: 'basic' | 'milestone' | 'streak' | 'special'; // 배지 카테고리
}

// 사용자 통계 타입 정의 (사용자의 학습 현황 정보)
interface UserStats {
  points: number; // 보유 포인트
  level: number; // 현재 레벨
  achievements: number; // 획득한 배지 개수
  streakDays: number; // 연속 학습 일수
  totalStories: number; // 총 읽은 스토리 수
  totalWords: number; // 총 학습한 단어 수
  totalQuizzes: number; // 총 완료한 퀴즈 수
}

export default function DailyMissionScreen() {
  // 선택된 프로필 상태 (현재 사용 중인 프로필의 ID)
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // 상태 관리
  // 사용자 통계 상태 (포인트, 레벨, 성취도 등)
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0, // 보유 포인트
    level: 1, // 현재 레벨
    achievements: 0, // 획득한 배지 개수
    streakDays: 0, // 연속 학습 일수
    totalStories: 0, // 총 읽은 스토리 수
    totalWords: 0, // 총 학습한 단어 수
    totalQuizzes: 0, // 총 완료한 퀴즈 수
  });
  // rewardProfile은 API 응답을 저장하지만 UI에서 직접 사용하지 않음 (디버깅용)
  const [, setRewardProfile] = useState<RewardProfile | null>(null);
  // apiDailyMissions는 디버깅용으로만 사용 (API에서 받아온 원본 미션 데이터)
  const [, setApiDailyMissions] = useState<ApiDailyMission[]>([]);
  // isLoading은 현재 UI에서 사용하지 않음
  // const [, setIsLoading] = useState(false);

  // 데일리 미션 목록 상태 (3개의 기본 미션: 동화 읽기, 단어 학습, 퀴즈 도전)
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([
    {
      id: 1,
      title: '동화 읽기',
      description: '동화 1편 읽기',
      reward: 30, // 완료 시 30포인트 보상
      isCompleted: false,
      type: 'story',
      progress: 0, // 현재 진행도
      target: 1, // 목표: 1편 읽기
    },
    {
      id: 2,
      title: '단어 학습',
      description: '단어 10개 클릭',
      reward: 50, // 완료 시 50포인트 보상
      isCompleted: false,
      type: 'dictionary',
      progress: 0, // 현재 진행도
      target: 10, // 목표: 10개 단어 클릭
    },
    {
      id: 3,
      title: '퀴즈 도전',
      description: '퀴즈 10개 정답',
      reward: 100, // 완료 시 100포인트 보상
      isCompleted: false,
      type: 'quiz',
      progress: 0, // 현재 진행도
      target: 10, // 목표: 10개 퀴즈 정답
    },
  ]);

  // 보상 수령 상태 관리 (오늘의 데일리 미션 보상을 받았는지 여부)
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  // 보상 수령 상태를 로컬에 저장하는 함수 (오늘 날짜 기준으로 저장)
  const saveRewardClaimedStatus = async (claimed: boolean) => {
    try {
      const today = new Date().toDateString(); // 오늘 날짜 문자열 생성
      await AsyncStorage.setItem(`daily_reward_claimed_${today}`, JSON.stringify(claimed));
      console.log('💾 보상 수령 상태 저장:', { date: today, claimed });
    } catch (error) {
      console.error('❌ 보상 수령 상태 저장 실패:', error);
    }
  };

  // 보상 수령 상태를 로컬에서 불러오는 함수 (오늘 날짜 기준으로 로드)
  const loadRewardClaimedStatus = async (): Promise<boolean> => {
    try {
      const today = new Date().toDateString(); // 오늘 날짜 문자열 생성
      const claimed = await AsyncStorage.getItem(`daily_reward_claimed_${today}`);
      const isClaimed = claimed ? JSON.parse(claimed) : false; // 저장된 값이 있으면 파싱, 없으면 false
      console.log('📖 보상 수령 상태 로드:', { date: today, isClaimed });
      return isClaimed;
    } catch (error) {
      console.error('❌ 보상 수령 상태 로드 실패:', error);
      return false; // 에러 발생 시 기본값 false 반환
    }
  };

  // 배지 데이터 상태 (API에서 받아온 실제 데이터로 업데이트)
  const [badges, setBadges] = useState<Badge[]>([
    // 기본 학습 배지 (6개) - 초보자용 배지들
    {
      badgeCode: 'BADGE_STORY_1',
      badgeName: '첫 번째 동화 읽기',
      isEarned: false,
      description: '동화 1편 읽기',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_WORD_1',
      badgeName: '첫 단어 클릭',
      isEarned: false,
      description: '단어 클릭 1회',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_QUIZ_1',
      badgeName: '첫 퀴즈 도전',
      isEarned: false,
      description: '퀴즈 정답 1회',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_LEVEL_1',
      badgeName: '레벨 1 달성!',
      isEarned: false,
      description: '레벨 1 도달',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_LEVEL_5',
      badgeName: '레벨 5 달성!',
      isEarned: false,
      description: '레벨 5 도달',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_LEVEL_10',
      badgeName: '레벨 10 달성!',
      isEarned: false,
      description: '레벨 10 도달',
      category: 'basic',
    },

    // 누적 활동 배지 (6개)
    {
      badgeCode: 'BADGE_STORY_10',
      badgeName: '동화 마스터 10편',
      isEarned: false,
      description: '동화 10편 읽기',
      category: 'milestone',
    },
    {
      badgeCode: 'BADGE_STORY_50',
      badgeName: '동화 챔피언 50편',
      isEarned: false,
      description: '동화 50편 읽기',
      category: 'milestone',
    },
    {
      badgeCode: 'BADGE_WORD_100',
      badgeName: '단어 수집가',
      isEarned: false,
      description: '단어 100개 클릭',
      category: 'milestone',
    },
    {
      badgeCode: 'BADGE_WORD_500',
      badgeName: '단어 탐험가',
      isEarned: false,
      description: '단어 500개 클릭',
      category: 'milestone',
    },
    {
      badgeCode: 'BADGE_QUIZ_10',
      badgeName: '퀴즈 도전자',
      isEarned: false,
      description: '퀴즈 정답 10회',
      category: 'milestone',
    },
    {
      badgeCode: 'BADGE_QUIZ_50',
      badgeName: '퀴즈 마스터',
      isEarned: false,
      description: '퀴즈 정답 50회',
      category: 'milestone',
    },

    // 연속 학습 배지 (4개)
    {
      badgeCode: 'BADGE_STREAK_3',
      badgeName: '3일 연속 학습',
      isEarned: false,
      description: '3일 연속 학습',
      category: 'streak',
    },
    {
      badgeCode: 'BADGE_STREAK_7',
      badgeName: '7일 연속 학습',
      isEarned: false,
      description: '7일 연속 학습',
      category: 'streak',
    },
    {
      badgeCode: 'BADGE_STREAK_14',
      badgeName: '열공 천재',
      isEarned: false,
      description: '14일 연속 학습',
      category: 'streak',
    },
    {
      badgeCode: 'BADGE_STREAK_30',
      badgeName: '공부 습관왕',
      isEarned: false,
      description: '30일 연속 학습',
      category: 'streak',
    },

    // 특별 챌린지 배지 (1개)
    {
      badgeCode: 'BADGE_DAILY_7',
      badgeName: '데일리 마스터 7일 연속',
      isEarned: false,
      description: '데일리 미션 7일 연속 수행',
      category: 'special',
    },
  ]);

  // 미션 완료율 계산 (전체 미션 대비 완료된 미션의 비율)
  const completedMissions = dailyMissions.filter((mission) => mission.isCompleted).length; // 완료된 미션 개수
  const totalMissions = dailyMissions.length; // 전체 미션 개수
  const missionProgress = (completedMissions / totalMissions) * 100; // 완료율 백분율

  // dailyMissionReward는 현재 사용하지 않음 (API에서 보상 금액을 받아옴)
  // const dailyMissionReward = 100;

  // 레벨별 부제목 가져오기 함수 (사용자 레벨에 따른 칭호 반환)
  const getLevelSubtitle = (level: number) => {
    if (level >= 1 && level <= 3) return '마법사 견습생'; // 1-3레벨
    if (level >= 4 && level <= 6) return '마법사 수습생'; // 4-6레벨
    if (level >= 7 && level <= 9) return '마법사'; // 7-9레벨
    if (level >= 10 && level <= 12) return '고급 마법사'; // 10-12레벨
    if (level >= 13 && level <= 15) return '마법사 마스터'; // 13-15레벨
    if (level >= 16 && level <= 18) return '대마법사'; // 16-18레벨
    if (level >= 19 && level <= 20) return '전설의 마법사'; // 19-20레벨
    return '마법사 견습생'; // 기본값
  };

  // 미션 아이콘 가져오기 함수 (미션 타입에 따라 해당하는 아이콘 반환)
  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'story':
        return bookIcon; // 동화 읽기 미션 아이콘
      case 'quiz':
        return quizIcon; // 퀴즈 미션 아이콘
      case 'dictionary':
        return dictionaryIcon; // 단어 학습 미션 아이콘
      default:
        return heartIcon; // 기본 미션 아이콘
    }
  };

  // 배지 이미지 가져오기 함수 (배지 코드에 따라 해당하는 이미지 반환)
  const getBadgeImage = (badgeCode: string) => {
    const badgeImages: { [key: string]: any } = {
      // 레벨 배지 이미지 매핑
      BADGE_LEVEL_1: badgeLevel1,
      BADGE_LEVEL_5: badgeLevel5,
      BADGE_LEVEL_10: badgeLevel10,

      // 스토리 배지 이미지 매핑
      BADGE_STORY_1: badgeStory1,
      BADGE_STORY_10: badgeStory10,
      BADGE_STORY_50: badgeStory50,

      // 단어 배지 이미지 매핑
      BADGE_WORD_1: badgeWord1,
      BADGE_WORD_100: badgeWord100,
      BADGE_WORD_500: badgeWord500,

      // 퀴즈 배지 이미지 매핑
      BADGE_QUIZ_1: badgeQuiz1,
      BADGE_QUIZ_10: badgeQuiz10,
      BADGE_QUIZ_50: badgeQuiz50,

      // 연속 학습 배지 이미지 매핑
      BADGE_STREAK_3: badgeStreak3,
      BADGE_STREAK_7: badgeStreak7,
      BADGE_STREAK_14: badgeStreak14,
      BADGE_STREAK_30: badgeStreak30,

      // 특별 배지 이미지 매핑
      BADGE_DAILY_7: badgeDaily7,
    };

    return badgeImages[badgeCode] || achieveIcon; // 해당 배지 이미지가 없으면 기본 아이콘 반환
  };

  // 미션 클릭 핸들러 함수 (미션 클릭 시 해당 화면으로 이동)
  const handleMissionPress = (mission: DailyMission) => {
    if (mission.isCompleted) {
      Alert.alert('완료된 미션', '이미 완료된 미션입니다!');
      return;
    }

    // 미션 타입에 따라 해당 화면으로 이동
    switch (mission.type) {
      case 'quiz':
        router.push('/(main)/quiz'); // 퀴즈 화면으로 이동
        break;
      case 'story':
        router.push('/(main)/storylist'); // 스토리 목록 화면으로 이동
        break;
      case 'dictionary':
        router.push('/(main)/english-dictionary'); // 영어 사전 화면으로 이동
        break;
    }
  };

  // checkDailyMissionCompletion은 현재 사용하지 않음 (보상 받기 버튼에서 직접 처리)
  // const checkDailyMissionCompletion = async () => {
  //   const allCompleted = dailyMissions.every((mission) => mission.isCompleted);
  //   if (allCompleted) {
  //     try {
  //       const response = await checkDailyMission(1); // childId: 1

  //       if (response.rewardedPoint > 0) {
  //         // 포인트 업데이트
  //         setUserStats((prev) => ({
  //           ...prev,
  //           points: prev.points + response.rewardedPoint,
  //         }));

  //         // 보상 현황 다시 조회
  //         fetchRewardProfile();
  //       }
  //     } catch (error) {
  //       console.error('데일리 미션 완료 체크 실패:', error);
  //     }
  //   }
  // };

  // 선택된 프로필 로드 함수 (현재 사용 중인 프로필 정보 가져오기)
  const loadSelectedChildProfile = async () => {
    try {
      const profile = await loadSelectedProfile(); // 프로필 저장소에서 선택된 프로필 로드
      if (profile) {
        setSelectedChildId(profile.childId); // 선택된 프로필 ID 상태에 저장
        console.log('✅ 선택된 프로필 로드:', { childId: profile.childId, name: profile.name });
        return profile.childId; // 프로필 ID 반환
      } else {
        console.warn('⚠️ 선택된 프로필이 없음');
        return null; // 프로필이 없으면 null 반환
      }
    } catch (error) {
      console.error('❌ 프로필 로드 실패:', error);
      return null; // 에러 발생 시 null 반환
    }
  };

  // API 호출 함수들
  // 보상 현황 조회 함수 (사용자의 포인트, 레벨, 배지 현황 가져오기)
  const fetchRewardProfile = async (childId: number) => {
    console.warn('🌐 보상 현황 API 호출 시작!');
    try {
      const profile = await rewardsApi.getProfile(childId); // API에서 사용자 보상 프로필 조회
      console.warn('✅ 보상 현황 API 성공:', profile);
      setRewardProfile(profile); // API 응답 저장 (디버깅용)

      // userStats 업데이트 (연속 학습은 fetchStreakStatus에서 처리하므로 여기서는 건드리지 않음)
      setUserStats((prev) => ({
        ...prev,
        points: profile.points, // API에서 받은 포인트로 업데이트
        level: profile.level, // API에서 받은 레벨로 업데이트
        achievements: 0, // 임시로 0으로 설정 (나중에 배지 개수로 업데이트됨)
      }));

      // 배지 데이터 업데이트 (API에서 받아온 실제 데이터로)
      const updatedBadges = badges.map((badge) => {
        const apiBadge = profile.badges?.find((b) => b.badgeCode === badge.badgeCode);
        return {
          ...badge,
          isEarned: apiBadge ? !!apiBadge.awardedAt : false, // awardedAt이 있으면 획득한 것으로 판단
        };
      });
      setBadges(updatedBadges);

      // 획득한 배지 개수로 achievements 업데이트
      const earnedBadgeCount = updatedBadges.filter((b) => b.isEarned).length;
      setUserStats((prev) => ({
        ...prev,
        achievements: earnedBadgeCount, // 획득한 배지 개수로 업데이트
      }));

      console.log('🏆 배지 데이터 업데이트 완료:', earnedBadgeCount, '개 획득');
    } catch (error) {
      console.error('❌ 보상 현황 API 실패:', error);
      console.log('🔄 보상 현황 API 실패 - 기본값 사용');

      // API 실패 시 기본값으로 설정
      setUserStats((prev) => ({
        ...prev,
        points: 0, // 기본 포인트
        level: 1, // 기본 레벨
        streakDays: prev.streakDays, // 연속 학습은 이미 업데이트됨
        achievements: 0, // 기본 성취도
      }));

      // API 실패 시 배지 상태도 초기화
      const resetBadges = badges.map((badge) => ({
        ...badge,
        isEarned: false, // 모든 배지를 미획득 상태로 초기화
      }));
      setBadges(resetBadges);
      console.log('🔄 API 실패로 배지 상태 초기화 완료');
    }
  };

  // 연속 학습 체크 API 추가
  const fetchStreakStatus = async (childId: number) => {
    console.warn('🔥 연속 학습 체크 API 호출 시작!');
    try {
      const response = await rewardsApi.checkStreak(childId);
      console.warn('✅ 연속 학습 체크 API 응답 전체:', response);
      console.warn('📊 연속 학습 데이터:', {
        currentStreak: response.currentStreak,
        streakRewarded: response.streakRewarded,
        rewardedPoint: response.rewardedPoint,
      });

      // streakDays 업데이트 (첫날이어도 최소 1일로 표시)
      setUserStats((prev) => {
        const displayStreak = response.currentStreak === 0 ? 1 : response.currentStreak;
        const newStats = {
          ...prev,
          streakDays: displayStreak,
        };
        console.warn(
          `🔥 연속 학습 일수 업데이트: ${prev.streakDays} → ${displayStreak}일 (API: ${response.currentStreak}일)`
        );
        return newStats;
      });

      // 보상이 지급된 경우 알림
      if (response.streakRewarded && response.rewardedPoint > 0) {
        Alert.alert(
          '연속 학습 보상! 🔥',
          `${response.currentStreak}일 연속 학습! ${response.rewardedPoint}포인트를 획득했습니다!`,
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.error('❌ 연속 학습 체크 API 실패:', error);
      if (error.response) {
        console.error('❌ 서버 응답 에러:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error('❌ 네트워크 에러:', error.request);
      } else {
        console.error('❌ 기타 에러:', error.message);
      }
    }
  };

  const fetchDailyMissions = async (childId: number) => {
    console.warn('🌐 데일리 미션 API 호출 시작!');
    try {
      const missions = await rewardsApi.getDailyMission(childId);
      console.warn('✅ 데일리 미션 API 성공:', missions);
      setApiDailyMissions(missions);

      // API 데이터로 dailyMissions 업데이트
      const updatedMissions = dailyMissions.map((mission) => {
        let missionCode = '';

        // 미션 타입에 따른 코드 매핑
        switch (mission.type) {
          case 'story':
            missionCode = 'DAILY_STORY_READ';
            break;
          case 'dictionary':
            missionCode = 'DAILY_WORD_CLICK';
            break;
          case 'quiz':
            missionCode = 'DAILY_QUIZ_PASS';
            break;
          default:
            missionCode = '';
        }

        console.warn(`🔍 미션 매핑: ${mission.title} -> ${missionCode}`);

        const apiMission = missions.find((m) => m.missionCode === missionCode);
        console.warn(`📊 API 미션 찾기 결과:`, apiMission);

        if (apiMission) {
          console.warn(
            `✅ 미션 업데이트: ${mission.title} - 진행도: ${apiMission.progressCount}/${mission.target}, 완료: ${apiMission.completed}`
          );
          return {
            ...mission,
            isCompleted: apiMission.completed,
            progress: apiMission.progressCount,
          };
        } else {
          console.warn(`❌ API 미션을 찾을 수 없음: ${missionCode}`);
        }
        return mission;
      });

      console.warn('🔄 업데이트된 미션 데이터:', updatedMissions);
      setDailyMissions(updatedMissions);
    } catch (error) {
      console.error('❌ 데일리 미션 API 실패:', error);
      console.log('🔄 데일리 미션 API 실패 - 기본값 사용');

      // API 실패 시 기본 미션 상태 유지 (모두 미완료)
      const defaultMissions = dailyMissions.map((mission) => ({
        ...mission,
        isCompleted: false,
        progress: 0,
      }));
      setDailyMissions(defaultMissions);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    console.warn('🚀 데일리 미션 화면 로드됨!');
    console.warn('�� API 호출 시작!');

    const initializeData = async () => {
      try {
        // 0. 선택된 프로필 로드
        console.warn('👤 0단계: 선택된 프로필 로드 시작');
        const childId = await loadSelectedChildProfile();

        if (!childId) {
          console.warn('⚠️ 선택된 프로필이 없어서 초기화 중단');
          return;
        }

        // 1. 보상 수령 상태 로드
        console.warn('💾 1단계: 보상 수령 상태 로드 시작');
        const claimedStatus = await loadRewardClaimedStatus();
        setIsRewardClaimed(claimedStatus);

        // 2. 연속 학습 체크
        console.warn('🔥 2단계: 연속 학습 체크 시작');
        await fetchStreakStatus(childId);

        // 3. 보상 현황 조회
        console.warn('💰 3단계: 보상 현황 조회 시작');
        await fetchRewardProfile(childId);

        // 4. 데일리 미션 조회
        console.warn('📋 4단계: 데일리 미션 조회 시작');
        await fetchDailyMissions(childId);

        console.warn('✅ 모든 API 호출 완료!');
      } catch (error) {
        console.error('❌ 초기화 중 에러 발생:', error);
      }
    };

    initializeData();
  }, []);

  // CircularProgress 컴포넌트는 현재 사용하지 않음
  // const CircularProgress = ({ progress, size = 80, strokeWidth = 8, color = '#4CAF50' }) => {
  //   const radius = (size - strokeWidth) / 2;
  //   const circumference = radius * 2 * Math.PI;
  //   const strokeDashoffset = circumference - (progress / 100) * circumference;

  //   return (
  //     <View style={styles.circularProgressContainer}>
  //       <View style={[styles.circularProgress, { width: size, height: size }]}>
  //         <View
  //           style={[
  //             styles.circularProgressTrack,
  //             {
  //               width: size,
  //               height: size,
  //               borderRadius: size / 2,
  //               borderWidth: strokeWidth,
  //             },
  //           ]}
  //         />
  //         <View
  //           style={[
  //             styles.circularProgressFill,
  //             {
  //               width: size,
  //               height: size,
  //               borderRadius: size / 2,
  //               borderWidth: strokeWidth,
  //               borderColor: color,
  //               transform: [{ rotate: '-90deg' }],
  //             },
  //           ]}
  //         />
  //       </View>
  //       <Text style={styles.circularProgressText}>{Math.round(progress)}%</Text>
  //     </View>
  //   );
  // };

  return (
    <ImageBackground source={nightBg} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* 헤더 (뒤로가기 버튼과 제목) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              position: 'absolute',
              top: 18,
              left: 12,
              zIndex: 10,
            }}
            onPress={() => router.push('/(main)')} // 메인 화면으로 이동
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>데일리 미션</ThemedText>
          <View style={{ width: 60 }} /> {/* 헤더 균형을 위한 빈 공간 */}
        </View>

        <ScrollView
          style={styles.contentContainer}
          horizontal={true} // 가로 스크롤 설정
          showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
          pagingEnabled={false} // 페이징 비활성화
        >
          <View style={styles.scrollContainer}>
            {/* 연속 학습 섹션 - 원형 진행률 (연속 학습 일수 표시) */}
            <View style={styles.streakSection}>
              <View style={styles.streakCircle}>
                <Text style={styles.fireIcon}>🔥</Text>
                <Text style={styles.streakNumber}>{userStats.streakDays}</Text>
                <Text style={styles.streakLabel}>일 연속</Text>
              </View>
              <Text style={styles.streakTitle}>연속 학습 중!</Text>
              <Text style={styles.streakSubtitle}>화력 상승!</Text>
            </View>

            {/* 포인트 섹션 - 단일 색상으로 통일 (보유 포인트 표시) */}
            <View style={styles.pointsSection}>
              <View style={styles.pointsHeader}>
                <Image source={pointImage} style={styles.pointsIcon} />
                <Text style={styles.pointsTitle}>포인트</Text>
              </View>
              <Text style={styles.pointsValue}>{userStats.points.toLocaleString()}</Text>
              <TouchableOpacity
                style={styles.rewardHistoryButton}
                onPress={() => {
                  router.push('/(main)/daily-mission/reward-history'); // 보상 내역 화면으로 이동
                }}
              >
                <Text style={styles.rewardHistoryButtonText}>보상 내역</Text>
              </TouchableOpacity>
            </View>

            {/* 레벨 섹션 - 카드 스타일 (현재 레벨과 칭호 표시) */}
            <View style={styles.levelCard}>
              <Text style={styles.levelTitle}>Level {userStats.level}</Text>
              <Text style={styles.levelSubtitle}>{getLevelSubtitle(userStats.level)}</Text>
            </View>

            {/* 오늘의 달성도 섹션 - 세로 진행률 바 */}
            <View style={styles.achievementSection}>
              <Text style={styles.achievementTitle}>오늘의 달성도</Text>
              <Text style={styles.achievementCount}>
                {completedMissions}/{totalMissions}
              </Text>

              <View style={styles.achievementBars}>
                <View style={styles.achievementBar}>
                  <Text style={styles.achievementBarLabel}>동화</Text>
                  <View style={styles.achievementBarContainer}>
                    <View
                      style={[
                        styles.achievementBarFill,
                        {
                          width: `${((dailyMissions.find((m) => m.type === 'story')?.progress || 0) / (dailyMissions.find((m) => m.type === 'story')?.target || 1)) * 100}%`,
                          backgroundColor: '#4CAF50',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.achievementBarText}>
                    {dailyMissions.find((m) => m.type === 'story')?.progress || 0}/
                    {dailyMissions.find((m) => m.type === 'story')?.target || 1}
                  </Text>
                </View>

                <View style={styles.achievementBar}>
                  <Text style={styles.achievementBarLabel}>단어</Text>
                  <View style={styles.achievementBarContainer}>
                    <View
                      style={[
                        styles.achievementBarFill,
                        {
                          width: `${((dailyMissions.find((m) => m.type === 'dictionary')?.progress || 0) / (dailyMissions.find((m) => m.type === 'dictionary')?.target || 10)) * 100}%`,
                          backgroundColor: '#9C27B0',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.achievementBarText}>
                    {dailyMissions.find((m) => m.type === 'dictionary')?.progress || 0}/
                    {dailyMissions.find((m) => m.type === 'dictionary')?.target || 10}
                  </Text>
                </View>

                <View style={styles.achievementBar}>
                  <Text style={styles.achievementBarLabel}>퀴즈</Text>
                  <View style={styles.achievementBarContainer}>
                    <View
                      style={[
                        styles.achievementBarFill,
                        {
                          width: `${((dailyMissions.find((m) => m.type === 'quiz')?.progress || 0) / (dailyMissions.find((m) => m.type === 'quiz')?.target || 10)) * 100}%`,
                          backgroundColor: '#2196F3',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.achievementBarText}>
                    {dailyMissions.find((m) => m.type === 'quiz')?.progress || 0}/
                    {dailyMissions.find((m) => m.type === 'quiz')?.target || 10}
                  </Text>
                </View>
              </View>

              <View style={styles.totalProgressContainer}>
                <Text style={styles.totalProgressText}>
                  총 진행률 {Math.round(missionProgress)}%
                </Text>
                <View style={styles.totalProgressBar}>
                  <View style={[styles.totalProgressFill, { width: `${missionProgress}%` }]} />
                </View>
                {completedMissions === totalMissions &&
                  (isRewardClaimed ? (
                    <View style={styles.claimedRewardContainer}>
                      <Text style={styles.claimedRewardText}>✓ 수령 완료</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.claimRewardButton}
                      onPress={async () => {
                        if (!selectedChildId) {
                          Alert.alert('오류', '선택된 프로필이 없습니다.');
                          return;
                        }

                        console.warn('🎯 데일리 미션 보상 받기 버튼 클릭!');
                        try {
                          const response = await checkDailyMission(selectedChildId);
                          console.warn('✅ 데일리 미션 보상 API 성공:', response);

                          if (response.alreadyClaimed) {
                            Alert.alert(
                              '이미 받은 보상',
                              '오늘의 데일리 미션 보상을 이미 받았습니다.'
                            );
                            // 이미 받은 보상이면 수령 완료 상태로 변경
                            setIsRewardClaimed(true);
                            // 로컬에 상태 저장
                            await saveRewardClaimedStatus(true);
                          } else if (response.rewardedPoint > 0) {
                            Alert.alert(
                              '보상 지급 완료!',
                              `+${response.rewardedPoint} 포인트를 획득했습니다! 🎉`
                            );
                            // 포인트 업데이트
                            setUserStats((prev) => ({
                              ...prev,
                              points: prev.points + response.rewardedPoint,
                            }));
                            // 보상 수령 완료 상태로 변경
                            setIsRewardClaimed(true);
                            // 로컬에 상태 저장
                            await saveRewardClaimedStatus(true);
                            // 보상 현황 다시 조회
                            fetchRewardProfile(selectedChildId);
                          } else {
                            Alert.alert(
                              '미션 미완료',
                              '모든 데일리 미션을 완료해야 보상을 받을 수 있습니다.'
                            );
                          }
                        } catch (error) {
                          console.error('❌ 데일리 미션 보상 API 실패:', error);
                          Alert.alert('오류', '보상 지급에 실패했습니다.');
                        }
                      }}
                    >
                      <Text style={styles.claimRewardButtonText}>보상 받기</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {/* 미션 섹션들 - 다양한 스타일 */}
            {dailyMissions.map((mission) => (
              <TouchableOpacity
                key={mission.id}
                style={[
                  styles.missionItem,
                  mission.isCompleted && styles.completedMissionItem,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
                onPress={() => handleMissionPress(mission)}
              >
                <View style={styles.missionHeader}>
                  <Image source={getMissionIcon(mission.type)} style={styles.missionIcon} />
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                </View>

                <View style={styles.missionProgressContainer}>
                  <Text style={styles.missionProgressText}>
                    {mission.progress}/{mission.target} 완료
                  </Text>
                  <View style={styles.missionProgressBar}>
                    <View
                      style={[
                        styles.missionProgressFill,
                        { width: `${(mission.progress / mission.target) * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.missionReward}>
                  <Text style={styles.missionRewardText}>+{mission.reward}P</Text>
                </View>

                {mission.isCompleted && (
                  <View style={styles.completedOverlay}>
                    <Text style={styles.completedText}>✓ 완료</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* 배지 섹션 - 획득한 배지 세로 배치 + 전체보기 버튼 */}
            <View style={styles.badgeSection}>
              <Text style={styles.badgeTitle}>획득 배지</Text>
              <View style={styles.badgeVerticalGrid}>
                {badges
                  .filter((badge) => badge.isEarned)
                  .slice(0, 3)
                  .map((badge) => (
                    <View key={badge.badgeCode} style={styles.badgeVerticalSlot}>
                      <View style={styles.badgeItem}>
                        <View style={styles.badgeIconContainer}>
                          <Image source={getBadgeImage(badge.badgeCode)} style={styles.badgeIcon} />
                        </View>
                        <Text style={styles.badgeName}>{badge.badgeName}</Text>
                      </View>
                    </View>
                  ))}
              </View>
              <Text style={styles.badgeCount}>총 {userStats.achievements}개 획득!</Text>
              <TouchableOpacity
                style={styles.viewAllBadgesButton}
                onPress={() => router.push('./badges')}
              >
                <Text style={styles.viewAllBadgesButtonText}>전체 보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

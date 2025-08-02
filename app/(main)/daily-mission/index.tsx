/**
 * 데일리 미션 화면 컴포넌트
 * 사용자의 포인트, 성취도, 일일 미션, 배지 등을 관리하는 화면입니다.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { DailyMissionScreenStyles as styles } from '@/styles/DailyMissionScreen.styles';
import BackButton from '@/components/ui/BackButton';
import nightBg from '@/assets/images/background/night-bg.png';
import pointImage from '@/assets/images/rewards/point_icon.png';
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';
import bookIcon from '@/assets/images/icons/book.png';
import quizIcon from '@/assets/images/icons/quiz.png';
import dictionaryIcon from '@/assets/images/icons/dictionary.png';
import heartIcon from '@/assets/images/icons/heart.png';

const { width: screenWidth } = Dimensions.get('window');

// 타입 정의
interface DailyMission {
  id: number;
  title: string;
  description: string;
  reward: number;
  isCompleted: boolean;
  type: 'quiz' | 'story' | 'dictionary' | 'daily';
  progress: number;
  target: number;
}

interface Badge {
  badgeCode: string;
  badgeName: string;
  isEarned: boolean;
  description: string;
  category: 'basic' | 'milestone' | 'streak' | 'special';
}

interface UserStats {
  points: number;
  level: number;
  achievements: number;
  streakDays: number;
  totalStories: number;
  totalWords: number;
  totalQuizzes: number;
}

export default function DailyMissionScreen() {
  // 상태 관리
  const [userStats, setUserStats] = useState<UserStats>({
    points: 1250,
    level: 3,
    achievements: 8,
    streakDays: 5,
    totalStories: 12,
    totalWords: 45,
    totalQuizzes: 23,
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([
    {
      id: 1,
      title: '동화 읽기',
      description: '동화 1편 읽기',
      reward: 30,
      isCompleted: false,
      type: 'story',
      progress: 0,
      target: 1,
    },
    {
      id: 2,
      title: '단어 학습',
      description: '단어 10개 클릭',
      reward: 50,
      isCompleted: false,
      type: 'dictionary',
      progress: 3,
      target: 10,
    },
    {
      id: 3,
      title: '퀴즈 도전',
      description: '퀴즈 10개 정답',
      reward: 100,
      isCompleted: false,
      type: 'quiz',
      progress: 7,
      target: 10,
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    // 기본 학습 배지
    {
      badgeCode: 'BADGE_STORY_1',
      badgeName: '첫 번째 동화 읽기',
      isEarned: true,
      description: '동화 1편 읽기',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_WORD_1',
      badgeName: '첫 단어 클릭',
      isEarned: true,
      description: '단어 클릭 1회',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_QUIZ_1',
      badgeName: '첫 퀴즈 도전',
      isEarned: true,
      description: '퀴즈 정답 1회',
      category: 'basic',
    },
    {
      badgeCode: 'BADGE_LEVEL_1',
      badgeName: '레벨 1 달성!',
      isEarned: true,
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

    // 누적 활동 배지
    {
      badgeCode: 'BADGE_STORY_10',
      badgeName: '동화 마스터 10편',
      isEarned: true,
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
      badgeCode: 'BADGE_QUIZ_10',
      badgeName: '퀴즈 도전자',
      isEarned: true,
      description: '퀴즈 정답 10회',
      category: 'milestone',
    },

    // 연속 학습 배지
    {
      badgeCode: 'BADGE_STREAK_3',
      badgeName: '3일 연속 학습',
      isEarned: true,
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
  ]);

  // 미션 완료율 계산
  const completedMissions = dailyMissions.filter((mission) => mission.isCompleted).length;
  const totalMissions = dailyMissions.length;
  const missionProgress = (completedMissions / totalMissions) * 100;

  // 데일리 미션 완료 시 보상
  const dailyMissionReward = 100;

  // 미션 아이콘 가져오기
  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'story':
        return bookIcon;
      case 'quiz':
        return quizIcon;
      case 'dictionary':
        return dictionaryIcon;
      default:
        return heartIcon;
    }
  };

  // 미션 클릭 핸들러
  const handleMissionPress = (mission: DailyMission) => {
    if (mission.isCompleted) {
      Alert.alert('완료된 미션', '이미 완료된 미션입니다!');
      return;
    }

    // 미션 타입에 따라 해당 화면으로 이동
    switch (mission.type) {
      case 'quiz':
        router.push('/(main)/quiz-collection');
        break;
      case 'story':
        router.push('/(main)/storylist');
        break;
      case 'dictionary':
        router.push('/(main)/english-dictionary');
        break;
    }
  };

  // 데일리 미션 완료 체크
  const checkDailyMissionCompletion = () => {
    const allCompleted = dailyMissions.every((mission) => mission.isCompleted);
    if (allCompleted) {
      Alert.alert(
        '데일리 미션 완료! 🎉',
        `모든 미션을 완료했습니다!\n+${dailyMissionReward} 포인트를 획득했습니다!`,
        [
          {
            text: '확인',
            onPress: () => {
              setUserStats((prev) => ({
                ...prev,
                points: prev.points + dailyMissionReward,
              }));
              // TODO: API 호출 - /rewards/check-daily-mission
            },
          },
        ]
      );
    }
  };

  // 개발용 미션 완료 버튼
  const completeRandomMission = () => {
    const incompleteMissions = dailyMissions.filter((m) => !m.isCompleted);
    if (incompleteMissions.length > 0) {
      const randomMission =
        incompleteMissions[Math.floor(Math.random() * incompleteMissions.length)];
      setDailyMissions((prev) =>
        prev.map((mission) =>
          mission.id === randomMission.id
            ? { ...mission, isCompleted: true, progress: mission.target }
            : mission
        )
      );

      // 포인트 지급
      setUserStats((prev) => ({
        ...prev,
        points: prev.points + randomMission.reward,
      }));

      Alert.alert(
        '미션 완료!',
        `${randomMission.title} 완료!\n+${randomMission.reward} 포인트 획득!`
      );

      // 데일리 미션 완료 체크
      setTimeout(checkDailyMissionCompletion, 500);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    // TODO: API 호출들
    // 1. /rewards/profiles - 사용자 보상 현황 조회
    // 2. /rewards/daily-mission - 데일리 미션 상태 조회
    // 3. /rewards/badges/available - 배지 목록 조회
  }, []);

  // 원형 진행률 컴포넌트
  const CircularProgress = ({ progress, size = 80, strokeWidth = 8, color = '#4CAF50' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <View style={[styles.circularProgress, { width: size, height: size }]}>
          <View
            style={[
              styles.circularProgressTrack,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
              },
            ]}
          />
          <View
            style={[
              styles.circularProgressFill,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          />
        </View>
        <Text style={styles.circularProgressText}>{Math.round(progress)}%</Text>
      </View>
    );
  };

  return (
    <ImageBackground source={nightBg} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <BackButton />
          <ThemedText style={styles.title}>데일리 미션</ThemedText>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        >
          {/* 연속 학습 섹션 - 원형 진행률 */}
          <View style={styles.streakSection}>
            <View style={styles.streakCircle}>
              <Text style={styles.fireIcon}>🔥</Text>
              <Text style={styles.streakNumber}>{userStats.streakDays}</Text>
              <Text style={styles.streakLabel}>일 연속</Text>
            </View>
            <Text style={styles.streakTitle}>연속 학습 중!</Text>
            <Text style={styles.streakSubtitle}>화력 상승!</Text>
          </View>

          {/* 포인트 섹션 - 단일 색상으로 통일 */}
          <View style={styles.pointsSection}>
            <View style={styles.pointsHeader}>
              <Image source={pointImage} style={styles.pointsIcon} />
              <Text style={styles.pointsTitle}>포인트</Text>
            </View>
            <Text style={styles.pointsValue}>{userStats.points.toLocaleString()}</Text>
          </View>

          {/* 레벨 섹션 - 카드 스타일 */}
          <View style={styles.levelCard}>
            <Text style={styles.levelTitle}>Level {userStats.level}</Text>
            <Text style={styles.levelSubtitle}>마법사 견습생</Text>
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelProgressBar}>
                <View style={[styles.levelProgressFill, { width: '67%' }]} />
              </View>
              <Text style={styles.levelProgressText}>67% to Level 4</Text>
            </View>
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
                      { width: '100%', backgroundColor: '#4CAF50' },
                    ]}
                  />
                </View>
                <Text style={styles.achievementBarText}>3/3</Text>
              </View>

              <View style={styles.achievementBar}>
                <Text style={styles.achievementBarLabel}>단어</Text>
                <View style={styles.achievementBarContainer}>
                  <View
                    style={[
                      styles.achievementBarFill,
                      { width: '40%', backgroundColor: '#9C27B0' },
                    ]}
                  />
                </View>
                <Text style={styles.achievementBarText}>2/5</Text>
              </View>

              <View style={styles.achievementBar}>
                <Text style={styles.achievementBarLabel}>퀴즈</Text>
                <View style={styles.achievementBarContainer}>
                  <View
                    style={[
                      styles.achievementBarFill,
                      { width: '100%', backgroundColor: '#2196F3' },
                    ]}
                  />
                </View>
                <Text style={styles.achievementBarText}>4/4</Text>
              </View>
            </View>

            <View style={styles.totalProgressContainer}>
              <Text style={styles.totalProgressText}>총 진행률 75%</Text>
              <View style={styles.totalProgressBar}>
                <View style={[styles.totalProgressFill, { width: '75%' }]} />
              </View>
            </View>
          </View>

          {/* 미션 섹션들 - 다양한 스타일 */}
          {dailyMissions.map((mission, index) => (
            <TouchableOpacity
              key={mission.id}
              style={[
                styles.missionItem,
                mission.isCompleted && styles.completedMissionItem,
                {
                  backgroundColor:
                    index % 2 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
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

          {/* 배지 섹션 - 세로 배치로 개선 */}
          <View style={styles.badgeSection}>
            <Text style={styles.badgeTitle}>획득 배지</Text>
            <View style={styles.badgeVerticalGrid}>
              {badges
                .filter((badge) => badge.isEarned)
                .slice(0, 3)
                .map((badge, index) => (
                  <View key={badge.badgeCode} style={styles.badgeVerticalSlot}>
                    {index === 0 ? (
                      <View style={styles.badgeVerticalItem}>
                        <View style={styles.badgeIconContainer}>
                          <Image source={achieveIcon} style={styles.badgeIcon} />
                        </View>
                        <Text style={styles.badgeName}>{badge.badgeName}</Text>
                      </View>
                    ) : (
                      <View style={styles.emptyBadgeSlot}>
                        <Text style={styles.plusIcon}>+</Text>
                      </View>
                    )}
                  </View>
                ))}
            </View>
            <Text style={styles.badgeCount}>총 {userStats.achievements}개 획득!</Text>
          </View>

          {/* 개발용 도구 섹션 - 버튼 스타일 */}
          <View style={styles.devSection}>
            <Text style={styles.devTitle}>개발용 도구</Text>
            <TouchableOpacity style={styles.devButton} onPress={completeRandomMission}>
              <Text style={styles.devButtonText}>랜덤 미션 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => {
                // TODO: API 호출 - /rewards/check-streak
                Alert.alert('스트릭 체크', '연속 학습 조건을 확인합니다.');
              }}
            >
              <Text style={styles.devButtonText}>스트릭 체크</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

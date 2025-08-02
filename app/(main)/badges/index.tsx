/**
 * @description
 * StoryCraft 배지 전체 보기 페이지
 * 사용자가 획득한 배지와 미획득 배지를 탭으로 필터링하여 볼 수 있는 화면입니다.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import { BadgesScreenStyles } from '@/styles/BadgesScreen.styles';
import BackButton from '@/components/ui/BackButton';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';

// 탭 네비게이션 데이터
const TABS = [
  { key: 'all', label: '전체 배지', iconName: 'trophy-outline' as const },
  { key: 'earned', label: '획득한 배지', iconName: 'checkmark-circle-outline' as const },
  { key: 'unearned', label: '미획득 배지', iconName: 'add-circle-outline' as const },
];

// 배지 타입 정의
interface Badge {
  badgeCode: string;
  badgeName: string;
  isEarned: boolean;
  category: string;
  description: string;
}

/**
 * 배지 전체 보기 화면의 메인 컴포넌트
 * 사용자가 획득한 배지와 미획득 배지를 탭으로 필터링하여 볼 수 있습니다.
 */
export default function BadgesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [badges, setBadges] = useState<Badge[]>([]);

  // 컴포넌트 마운트 시 배지 데이터 로드
  useEffect(() => {
    // 실제 배지 시스템에 맞는 배지 데이터 초기화
    const allBadges: Badge[] = [
      // 기본 학습 배지 (Basic Learning Badges)
      {
        badgeCode: 'BADGE_STORY_1',
        badgeName: '첫 번째 동화 읽기',
        isEarned: true,
        category: 'basic',
        description: '동화 1편 읽기',
      },
      {
        badgeCode: 'BADGE_WORD_1',
        badgeName: '첫 단어 클릭',
        isEarned: true,
        category: 'basic',
        description: '단어 클릭 1회',
      },
      {
        badgeCode: 'BADGE_QUIZ_1',
        badgeName: '첫 퀴즈 도전',
        isEarned: true,
        category: 'basic',
        description: '퀴즈 정답 1회',
      },
      {
        badgeCode: 'BADGE_LEVEL_1',
        badgeName: '레벨 1 달성!',
        isEarned: true,
        category: 'basic',
        description: '레벨 1 도달 시',
      },
      {
        badgeCode: 'BADGE_LEVEL_5',
        badgeName: '레벨 5 달성!',
        isEarned: false,
        category: 'basic',
        description: '누적 포인트 기준 레벨 5 도달',
      },
      {
        badgeCode: 'BADGE_LEVEL_10',
        badgeName: '레벨 10 달성!',
        isEarned: false,
        category: 'basic',
        description: '누적 포인트 기준 레벨 10 도달',
      },

      // 누적 활동 배지 (Milestone Badges)
      {
        badgeCode: 'BADGE_STORY_10',
        badgeName: '동화 마스터 10편',
        isEarned: true,
        category: 'milestone',
        description: '동화 10편 읽기',
      },
      {
        badgeCode: 'BADGE_STORY_50',
        badgeName: '동화 챔피언 50편',
        isEarned: false,
        category: 'milestone',
        description: '동화 50편 읽기',
      },
      {
        badgeCode: 'BADGE_WORD_100',
        badgeName: '단어 수집가',
        isEarned: true,
        category: 'milestone',
        description: '단어 100개 클릭',
      },
      {
        badgeCode: 'BADGE_WORD_500',
        badgeName: '단어 탐험가',
        isEarned: false,
        category: 'milestone',
        description: '단어 500개 클릭',
      },
      {
        badgeCode: 'BADGE_QUIZ_10',
        badgeName: '퀴즈 도전자',
        isEarned: true,
        category: 'milestone',
        description: '퀴즈 정답 10회',
      },
      {
        badgeCode: 'BADGE_QUIZ_50',
        badgeName: '퀴즈 마스터',
        isEarned: false,
        category: 'milestone',
        description: '퀴즈 정답 50회',
      },

      // 연속 학습 배지 (Streak Badges)
      {
        badgeCode: 'BADGE_STREAK_3',
        badgeName: '3일 연속 학습',
        isEarned: true,
        category: 'streak',
        description: '3일 연속 학습',
      },
      {
        badgeCode: 'BADGE_STREAK_7',
        badgeName: '7일 연속 학습',
        isEarned: true,
        category: 'streak',
        description: '7일 연속 학습',
      },
      {
        badgeCode: 'BADGE_STREAK_14',
        badgeName: '열공 천재',
        isEarned: false,
        category: 'streak',
        description: '14일 연속 학습',
      },
      {
        badgeCode: 'BADGE_STREAK_30',
        badgeName: '공부 습관왕',
        isEarned: false,
        category: 'streak',
        description: '30일 연속 학습',
      },

      // 특별 챌린지 배지 (Special Challenge Badges)
      {
        badgeCode: 'BADGE_DAILY_7',
        badgeName: '데일리 마스터 7일 연속',
        isEarned: false,
        category: 'challenge',
        description: '데일리 미션 7일 연속 수행',
      },
    ];

    setBadges(allBadges);
  }, []);

  // 탭에 따른 필터링된 배지
  const getFilteredBadges = () => {
    switch (activeTab) {
      case 'earned':
        return badges.filter((badge) => badge.isEarned);
      case 'unearned':
        return badges.filter((badge) => !badge.isEarned);
      default:
        return badges;
    }
  };

  // 탭별 개수 계산
  const getTabCount = (tabKey: string) => {
    switch (tabKey) {
      case 'earned':
        return badges.filter((badge) => badge.isEarned).length;
      case 'unearned':
        return badges.filter((badge) => !badge.isEarned).length;
      default:
        return badges.length;
    }
  };

  const filteredBadges = getFilteredBadges();

  return (
    <ImageBackground
      source={backgroundImage}
      style={BadgesScreenStyles.backgroundImage}
      resizeMode="cover"
    >
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        style={BadgesScreenStyles.backButton}
        onPress={() => router.push('../daily-mission')}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* 탭 네비게이션 */}
      <View style={BadgesScreenStyles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[BadgesScreenStyles.tabButton, isActive && BadgesScreenStyles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.iconName}
                size={18}
                color={
                  isActive
                    ? BadgesScreenStyles.activeTabText.color
                    : BadgesScreenStyles.tabText.color
                }
                style={{ marginRight: 4 }}
              />
              <Text
                style={[BadgesScreenStyles.tabText, isActive && BadgesScreenStyles.activeTabText]}
              >
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 배지 그리드 */}
      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.badgeCode}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={BadgesScreenStyles.badgeGridContainer}
        renderItem={({ item }) => (
          <View style={BadgesScreenStyles.badgeCard}>
            <View style={BadgesScreenStyles.badgeIconContainer}>
              {item.isEarned ? (
                <Image source={achieveIcon} style={BadgesScreenStyles.badgeIcon} />
              ) : (
                <Text style={BadgesScreenStyles.plusIcon}>+</Text>
              )}
            </View>
            <Text style={BadgesScreenStyles.badgeName}>{item.badgeName}</Text>
            <Text style={BadgesScreenStyles.badgeDescription} numberOfLines={2}>
              {item.description}
            </Text>
            {item.isEarned && (
              <View style={BadgesScreenStyles.earnedBadge}>
                <Text style={BadgesScreenStyles.earnedText}>획득!</Text>
              </View>
            )}
          </View>
        )}
      />
    </ImageBackground>
  );
}

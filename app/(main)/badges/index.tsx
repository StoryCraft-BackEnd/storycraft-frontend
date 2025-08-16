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
import { getAvailableBadges, AvailableBadge } from '@/shared/api/rewardsApi';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';

// 레벨 배지
import badgeLevel1 from '@/assets/images/badge/BADGE_LEVEL_1.png';
import badgeLevel5 from '@/assets/images/badge/BADGE_LEVEL_5.png';
import badgeLevel10 from '@/assets/images/badge/BADGE_LEVEL_10.png';

// 스토리 배지
import badgeStory1 from '@/assets/images/badge/BADGE_STORY_1.png';
import badgeStory10 from '@/assets/images/badge/BADGE_STORY_10.png';
import badgeStory50 from '@/assets/images/badge/BADGE_STORY_50.png';

// 단어 배지
import badgeWord1 from '@/assets/images/badge/BADGE_WORD_1.png';
import badgeWord100 from '@/assets/images/badge/BADGE_WORD_100.png';
import badgeWord500 from '@/assets/images/badge/BADGE_WORD_500.png';

// 퀴즈 배지
import badgeQuiz1 from '@/assets/images/badge/BADGE_QUIZ_1.png';
import badgeQuiz10 from '@/assets/images/badge/BADGE_QUIZ_10.png';
import badgeQuiz50 from '@/assets/images/badge/BADGE_QUIZ_50.png';

// 연속 학습 배지
import badgeStreak3 from '@/assets/images/badge/BADGE_STREAK_3.png';
import badgeStreak7 from '@/assets/images/badge/BADGE_STREAK_7.png';
import badgeStreak14 from '@/assets/images/badge/BADGE_STREAK_14.png';
import badgeStreak30 from '@/assets/images/badge/BADGE_STREAK_30.png';

// 특별 배지
import badgeDaily7 from '@/assets/images/badge/BADGE_DAILY_7.png';

// 탭 네비게이션 데이터
const TABS = [
  { key: 'all', label: '전체 배지', iconName: 'trophy-outline' as const },
  { key: 'earned', label: '획득한 배지', iconName: 'checkmark-circle-outline' as const },
  { key: 'unearned', label: '미획득 배지', iconName: 'add-circle-outline' as const },
];

// 배지 타입 정의 (획득 여부 포함)
interface BadgeWithEarnedStatus extends AvailableBadge {
  isEarned: boolean;
}

// 배지 이미지 매핑 함수
const getBadgeImage = (badgeCode: string) => {
  // 모든 배지 이미지 매핑
  const badgeImages: { [key: string]: any } = {
    // 레벨 배지
    BADGE_LEVEL_1: badgeLevel1,
    BADGE_LEVEL_5: badgeLevel5,
    BADGE_LEVEL_10: badgeLevel10,

    // 스토리 배지
    BADGE_STORY_1: badgeStory1,
    BADGE_STORY_10: badgeStory10,
    BADGE_STORY_50: badgeStory50,

    // 단어 배지
    BADGE_WORD_1: badgeWord1,
    BADGE_WORD_100: badgeWord100,
    BADGE_WORD_500: badgeWord500,

    // 퀴즈 배지
    BADGE_QUIZ_1: badgeQuiz1,
    BADGE_QUIZ_10: badgeQuiz10,
    BADGE_QUIZ_50: badgeQuiz50,

    // 연속 학습 배지
    BADGE_STREAK_3: badgeStreak3,
    BADGE_STREAK_7: badgeStreak7,
    BADGE_STREAK_14: badgeStreak14,
    BADGE_STREAK_30: badgeStreak30,

    // 특별 배지
    BADGE_DAILY_7: badgeDaily7,
  };

  if (badgeImages[badgeCode]) {
    return badgeImages[badgeCode];
  } else {
    console.log(`배지 이미지가 없습니다: ${badgeCode}.png`);
    return achieveIcon;
  }
};

/**
 * 배지 전체 보기 화면의 메인 컴포넌트
 * 사용자가 획득한 배지와 미획득 배지를 탭으로 필터링하여 볼 수 있습니다.
 */
export default function BadgesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [badges, setBadges] = useState<BadgeWithEarnedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 배지 데이터 로드
  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏆 배지 화면 - API 요청 시작...');
      console.log('📱 현재 화면: BadgesScreen');
      console.log('🔄 getAvailableBadges 함수 호출...');

      // API에서 배지 목록 가져오기
      const availableBadges = await getAvailableBadges();
      console.log('✅ 배지 화면 - API 응답 성공');
      console.log('📊 받아온 배지 개수:', availableBadges.length);
      console.log('📋 배지 목록:', availableBadges);

      // 임시로 일부 배지를 획득 상태로 설정 (실제로는 서버에서 획득 여부를 받아와야 함)
      const badgesWithEarnedStatus: BadgeWithEarnedStatus[] = availableBadges.map(
        (badge, index) => ({
          ...badge,
          isEarned: index < 5, // 임시로 처음 5개만 획득 상태로 설정
        })
      );

      console.log('🎯 배지 화면 - 최종 배지 데이터 생성 완료');
      console.log('📈 획득한 배지 개수:', badgesWithEarnedStatus.filter((b) => b.isEarned).length);
      console.log('📉 미획득 배지 개수:', badgesWithEarnedStatus.filter((b) => !b.isEarned).length);
      console.log('📋 최종 배지 데이터:', badgesWithEarnedStatus);

      setBadges(badgesWithEarnedStatus);
      console.log('✅ 배지 화면 - 상태 업데이트 완료');
    } catch (err) {
      console.error('❌ 배지 화면 - 로드 실패:', err);
      console.error('❌ 에러 상세 정보:', {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });
      setError('배지 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      console.log('🏁 배지 화면 - 로딩 완료');
    }
  };

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

  if (loading) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={BadgesScreenStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={BadgesScreenStyles.loadingContainer}>
          <Text style={BadgesScreenStyles.loadingText}>배지 목록을 불러오는 중...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={BadgesScreenStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={BadgesScreenStyles.errorContainer}>
          <Text style={BadgesScreenStyles.errorText}>{error}</Text>
          <TouchableOpacity style={BadgesScreenStyles.retryButton} onPress={loadBadges}>
            <Text style={BadgesScreenStyles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

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
        renderItem={({ item }) => {
          const badgeImage = getBadgeImage(item.badgeCode);

          return (
            <View style={BadgesScreenStyles.badgeCard}>
              <View style={BadgesScreenStyles.badgeIconContainer}>
                {item.isEarned ? (
                  <Image source={badgeImage} style={BadgesScreenStyles.badgeIcon} />
                ) : (
                  <Image
                    source={badgeImage}
                    style={[BadgesScreenStyles.badgeIcon, BadgesScreenStyles.unearnedBadgeIcon]}
                  />
                )}
              </View>
              <Text style={BadgesScreenStyles.badgeName}>{item.badgeName}</Text>
              <Text style={BadgesScreenStyles.badgeDescription} numberOfLines={2}>
                {item.condition}
              </Text>
              {item.isEarned && (
                <View style={BadgesScreenStyles.earnedBadge}>
                  <Text style={BadgesScreenStyles.earnedText}>획득!</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </ImageBackground>
  );
}

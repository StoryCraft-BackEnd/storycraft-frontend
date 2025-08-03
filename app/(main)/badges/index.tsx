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
import { rewardsApi, RewardProfile, AvailableBadge } from '@/shared/api/rewardsApi';

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
  const [isLoading, setIsLoading] = useState(true);

  // 배지 데이터 로드 함수
  const loadBadgeData = async () => {
    console.warn('🏆 배지 화면 - 배지 데이터 로드 시작!');
    setIsLoading(true);

    let profile: RewardProfile;

    try {
      // 1. 사용자 프로필에서 획득한 배지 가져오기
      console.warn('📊 배지 화면 - 1단계: 사용자 프로필 조회 시작');
      try {
        profile = await rewardsApi.getProfile(1); // childId: 1
        console.warn('✅ 배지 화면 - 1단계 성공 - 획득한 배지:', profile.badges);
      } catch (profileError) {
        console.error('❌ 배지 화면 - 1단계 실패 - 프로필 조회 에러:', profileError);
        throw profileError;
      }

      // 2. 전체 사용 가능한 배지 목록 가져오기 (임시로 하드코딩)
      console.warn('📋 배지 화면 - 2단계: 전체 배지 목록 조회 시작');
      let availableBadges: AvailableBadge[];

      try {
        console.warn('🔄 배지 화면 - getAvailableBadges API 호출 시도...');
        availableBadges = await rewardsApi.getAvailableBadges();
        console.warn('✅ 배지 화면 - 2단계 성공 - 전체 배지 목록:', availableBadges);
      } catch (availableError) {
        console.error('❌ 배지 화면 - 2단계 실패 - 전체 배지 목록 조회 에러:', availableError);
        console.warn('🔄 배지 화면 - 임시 하드코딩된 배지 목록 사용');

        // 임시 하드코딩된 전체 배지 목록
        availableBadges = [
          // 기본 학습 배지
          {
            badgeCode: 'BADGE_STORY_1',
            badgeName: '첫 번째 동화 읽기',
            condition: '동화 1편 읽기',
            category: 'basic',
          },
          {
            badgeCode: 'BADGE_WORD_1',
            badgeName: '첫 단어 클릭',
            condition: '단어 클릭 1회',
            category: 'basic',
          },
          {
            badgeCode: 'BADGE_QUIZ_1',
            badgeName: '첫 퀴즈 도전',
            condition: '퀴즈 정답 1회',
            category: 'basic',
          },
          {
            badgeCode: 'BADGE_LEVEL_1',
            badgeName: '레벨 1 달성!',
            condition: '레벨 1 도달',
            category: 'basic',
          },
          {
            badgeCode: 'BADGE_LEVEL_5',
            badgeName: '레벨 5 달성!',
            condition: '레벨 5 도달',
            category: 'basic',
          },
          {
            badgeCode: 'BADGE_LEVEL_10',
            badgeName: '레벨 10 달성!',
            condition: '레벨 10 도달',
            category: 'basic',
          },

          // 누적 활동 배지
          {
            badgeCode: 'BADGE_STORY_10',
            badgeName: '동화 마스터 10편',
            condition: '동화 10편 읽기',
            category: 'milestone',
          },
          {
            badgeCode: 'BADGE_STORY_50',
            badgeName: '동화 챔피언 50편',
            condition: '동화 50편 읽기',
            category: 'milestone',
          },
          {
            badgeCode: 'BADGE_WORD_100',
            badgeName: '단어 수집가',
            condition: '단어 100개 클릭',
            category: 'milestone',
          },
          {
            badgeCode: 'BADGE_WORD_500',
            badgeName: '단어 탐험가',
            condition: '단어 500개 클릭',
            category: 'milestone',
          },
          {
            badgeCode: 'BADGE_QUIZ_10',
            badgeName: '퀴즈 도전자',
            condition: '퀴즈 정답 10회',
            category: 'milestone',
          },
          {
            badgeCode: 'BADGE_QUIZ_50',
            badgeName: '퀴즈 마스터',
            condition: '퀴즈 정답 50회',
            category: 'milestone',
          },

          // 연속 학습 배지
          {
            badgeCode: 'BADGE_STREAK_3',
            badgeName: '3일 연속 학습',
            condition: '3일 연속 학습',
            category: 'streak',
          },
          {
            badgeCode: 'BADGE_STREAK_7',
            badgeName: '7일 연속 학습',
            condition: '7일 연속 학습',
            category: 'streak',
          },
          {
            badgeCode: 'BADGE_STREAK_14',
            badgeName: '열공 천재',
            condition: '14일 연속 학습',
            category: 'streak',
          },
          {
            badgeCode: 'BADGE_STREAK_30',
            badgeName: '공부 습관왕',
            condition: '30일 연속 학습',
            category: 'streak',
          },

          // 특별 챌린지 배지
          {
            badgeCode: 'BADGE_DAILY_7',
            badgeName: '데일리 마스터 7일 연속',
            condition: '데일리 미션 7일 연속 수행',
            category: 'special',
          },
        ];
      }

      // 3. 두 데이터를 합쳐서 최종 배지 데이터 생성
      const earnedBadgeCodes = new Set(profile.badges.map((badge) => badge.badgeCode));

      const finalBadges: Badge[] = availableBadges.map((availableBadge) => ({
        badgeCode: availableBadge.badgeCode,
        badgeName: availableBadge.badgeName,
        isEarned: earnedBadgeCodes.has(availableBadge.badgeCode),
        category: availableBadge.category,
        description: availableBadge.condition, // condition을 description으로 사용
      }));

      console.warn('🎯 배지 화면 - 최종 배지 데이터:', finalBadges);
      setBadges(finalBadges);
    } catch (error) {
      console.error('❌ 배지 화면 - 배지 데이터 로드 실패:', error);

      // 구체적인 에러 정보 출력
      if (error.response) {
        console.error('❌ 배지 화면 - 서버 응답 에러:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.response.config?.url,
          method: error.response.config?.method,
        });
      } else if (error.request) {
        console.error('❌ 배지 화면 - 네트워크 에러:', error.request);
      } else {
        console.error('❌ 배지 화면 - 기타 에러:', error.message);
      }

      // 에러 발생 시 기본 데이터 사용
      setBadges([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 배지 데이터 로드
  useEffect(() => {
    loadBadgeData();
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

      {/* 로딩 상태 */}
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>배지 데이터를 불러오는 중...</Text>
        </View>
      )}

      {/* 배지 그리드 */}
      {!isLoading && (
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
      )}
    </ImageBackground>
  );
}

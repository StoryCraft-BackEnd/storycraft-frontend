/**
 * @description
 * StoryCraft 배지 전체 보기 페이지
 * 사용자가 획득한 배지와 미획득 배지를 탭으로 필터링하여 볼 수 있는 화면입니다.
 * 3개의 탭(전체/획득한/미획득)으로 배지를 분류하여 표시합니다.
 */
// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Image } from 'react-native';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router } from 'expo-router';
// 아이콘 라이브러리
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
// 배지 화면 전용 스타일
import { BadgesScreenStyles } from '@/styles/BadgesScreen.styles';
// 배지 관련 API 함수들 (배지 목록 조회, 사용자 배지 현황 조회)
import { getAvailableBadges, AvailableBadge, rewardsApi } from '@/shared/api/rewardsApi';
// 프로필 저장소에서 선택된 프로필 정보 로드
import { loadSelectedProfile } from '@/features/profile/profileStorage';

// --- 이미지 및 리소스 ---
// 배경 이미지 (밤하늘 배경)
import backgroundImage from '@/assets/images/background/night-bg.png';
// 기본 배지 아이콘 (배지 이미지가 없을 때 사용)
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';

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

// 탭 네비게이션 데이터 (배지 필터링을 위한 탭 정보)
const TABS = [
  { key: 'all', label: '전체 배지', iconName: 'trophy-outline' as const }, // 모든 배지 표시
  { key: 'earned', label: '획득한 배지', iconName: 'checkmark-circle-outline' as const }, // 획득한 배지만 표시
  { key: 'unearned', label: '미획득 배지', iconName: 'add-circle-outline' as const }, // 미획득 배지만 표시
];

// 배지 타입 정의 (획득 여부 포함) - API에서 받은 배지 정보에 사용자의 획득 여부 추가
interface BadgeWithEarnedStatus extends AvailableBadge {
  isEarned: boolean; // 사용자가 해당 배지를 획득했는지 여부
}

// 배지 이미지 매핑 함수 (배지 코드에 따라 해당하는 이미지 반환)
const getBadgeImage = (badgeCode: string) => {
  // 모든 배지 이미지 매핑 (배지 코드와 실제 이미지 파일 연결)
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

  // 해당 배지 코드의 이미지가 있으면 반환
  if (badgeImages[badgeCode]) {
    return badgeImages[badgeCode];
  } else {
    // 배지 이미지가 없으면 기본 아이콘 반환 및 로그 출력
    console.log(`배지 이미지가 없습니다: ${badgeCode}.png`);
    return achieveIcon;
  }
};

/**
 * 배지 전체 보기 화면의 메인 컴포넌트
 * 사용자가 획득한 배지와 미획득 배지를 탭으로 필터링하여 볼 수 있습니다.
 */
export default function BadgesScreen() {
  // 현재 활성화된 탭 상태 (all/earned/unearned)
  const [activeTab, setActiveTab] = useState('all');
  // 배지 목록 상태 (획득 여부 포함)
  const [badges, setBadges] = useState<BadgeWithEarnedStatus[]>([]);
  // 로딩 상태 (배지 데이터 로딩 중 여부)
  const [loading, setLoading] = useState(true);
  // 에러 상태 (배지 로딩 실패 시 에러 메시지)
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 배지 데이터 로드 (화면 진입 시 한 번만 실행)
  useEffect(() => {
    loadBadges();
  }, []);

  // 배지 데이터 로드 함수 (API에서 배지 목록과 사용자 획득 현황을 가져와서 결합)
  const loadBadges = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      setError(null); // 에러 상태 초기화

      console.log('🏆 배지 화면 - API 요청 시작...');
      console.log('📱 현재 화면: BadgesScreen');

      // 1. 선택된 프로필 로드 (현재 사용 중인 프로필 정보 가져오기)
      const profile = await loadSelectedProfile();
      if (!profile) {
        console.warn('⚠️ 선택된 프로필이 없음');
        setError('선택된 프로필이 없습니다.');
        return;
      }

      console.log('✅ 선택된 프로필:', { childId: profile.childId, name: profile.name });

      // 2. API에서 배지 목록 가져오기 (모든 가능한 배지 정보)
      console.log('🔄 getAvailableBadges 함수 호출...');
      const availableBadges = await getAvailableBadges();
      console.log('✅ 배지 목록 API 응답 성공');
      console.log('📊 받아온 배지 개수:', availableBadges.length);

      // 3. 사용자의 실제 배지 획득 현황 가져오기 (현재 사용자가 획득한 배지들)
      console.log('🔄 사용자 배지 현황 API 호출...');
      const userProfile = await rewardsApi.getProfile(profile.childId);
      console.log('✅ 사용자 배지 현황 API 응답 성공');
      console.log('📊 사용자 배지 현황:', userProfile.badges);

      // 4. 실제 획득 여부로 배지 상태 설정 (배지 목록과 사용자 획득 현황 결합)
      const badgesWithEarnedStatus: BadgeWithEarnedStatus[] = availableBadges.map((badge) => {
        // 사용자가 획득한 배지 중에서 현재 배지 찾기
        const userBadge = userProfile.badges?.find((b) => b.badgeCode === badge.badgeCode);
        // awardedAt이 있으면 획득한 것으로 판단
        const isEarned = userBadge ? !!userBadge.awardedAt : false;

        console.log(`🔍 배지 ${badge.badgeCode}: ${isEarned ? '획득' : '미획득'}`);

        return {
          ...badge, // 기존 배지 정보 유지
          isEarned, // 획득 여부 추가
        };
      });

      console.log('🎯 배지 화면 - 최종 배지 데이터 생성 완료');
      console.log('📈 획득한 배지 개수:', badgesWithEarnedStatus.filter((b) => b.isEarned).length);
      console.log('📉 미획득 배지 개수:', badgesWithEarnedStatus.filter((b) => !b.isEarned).length);

      setBadges(badgesWithEarnedStatus); // 최종 배지 데이터 상태에 저장
      console.log('✅ 배지 화면 - 상태 업데이트 완료');
    } catch (err) {
      // 에러 발생 시 로그 출력 및 에러 상태 설정
      console.error('❌ 배지 화면 - 로드 실패:', err);
      console.error('❌ 에러 상세 정보:', {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });
      setError('배지 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
      console.log('🏁 배지 화면 - 로딩 완료');
    }
  };

  // 탭에 따른 필터링된 배지 반환 함수 (현재 선택된 탭에 따라 배지 목록 필터링)
  const getFilteredBadges = () => {
    switch (activeTab) {
      case 'earned':
        // 획득한 배지만 필터링하여 반환
        return badges.filter((badge) => badge.isEarned);
      case 'unearned':
        // 미획득 배지만 필터링하여 반환
        return badges.filter((badge) => !badge.isEarned);
      default:
        // 전체 탭일 때는 모든 배지 반환
        return badges;
    }
  };

  // 탭별 개수 계산 함수 (각 탭에 표시될 배지 개수 계산)
  const getTabCount = (tabKey: string) => {
    switch (tabKey) {
      case 'earned':
        // 획득한 배지 개수 반환
        return badges.filter((badge) => badge.isEarned).length;
      case 'unearned':
        // 미획득 배지 개수 반환
        return badges.filter((badge) => !badge.isEarned).length;
      default:
        // 전체 배지 개수 반환
        return badges.length;
    }
  };

  // 현재 탭에 필터링된 배지 목록
  const filteredBadges = getFilteredBadges();

  // 로딩 중일 때 표시되는 화면
  if (loading) {
    return (
      <ImageBackground
        source={backgroundImage} // 밤하늘 배경 이미지
        style={BadgesScreenStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={BadgesScreenStyles.loadingContainer}>
          <Text style={BadgesScreenStyles.loadingText}>배지 목록을 불러오는 중...</Text>
        </View>
      </ImageBackground>
    );
  }

  // 에러 발생 시 표시되는 화면
  if (error) {
    return (
      <ImageBackground
        source={backgroundImage} // 밤하늘 배경 이미지
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
      source={backgroundImage} // 밤하늘 배경 이미지
      style={BadgesScreenStyles.backgroundImage}
      resizeMode="cover"
    >
      {/* 뒤로가기 버튼 (데일리 미션 화면으로 이동) */}
      <TouchableOpacity
        style={BadgesScreenStyles.backButton}
        onPress={() => router.push('../daily-mission')}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* 탭 네비게이션 (전체/획득한/미획득 배지 필터링) */}
      <View style={BadgesScreenStyles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key; // 현재 활성화된 탭인지 확인
          const count = getTabCount(tab.key); // 해당 탭의 배지 개수 계산
          return (
            <TouchableOpacity
              key={tab.key}
              style={[BadgesScreenStyles.tabButton, isActive && BadgesScreenStyles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)} // 탭 클릭 시 활성 탭 변경
            >
              <Ionicons
                name={tab.iconName}
                size={18}
                color={
                  isActive
                    ? BadgesScreenStyles.activeTabText.color // 활성 탭 색상
                    : BadgesScreenStyles.tabText.color // 비활성 탭 색상
                }
                style={{ marginRight: 4 }}
              />
              <Text
                style={[BadgesScreenStyles.tabText, isActive && BadgesScreenStyles.activeTabText]}
              >
                {tab.label} ({count}) {/* 탭 이름과 배지 개수 표시 */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 배지 그리드 (가로 스크롤 가능한 배지 목록) */}
      <FlatList
        data={filteredBadges} // 현재 탭에 필터링된 배지 목록
        keyExtractor={(item) => item.badgeCode} // 각 배지의 고유 키
        horizontal // 가로 스크롤 설정
        showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
        contentContainerStyle={BadgesScreenStyles.badgeGridContainer}
        renderItem={({ item }) => {
          const badgeImage = getBadgeImage(item.badgeCode); // 배지 코드에 해당하는 이미지 가져오기

          return (
            <View style={BadgesScreenStyles.badgeCard}>
              <View style={BadgesScreenStyles.badgeIconContainer}>
                {item.isEarned ? (
                  // 획득한 배지: 원본 이미지 표시
                  <Image source={badgeImage} style={BadgesScreenStyles.badgeIcon} />
                ) : (
                  // 미획득 배지: 흐릿한 이미지 표시
                  <Image
                    source={badgeImage}
                    style={[BadgesScreenStyles.badgeIcon, BadgesScreenStyles.unearnedBadgeIcon]}
                  />
                )}
              </View>
              <Text style={BadgesScreenStyles.badgeName}>{item.badgeName}</Text>
              <Text style={BadgesScreenStyles.badgeDescription} numberOfLines={2}>
                {item.condition} {/* 배지 획득 조건 표시 */}
              </Text>
              {item.isEarned && (
                // 획득한 배지에만 "획득!" 표시
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

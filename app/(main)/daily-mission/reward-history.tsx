/**
 * 보상 내역 화면 컴포넌트
 * 사용자의 포인트 및 배지 획득 히스토리를 조회하는 화면입니다.
 * 3개 탭(전체/포인트/배지)으로 보상 내역을 필터링하여 표시합니다.
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
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router } from 'expo-router';
// 보상 내역 화면 전용 스타일
import { RewardHistoryScreenStyles as styles } from '../../../styles/RewardHistoryScreen.styles';
// 아이콘 라이브러리
import { Ionicons } from '@expo/vector-icons';
// 배경 이미지 (밤하늘 배경)
import nightBg from '@/assets/images/background/night-bg.png';
// 포인트 아이콘 이미지
import pointImage from '@/assets/images/rewards/point_icon.png';
// 기본 성취 아이콘 이미지
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';
// 보상 관련 API 함수들과 타입 정의
import { rewardsApi, RewardHistoryItem } from '@/shared/api/rewardsApi';

// 타입 정의는 rewardsApi에서 import

// 필터 상태 타입 정의 (보상 내역 필터링을 위한 상태)
interface FilterState {
  type: 'all' | 'point' | 'badge'; // 필터 타입 (전체/포인트/배지)
  fromDate: string; // 조회 시작 날짜
  toDate: string; // 조회 종료 날짜
}

export default function RewardHistoryScreen() {
  // 상태 관리
  // 보상 히스토리 목록 상태 (API에서 받아온 보상 내역 데이터)
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([]);
  // 필터 상태 (탭 선택 및 날짜 범위)
  const [filter, setFilter] = useState<FilterState>({
    type: 'all', // 기본값: 전체 보기
    fromDate: '2025-01-01', // 조회 시작 날짜
    toDate: '2025-12-31', // 조회 종료 날짜
  });
  // 로딩 상태 (API 호출 중 여부)
  const [isLoading, setIsLoading] = useState(false);
  // 월별 통계 상태 (이번 달 총 포인트 및 배지 개수)
  const [monthlyStats, setMonthlyStats] = useState({
    totalPoints: 0, // 이번 달 총 포인트
    totalBadges: 0, // 이번 달 총 배지 개수
  });

  // 보상 타입별 아이콘 반환 함수 (보상 타입에 따라 해당하는 아이콘 반환)
  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'POINT':
        return pointImage; // 포인트 보상 아이콘
      case 'BADGE':
        return achieveIcon; // 배지 보상 아이콘
      default:
        return pointImage; // 기본값: 포인트 아이콘
    }
  };

  // 보상 타입별 색상 반환 함수 (보상 타입에 따라 해당하는 색상 반환)
  const getRewardColor = (type: string) => {
    switch (type) {
      case 'POINT':
        return '#4CAF50'; // 포인트: 초록색
      case 'BADGE':
        return '#FF9800'; // 배지: 주황색
      default:
        return '#4CAF50'; // 기본값: 초록색
    }
  };

  // 보상 타입별 설명 반환 함수 (보상 타입에 따라 사용자 친화적인 설명 반환)
  const getRewardDescription = (rewardType?: string, context?: string) => {
    if (!rewardType) return '';

    switch (rewardType) {
      case 'POINT_STORY_READ':
        return '동화 읽기 완료';
      case 'POINT_WORD_CLICK':
        return '단어 클릭';
      case 'POINT_QUIZ_CORRECT':
        return '퀴즈 정답';
      case 'POINT_DAILY_MISSION':
        return '데일리 미션 완료';
      case 'POINT_STREAK_3':
        return '3일 연속 학습';
      case 'POINT_STREAK_7':
        return '7일 연속 학습';
      case 'POINT_STREAK_14':
        return '14일 연속 학습';
      default:
        return context || '보상 획득'; // 기본값 또는 컨텍스트 사용
    }
  };

  // 날짜 포맷팅 함수 (날짜 문자열을 "월 일" 형식으로 변환)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`; // 월(0부터 시작하므로 +1)과 일 표시
  };

  // API 호출 - 보상 히스토리 조회 함수 (사용자의 보상 내역을 API에서 가져오기)
  const fetchRewardHistory = async () => {
    console.warn('🌐 보상 히스토리 API 호출 시작!');
    setIsLoading(true); // 로딩 상태 시작
    try {
      // 실제 API 호출 (사용자 ID, 날짜 범위, 필터 타입으로 조회)
      const data = await rewardsApi.getHistory(
        1, // childId - 실제로는 사용자 ID를 사용해야 함
        filter.fromDate, // 조회 시작 날짜
        filter.toDate, // 조회 종료 날짜
        filter.type === 'all' ? undefined : filter.type // 필터 타입 (전체가 아니면 해당 타입만)
      );

      console.warn('✅ 보상 히스토리 API 성공:', data);
      setRewardHistory(data); // 받아온 데이터를 상태에 저장

      // 이번 달 통계 계산 (현재 월의 보상 내역만 필터링)
      const currentMonth = new Date().getMonth(); // 현재 월 (0부터 시작)
      const currentYear = new Date().getFullYear(); // 현재 연도

      const monthlyData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });

      // 이번 달 총 포인트 계산
      const totalPoints = monthlyData
        .filter((item) => item.type === 'POINT') // 포인트 타입만 필터링
        .reduce((sum, item) => sum + (item.value || 0), 0); // 포인트 값들의 합계

      // 이번 달 총 배지 개수 계산
      const totalBadges = monthlyData.filter((item) => item.type === 'BADGE').length;

      console.warn('📊 이번 달 통계 계산:', {
        totalPoints,
        totalBadges,
        monthlyDataCount: monthlyData.length,
      });

      setMonthlyStats({
        totalPoints, // 이번 달 총 포인트
        totalBadges, // 이번 달 총 배지 개수
      });
    } catch (error) {
      console.error('❌ 보상 히스토리 API 실패:', error);
      Alert.alert('오류', '보상 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  // 필터링된 보상 히스토리 반환 함수 (현재 선택된 필터에 따라 보상 내역 필터링)
  const getFilteredRewardHistory = () => {
    switch (filter.type) {
      case 'point':
        // 포인트 타입만 필터링하여 반환
        return rewardHistory.filter((item) => item.type === 'POINT');
      case 'badge':
        // 배지 타입만 필터링하여 반환
        return rewardHistory.filter((item) => item.type === 'BADGE');
      default:
        // 전체 탭일 때는 모든 보상 내역 반환
        return rewardHistory;
    }
  };

  // 필터 변경 핸들러 함수 (탭 클릭 시 필터 타입 변경)
  const handleFilterChange = (newType: 'all' | 'point' | 'badge') => {
    setFilter((prev) => ({ ...prev, type: newType })); // 기존 필터 상태 유지하면서 타입만 변경
  };

  // 컴포넌트 마운트 시 API 호출 (화면 진입 시 한 번만 실행)
  useEffect(() => {
    fetchRewardHistory();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 현재 필터에 맞는 보상 히스토리 목록
  const filteredRewardHistory = getFilteredRewardHistory();

  return (
    <ImageBackground source={nightBg} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* 헤더 (뒤로가기 버튼과 제목) */}
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              {' '}
              {/* 이전 화면으로 이동 */}
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>보상 히스토리</Text>
          <View style={styles.backButtonContainer} /> {/* 헤더 균형을 위한 빈 공간 */}
        </View>

        {/* 상단 탭 (전체/포인트/배지 필터링) */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'all' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('all')} // 전체 탭 클릭
          >
            <Text style={[styles.tabText, filter.type === 'all' && styles.activeTabText]}>
              전체 ({rewardHistory.length}) {/* 전체 보상 내역 개수 표시 */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'point' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('point')} // 포인트 탭 클릭
          >
            <Text style={[styles.tabText, filter.type === 'point' && styles.activeTabText]}>
              포인트 ({rewardHistory.filter((item) => item.type === 'POINT').length}){' '}
              {/* 포인트 보상 개수 표시 */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'badge' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('badge')} // 배지 탭 클릭
          >
            <Text style={[styles.tabText, filter.type === 'badge' && styles.activeTabText]}>
              배지 ({rewardHistory.filter((item) => item.type === 'BADGE').length}){' '}
              {/* 배지 보상 개수 표시 */}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 보상 내역 스크롤 (가로 스크롤 가능한 보상 내역 목록) */}
        <ScrollView
          style={styles.contentContainer}
          horizontal={true} // 가로 스크롤 설정
          showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
          pagingEnabled={false} // 페이징 비활성화
        >
          <View style={styles.scrollContainer}>
            {/* 통계 카드 (이번 달 총 획득 포인트 및 배지 개수) */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>총 획득</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Image source={pointImage} style={styles.statIcon} />
                  <Text style={styles.statValue}>{monthlyStats.totalPoints.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>포인트</Text>
                </View>
                <View style={styles.statItem}>
                  <Image source={achieveIcon} style={styles.statIcon} />
                  <Text style={styles.statValue}>{monthlyStats.totalBadges}</Text>
                  <Text style={styles.statLabel}>배지</Text>
                </View>
              </View>
            </View>

            {/* 보상 히스토리 목록 (필터링된 보상 내역들을 카드 형태로 표시) */}
            {filteredRewardHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Image source={getRewardIcon(item.type)} style={styles.historyIcon} />
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.historyType}>
                      {item.type === 'POINT' ? '포인트 획득' : '배지 획득'}
                    </Text>
                  </View>
                  {item.type === 'POINT' && item.value && (
                    <View style={styles.pointValue}>
                      <Text style={[styles.pointValueText, { color: getRewardColor(item.type) }]}>
                        +{item.value}P
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.historyContent}>
                  {item.type === 'POINT' ? (
                    // 포인트 보상인 경우: 보상 설명 표시
                    <Text style={styles.historyDescription}>
                      {getRewardDescription(item.rewardType, item.context)}
                    </Text>
                  ) : (
                    // 배지 보상인 경우: 배지 이름과 코드 표시
                    <View style={styles.badgeInfo}>
                      <Text style={styles.badgeName}>{item.badgeName}</Text>
                      <Text style={styles.badgeCode}>{item.badgeCode}</Text>
                    </View>
                  )}
                </View>

                <View
                  style={[styles.historyIndicator, { backgroundColor: getRewardColor(item.type) }]}
                />
              </View>
            ))}

            {/* 빈 상태 (보상 내역이 없을 때 표시되는 안내 메시지) */}
            {filteredRewardHistory.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>보상 내역이 없습니다</Text>
                <Text style={styles.emptyStateSubtext}>
                  학습을 통해 포인트와 배지를 획득해보세요!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

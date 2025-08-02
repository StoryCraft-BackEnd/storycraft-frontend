/**
 * 보상 내역 화면 컴포넌트
 * 사용자의 포인트 및 배지 획득 히스토리를 조회하는 화면입니다.
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
import { RewardHistoryScreenStyles as styles } from '../../../styles/RewardHistoryScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import nightBg from '@/assets/images/background/night-bg.png';
import pointImage from '@/assets/images/rewards/point_icon.png';
import achieveIcon from '@/assets/images/rewards/acheive_icon2.png';

const { width: screenWidth } = Dimensions.get('window');

// 타입 정의
interface RewardHistoryItem {
  date: string;
  type: 'POINT' | 'BADGE';
  rewardType?: string;
  context?: string;
  value?: number;
  badgeCode?: string;
  badgeName?: string;
}

interface FilterState {
  type: 'all' | 'point' | 'badge';
  fromDate: string;
  toDate: string;
}

export default function RewardHistoryScreen() {
  // 상태 관리
  const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    type: 'all',
    fromDate: '2025-01-01',
    toDate: '2025-12-31',
  });
  const [isLoading, setIsLoading] = useState(false);

  // 보상 타입별 아이콘 및 색상
  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'POINT':
        return pointImage;
      case 'BADGE':
        return achieveIcon;
      default:
        return pointImage;
    }
  };

  // 보상 타입별 색상
  const getRewardColor = (type: string) => {
    switch (type) {
      case 'POINT':
        return '#4CAF50';
      case 'BADGE':
        return '#FF9800';
      default:
        return '#4CAF50';
    }
  };

  // 보상 타입별 설명
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
        return context || '보상 획득';
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // API 호출 - 보상 히스토리 조회
  const fetchRewardHistory = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출
      // const response = await fetch(`/rewards/history?childId=1&from=${filter.fromDate}&to=${filter.toDate}&type=${filter.type}`);

      // 임시 데이터
      const mockData: RewardHistoryItem[] = [
        {
          date: '2025-01-15',
          type: 'POINT',
          rewardType: 'POINT_STORY_READ',
          context: 'STORY_READ',
          value: 30,
        },
        {
          date: '2025-01-15',
          type: 'POINT',
          rewardType: 'POINT_WORD_CLICK',
          context: 'WORD_CLICK',
          value: 5,
        },
        {
          date: '2025-01-14',
          type: 'BADGE',
          badgeCode: 'BADGE_STORY_10',
          badgeName: '동화 마스터 10편',
        },
        {
          date: '2025-01-13',
          type: 'POINT',
          rewardType: 'POINT_QUIZ_CORRECT',
          context: 'QUIZ_CORRECT',
          value: 10,
        },
        {
          date: '2025-01-12',
          type: 'POINT',
          rewardType: 'POINT_DAILY_MISSION',
          context: 'DAILY_MISSION_COMPLETED',
          value: 100,
        },
        {
          date: '2025-01-11',
          type: 'BADGE',
          badgeCode: 'BADGE_STREAK_3',
          badgeName: '3일 연속 학습',
        },
      ];

      setRewardHistory(mockData);
    } catch (error) {
      Alert.alert('오류', '보상 내역을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 필터링된 보상 히스토리
  const getFilteredRewardHistory = () => {
    switch (filter.type) {
      case 'point':
        return rewardHistory.filter((item) => item.type === 'POINT');
      case 'badge':
        return rewardHistory.filter((item) => item.type === 'BADGE');
      default:
        return rewardHistory;
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (newType: 'all' | 'point' | 'badge') => {
    setFilter((prev) => ({ ...prev, type: newType }));
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchRewardHistory();
  }, []);

  const filteredRewardHistory = getFilteredRewardHistory();

  return (
    <ImageBackground source={nightBg} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>보상 히스토리</Text>
          <View style={styles.backButtonContainer} />
        </View>

        {/* 상단 탭 */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'all' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.tabText, filter.type === 'all' && styles.activeTabText]}>
              전체 ({rewardHistory.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'point' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('point')}
          >
            <Text style={[styles.tabText, filter.type === 'point' && styles.activeTabText]}>
              포인트 ({rewardHistory.filter((item) => item.type === 'POINT').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter.type === 'badge' && styles.activeTabBtn]}
            onPress={() => handleFilterChange('badge')}
          >
            <Text style={[styles.tabText, filter.type === 'badge' && styles.activeTabText]}>
              배지 ({rewardHistory.filter((item) => item.type === 'BADGE').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 보상 내역 스크롤 */}
        <ScrollView
          style={styles.contentContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
        >
          <View style={styles.scrollContainer}>
            {/* 통계 카드 */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>이번 달 획득</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Image source={pointImage} style={styles.statIcon} />
                  <Text style={styles.statValue}>1,250</Text>
                  <Text style={styles.statLabel}>포인트</Text>
                </View>
                <View style={styles.statItem}>
                  <Image source={achieveIcon} style={styles.statIcon} />
                  <Text style={styles.statValue}>3</Text>
                  <Text style={styles.statLabel}>배지</Text>
                </View>
              </View>
            </View>

            {/* 보상 히스토리 목록 */}
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
                    <Text style={styles.historyDescription}>
                      {getRewardDescription(item.rewardType, item.context)}
                    </Text>
                  ) : (
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

            {/* 빈 상태 */}
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

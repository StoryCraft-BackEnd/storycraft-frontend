import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, ImageBackground, Alert } from 'react-native';
import BackButton from '../../../../components/ui/BackButton';
import styles from '../../../../styles/MyPageStatsScreen.styles';
import nightBg from '../../../../assets/images/background/night-bg.png';
import { getChildStatistics, statisticsUtils, type ChildStatistics } from '../../../../shared/api';
import { loadSelectedProfile } from '../../../../features/profile/profileStorage';
import { LoadingScreen } from '../../../../components/ui/LoadingScreen';

export default function MyPageStatsScreen() {
  const [statistics, setStatistics] = useState<ChildStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 - 자녀별 학습 통계 조회
  const fetchStatistics = async () => {
    console.warn('📊 학습 통계 API 호출 시작!');
    setIsLoading(true);
    setError(null);

    try {
      // 선택된 프로필 불러오기
      const selectedProfile = await loadSelectedProfile();
      if (!selectedProfile) {
        throw new Error('선택된 프로필이 없습니다.');
      }

      console.warn('👤 선택된 프로필:', selectedProfile.name, '(ID:', selectedProfile.childId, ')');

      // 실제 API 호출
      const data = await getChildStatistics(selectedProfile.childId);
      console.warn('✅ 학습 통계 API 성공:', data);

      setStatistics(data);
    } catch (error: any) {
      console.error('❌ 학습 통계 API 실패:', error);
      setError(error.message || '학습 통계를 불러오는데 실패했습니다.');
      Alert.alert('오류', '학습 통계를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchStatistics();
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return <LoadingScreen message="학습 통계를 불러오는 중..." />;
  }

  // 에러가 발생했을 때
  if (error || !statistics) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={{ flex: 1 }}>
          <BackButton />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>오류</Text>
            <Text style={styles.summaryLabel}>{error || '학습 통계를 불러올 수 없습니다.'}</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <BackButton />
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {/* 학습 요약 카드 */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>학습 요약</Text>
            <View style={styles.summaryList}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>총 생성한 동화</Text>
                <Text style={styles.summaryValue}>{statistics.createdStories}개</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>완성한 동화</Text>
                <Text style={styles.summaryValue}>{statistics.completedStories}개</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>학습한 단어</Text>
                <Text style={styles.summaryValue}>{statistics.learnedWords}개</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>푼 퀴즈</Text>
                <Text style={styles.summaryValue}>{statistics.solvedQuizzes}개</Text>
              </View>
            </View>
          </View>

          {/* 총 학습 시간 카드 */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>총 학습 시간</Text>
            <View style={styles.timeDisplayContainer}>
              <Text style={styles.timeDisplayText}>
                {statisticsUtils.formatLearningTime(statistics.totalLearningTimeMinutes)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

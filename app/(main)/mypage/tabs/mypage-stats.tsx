/**
 * 학습 통계 화면 컴포넌트
 * 선택된 자녀의 학습 통계 정보를 조회하고 표시하는 화면입니다.
 * 생성한 동화, 완성한 동화, 학습한 단어, 푼 퀴즈, 총 학습 시간 등의 통계를 카드 형태로 보여줍니다.
 * 가로 스크롤을 통해 여러 통계 카드를 확인할 수 있습니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  ScrollView, // 스크롤 가능한 컨테이너
  SafeAreaView, // 안전 영역을 고려한 컨테이너
  ImageBackground, // 배경 이미지가 있는 컨테이너
  Alert, // 알림 팝업 표시용
} from 'react-native';
// 뒤로가기 버튼 컴포넌트
import BackButton from '../../../../components/ui/BackButton';
// 학습 통계 화면 전용 스타일
import styles from '../../../../styles/MyPageStatsScreen.styles';
// 배경 이미지 (밤하늘 배경)
import nightBg from '../../../../assets/images/background/night-bg.png';
// 학습 통계 관련 API 함수들과 타입 정의, 유틸리티 함수들
import { getChildStatistics, statisticsUtils, type ChildStatistics } from '../../../../shared/api';
// 선택된 프로필 로컬 저장소 관리 함수
import { loadSelectedProfile } from '../../../../features/profile/profileStorage';
// 로딩 화면 컴포넌트
import { LoadingScreen } from '../../../../components/ui/LoadingScreen';

/**
 * 학습 통계 화면 컴포넌트
 * 선택된 자녀의 학습 통계를 조회하고 카드 형태로 표시합니다.
 */
export default function MyPageStatsScreen() {
  // 상태 관리
  // 학습 통계 데이터 상태 (API에서 받아온 통계 정보)
  const [statistics, setStatistics] = useState<ChildStatistics | null>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [isLoading, setIsLoading] = useState(true);
  // 오류 상태 (API 호출 실패 시 오류 메시지)
  const [error, setError] = useState<string | null>(null);

  /**
   * 학습 통계 조회 함수
   * 선택된 프로필의 자녀 ID를 사용하여 학습 통계를 API에서 가져옵니다.
   * 프로필이 선택되지 않은 경우 오류를 발생시킵니다.
   */
  const fetchStatistics = async () => {
    console.warn('📊 학습 통계 API 호출 시작!');
    setIsLoading(true); // 로딩 상태 시작
    setError(null); // 이전 오류 상태 초기화

    try {
      // 로컬 저장소에서 선택된 프로필 불러오기
      const selectedProfile = await loadSelectedProfile();
      if (!selectedProfile) {
        throw new Error('선택된 프로필이 없습니다.'); // 프로필이 없으면 오류 발생
      }

      console.warn('👤 선택된 프로필:', selectedProfile.name, '(ID:', selectedProfile.childId, ')');

      // 선택된 자녀의 학습 통계 API 호출
      const data = await getChildStatistics(selectedProfile.childId);
      console.warn('✅ 학습 통계 API 성공:', data);

      setStatistics(data); // 받아온 통계 데이터를 상태에 저장
    } catch (error: any) {
      console.error('❌ 학습 통계 API 실패:', error);
      setError(error.message || '학습 통계를 불러오는데 실패했습니다.'); // 오류 상태 설정
      Alert.alert('오류', '학습 통계를 불러오는데 실패했습니다.'); // 사용자에게 오류 알림
    } finally {
      setIsLoading(false); // 로딩 상태 종료 (성공/실패 관계없이)
    }
  };

  // 컴포넌트 마운트 시 학습 통계 조회 (화면 진입 시 한 번만 실행)
  useEffect(() => {
    fetchStatistics();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (isLoading) {
    return <LoadingScreen message="학습 통계를 불러오는 중..." />; // 로딩 화면 컴포넌트 표시
  }

  // 오류 상태일 때 표시되는 화면 (API 호출 실패 또는 통계 데이터가 없는 경우)
  if (error || !statistics) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={{ flex: 1 }}>
          <BackButton /> {/* 뒤로가기 버튼 */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>오류</Text> {/* 오류 제목 */}
            <Text style={styles.summaryLabel}>
              {error || '학습 통계를 불러올 수 없습니다.'}
            </Text>{' '}
            {/* 오류 메시지 */}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 메인 화면 렌더링 (학습 통계가 정상적으로 로드된 상태)
  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <BackButton /> {/* 뒤로가기 버튼 */}
        {/* 가로 스크롤 가능한 컨테이너 (학습 요약과 총 학습 시간 카드들을 가로로 배치) */}
        <ScrollView
          horizontal // 가로 스크롤 설정
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
        >
          {/* 학습 요약 카드 (생성한 동화, 완성한 동화, 학습한 단어, 푼 퀴즈 통계) */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>학습 요약</Text> {/* 카드 제목 */}
            <View style={styles.summaryList}>
              {/* 총 생성한 동화 개수 */}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>총 생성한 동화</Text> {/* 항목 라벨 */}
                <Text style={styles.summaryValue}>{statistics.createdStories}개</Text>{' '}
                {/* 통계 값 */}
              </View>
              {/* 완성한 동화 개수 */}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>완성한 동화</Text> {/* 항목 라벨 */}
                <Text style={styles.summaryValue}>{statistics.completedStories}개</Text>{' '}
                {/* 통계 값 */}
              </View>
              {/* 학습한 단어 개수 */}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>학습한 단어</Text> {/* 항목 라벨 */}
                <Text style={styles.summaryValue}>{statistics.learnedWords}개</Text> {/* 통계 값 */}
              </View>
              {/* 푼 퀴즈 개수 */}
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>푼 퀴즈</Text> {/* 항목 라벨 */}
                <Text style={styles.summaryValue}>{statistics.solvedQuizzes}개</Text>{' '}
                {/* 통계 값 */}
              </View>
            </View>
          </View>

          {/* 총 학습 시간 카드 (포맷팅된 학습 시간 표시) */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>총 학습 시간</Text> {/* 카드 제목 */}
            <View style={styles.timeDisplayContainer}>
              <Text style={styles.timeDisplayText}>
                {statisticsUtils.formatLearningTime(statistics.totalLearningTimeMinutes)}{' '}
                {/* 포맷팅된 학습 시간 표시 */}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

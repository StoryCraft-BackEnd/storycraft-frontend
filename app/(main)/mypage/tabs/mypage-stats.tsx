import React from 'react';
import { View, Text, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import BackButton from '../../../../components/ui/BackButton';
import styles from '../../../../styles/MyPageStatsScreen.styles';
import nightBg from '../../../../assets/images/background/night-bg.png';

const weekStats = [
  { day: '월', count: 3, minutes: 20 },
  { day: '화', count: 2, minutes: 15 },
  { day: '수', count: 4, minutes: 25 },
  { day: '목', count: 1, minutes: 10 },
  { day: '금', count: 3, minutes: 18 },
  { day: '토', count: 5, minutes: 30 },
  { day: '일', count: 2, minutes: 12 },
];

const keywords = [
  { word: 'dragon', count: 5 },
  { word: 'princess', count: 4 },
  { word: 'magic', count: 3 },
  { word: 'forest', count: 2 },
  { word: 'adventure', count: 1 },
];

export default function MyPageStatsScreen() {
  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <BackButton />
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {/* 통합 요약 카드 */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>학습 요약</Text>
            <View style={styles.summaryList}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>총 생성한 동화</Text>
                <Text style={styles.summaryValue}>25개</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>이번 주 학습 시간</Text>
                <Text style={styles.summaryValue}>2시간 30분</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>연속 학습 일수</Text>
                <Text style={styles.summaryValue}>7일</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>주간 목표 달성</Text>
                <Text style={styles.summaryValue}>70%</Text>
              </View>
            </View>
          </View>

          {/* 이번 주 학습 현황 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이번 주 학습 현황</Text>
            <View style={styles.sectionContent}>
              {weekStats.map((stat) => (
                <View key={stat.day} style={styles.weekRow}>
                  <Text style={styles.weekDayLabel}>{stat.day}</Text>
                  <Text style={styles.weekDay}>동화 {stat.count}개</Text>
                  <View style={styles.weekBarBg}>
                    <View style={[styles.weekBar, { width: `${stat.minutes * 2}%` }]} />
                  </View>
                  <Text style={styles.weekMinutes}>{stat.minutes}분</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 주간 목표 */}
          <View style={styles.goalBox}>
            <Text style={styles.goalTitle}>주간 목표</Text>
            <View style={styles.goalContent}>
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>동화 읽기</Text>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBar, { width: '70%' }]} />
                </View>
                <Text style={styles.goalValue}>14/20개</Text>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>학습 시간</Text>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBar, { width: '62.5%' }]} />
                </View>
                <Text style={styles.goalValue}>2.5/4시간</Text>
              </View>
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>연속 학습</Text>
                <View style={styles.goalBarBg}>
                  <View style={[styles.goalBar, { width: '100%' }]} />
                </View>
                <Text style={styles.goalValue}>7/7일</Text>
              </View>
            </View>
          </View>

          {/* 자주 사용하는 키워드 */}
          <View style={styles.keywordBox}>
            <Text style={styles.keywordTitle}>자주 사용하는 키워드</Text>
            <View style={styles.keywordContent}>
              {keywords.map((kw) => (
                <View key={kw.word} style={styles.keywordRow}>
                  <View style={styles.keywordTag}>
                    <Text style={styles.keywordTagText}>{kw.word}</Text>
                  </View>
                  <View style={styles.keywordBarBg}>
                    <View style={[styles.keywordBar, { width: `${kw.count * 20}%` }]} />
                  </View>
                  <Text style={styles.keywordCount}>{kw.count}회</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

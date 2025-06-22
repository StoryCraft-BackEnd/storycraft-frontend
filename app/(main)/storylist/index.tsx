/**
 * @description
 * StoryCraft 동화 목록 페이지
 * 사용자가 생성한 모든 동화를 그리드 형태로 표시하는 화면입니다.
 */
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

// --- 내부 모듈 및 스타일 ---
import { createStoryListScreenStyles } from '@/styles/StoryListScreen.styles'; // 동화 목록 화면 전용 스타일

// --- 동화 커버 이미지 import ---
import story1 from '@/assets/images/illustrations/storycraft_cover_1.png';
import story2 from '@/assets/images/illustrations/storycraft_cover_2.png';
import story3 from '@/assets/images/illustrations/storycraft_cover_3.png';
import story4 from '@/assets/images/illustrations/storycraft_cover_4.png';
import story5 from '@/assets/images/illustrations/storycraft_cover_5.png';
import story6 from '@/assets/images/illustrations/storycraft_cover_6.png';
import story7 from '@/assets/images/illustrations/storycraft_cover_7.png';
import story8 from '@/assets/images/illustrations/storycraft_cover_8.png';

// 임시 동화 데이터 (나중에 실제 데이터로 교체)
const stories = [
  { id: 1, title: '동화 1', image: story1 },
  { id: 2, title: '동화 2', image: story2 },
  { id: 3, title: '동화 3', image: story3 },
  { id: 4, title: '동화 4', image: story4 },
  { id: 5, title: '동화 5', image: story5 },
  { id: 6, title: '동화 6', image: story6 },
  { id: 7, title: '동화 7', image: story7 },
  { id: 8, title: '동화 8', image: story8 },
];

/**
 * 동화 목록 화면의 메인 컴포넌트
 * 사용자가 생성한 모든 동화를 그리드 형태로 표시합니다.
 */
export default function StoryListScreen() {
  // 반응형 스타일을 생성합니다.
  const styles = createStoryListScreenStyles();

  return (
    <View style={styles.container}>
      {/* 헤더 영역 - 뒤로가기 버튼과 제목 */}
      <View style={styles.storyListHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<<'} 돌아가기</Text>
        </TouchableOpacity>
        <Text style={styles.storyListTitle}>전체 동화 목록</Text>
      </View>

      {/* 동화 갤러리 그리드 - 스크롤 가능한 동화 목록 */}
      <ScrollView
        contentContainerStyle={styles.storyListGrid}
        showsVerticalScrollIndicator={false} // 세로 스크롤바 숨김
      >
        {/* 동화 목록을 순회하며 각 동화를 그리드 아이템으로 렌더링 */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id} // React에서 리스트 렌더링 시 필요한 고유 키
            style={styles.storyGridItem}
            onPress={() => {
              // TODO: 동화 상세 페이지로 이동
              console.log('동화 선택:', story.id);
            }}
          >
            {/* 동화 커버 이미지 */}
            <Image source={story.image} style={styles.storyGridImage} />
            {/* 동화 제목 */}
            <Text style={styles.storyGridTitle}>{story.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

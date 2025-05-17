import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MainScreenStyles } from '@/styles/MainScreen';
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

export default function StoryListScreen() {
  return (
    <View style={MainScreenStyles.container}>
      {/* 헤더 */}
      <View style={MainScreenStyles.storyListHeader}>
        <TouchableOpacity onPress={() => router.back()} style={MainScreenStyles.backButton}>
          <Text style={MainScreenStyles.backButtonText}>{'<<'} 돌아가기</Text>
        </TouchableOpacity>
        <Text style={MainScreenStyles.storyListTitle}>전체 동화 목록</Text>
      </View>

      {/* 갤러리 그리드 */}
      <ScrollView
        contentContainerStyle={MainScreenStyles.storyListGrid}
        showsVerticalScrollIndicator={false}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={MainScreenStyles.storyGridItem}
            onPress={() => {
              // TODO: 동화 상세 페이지로 이동
              console.log('동화 선택:', story.id);
            }}
          >
            <Image source={story.image} style={MainScreenStyles.storyGridImage} />
            <Text style={MainScreenStyles.storyGridTitle}>{story.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

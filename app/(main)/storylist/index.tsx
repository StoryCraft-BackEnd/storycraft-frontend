/**
 * @description
 * StoryCraft 동화 목록 페이지
 * 사용자가 생성한 모든 동화를 그리드 형태로 표시하는 화면입니다.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- 내부 모듈 및 스타일 ---
import { createStoryListScreenStyles } from '@/styles/StoryListScreen.styles';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

// 임시 동화 데이터 (나중에 실제 데이터로 교체)
// 키워드 정보를 추가합니다.
const stories = [
  { id: 1, title: 'The Magical Forest Adventure', keywords: 'rabbit, forest, magic' },
  { id: 2, title: 'The Dragon and the Princess', keywords: 'princess, dragon, friendship' },
  { id: 3, title: 'The Secret of the Old Clock', keywords: 'mystery, time, adventure' },
  { id: 4, title: 'The Lost Treasure of Pirates', keywords: 'pirate, treasure, island' },
  { id: 5, title: 'A Journey to the Stars', keywords: 'space, rocket, stars' },
  { id: 6, title: 'The Whispering Woods', keywords: 'woods, secret, animals' },
];

/**
 * 동화 목록 화면의 메인 컴포넌트
 * 사용자가 생성한 모든 동화를 그리드 형태로 표시합니다.
 */
export default function StoryListScreen() {
  const styles = createStoryListScreenStyles();

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay} />

      {/* 헤더 요소들: 절대 위치로 배치됨 */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <MaterialCommunityIcons name="book-open-page-variant" size={30} color="white" />
        <Text style={styles.headerTitle}>My Story Collection</Text>
        <Ionicons name="sparkles" size={24} color="#FFD700" />
      </View>

      {/* 갤러리 그리드: 스크롤 가능한 콘텐츠 영역 */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.storyListGrid}
        showsVerticalScrollIndicator={false}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => {
              // TODO: 동화 상세 페이지로 이동
              console.log('동화 선택:', story.id);
            }}
          >
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyKeywords}>Keywords: {story.keywords}</Text>

            <LinearGradient colors={['#EADFFF', '#D1C4E9']} style={styles.illustrationPlaceholder}>
              <Ionicons name="sparkles-outline" size={40} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.illustrationText}>Story Illustration</Text>
            </LinearGradient>

            <TouchableOpacity style={styles.readButton}>
              <Ionicons name="eye-outline" size={20} color="white" />
              <Text style={styles.readButtonText}>Read Story</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

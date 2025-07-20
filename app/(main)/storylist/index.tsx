/**
 * @description
 * StoryCraft 동화 목록 페이지
 * 사용자가 생성한 모든 동화를 가로 스크롤 카드 형태로 표시하는 화면입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import styles from '@/styles/StoryListScreen.styles';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

// 탭 네비게이션 데이터
const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'star-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

// 임시 동화 데이터 (나중에 실제 데이터로 교체)
const initialStories = [
  {
    id: '1',
    title: '마법의 용과 공주님',
    date: '2024-01-15',
    tags: ['dragon', 'princess', 'castle'],
    summary: 'Once upon a time, there was a brave princess who met a friendly dragon...',
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '2',
    title: '숲 속의 요정 친구들',
    date: '2024-01-14',
    tags: ['fairy', 'forest', 'friendship'],
    summary: 'In a magical forest, little fairies lived together in harmony...',
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '3',
    title: '별빛 모험',
    date: '2024-01-13',
    tags: ['star', 'adventure', 'night'],
    summary: 'On a starry night, a young explorer discovered a magical path...',
    isBookmarked: false,
    isLiked: false,
  },
];

/**
 * 동화 목록 화면의 메인 컴포넌트
 * 사용자가 생성한 모든 동화를 가로 스크롤 카드 형태로 표시합니다.
 */
export default function StoryListScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState(initialStories);

  // 북마크 토글 함수
  const toggleBookmark = (storyId: string) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId ? { ...story, isBookmarked: !story.isBookmarked } : story
      )
    );
  };

  // 좋아요 토글 함수
  const toggleLike = (storyId: string) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId ? { ...story, isLiked: !story.isLiked } : story
      )
    );
  };

  // 탭에 따른 필터링된 스토리
  const getFilteredStories = () => {
    switch (activeTab) {
      case 'bookmark':
        return stories.filter((story) => story.isBookmarked);
      case 'like':
        return stories.filter((story) => story.isLiked);
      default:
        return stories;
    }
  };

  // 탭별 개수 계산
  const getTabCount = (tabKey: string) => {
    switch (tabKey) {
      case 'bookmark':
        return stories.filter((story) => story.isBookmarked).length;
      case 'like':
        return stories.filter((story) => story.isLiked).length;
      default:
        return stories.length;
    }
  };

  const filteredStories = getFilteredStories();

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      {/* 헤더 제목 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={24} color="#FFD700" />
          <Text style={styles.headerTitle}>My Magic Page</Text>
          <Ionicons name="sparkles" size={24} color="#FFD700" />
        </View>
      </View>

      {/* 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.iconName}
                size={18}
                color={isActive ? '#fff' : '#b3b3ff'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 동화 카드 목록 */}
      <FlatList
        data={filteredStories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardListContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.statusIcons}>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={styles.iconButton}>
                  <Ionicons
                    name={item.isBookmarked ? 'star' : 'star-outline'}
                    size={16}
                    color={item.isBookmarked ? '#FFD700' : '#B6AFFF'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.iconButton}>
                  <Ionicons
                    name={item.isLiked ? 'heart' : 'heart-outline'}
                    size={16}
                    color={item.isLiked ? '#FF6B6B' : '#B6AFFF'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.cardDate}>{item.date}</Text>

            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.cardSummary} numberOfLines={3}>
              {item.summary}
            </Text>

            {/* 버튼들을 카드 최하단에 배치 */}
            <View style={styles.actionButtonRow}>
              <TouchableOpacity
                style={styles.readButton}
                onPress={() => {
                  // TODO: 동화 상세 페이지로 이동
                  console.log('동화 읽기:', item.id);
                }}
              >
                <Ionicons name="book-outline" size={18} color="#fff" />
                <Text style={styles.readButtonText}>읽기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-social-outline" size={22} color="#B6AFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trash-outline" size={22} color="#B6AFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ImageBackground>
  );
}

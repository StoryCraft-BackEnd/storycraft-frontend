/**
 * @description
 * StoryCraft 동화 목록 페이지
 * 사용자가 생성한 모든 동화를 가로 스크롤 카드 형태로 표시하는 화면입니다.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import styles from '@/styles/StoryListScreen.styles';
import { loadStoriesFromStorage } from '@/features/storyCreate/storyStorage';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import { Story } from '@/features/storyCreate/types';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

// 탭 네비게이션 데이터
const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'star-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

/**
 * 동화 목록 화면의 메인 컴포넌트
 * 사용자가 생성한 모든 동화를 가로 스크롤 카드 형태로 표시합니다.
 */
export default function StoryListScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 프로필별 동화 목록 로드
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);

        // 선택된 프로필 불러오기
        const selectedProfile = await loadSelectedProfile();
        if (!selectedProfile) {
          console.log('선택된 프로필이 없습니다.');
          setStories([]);
          return;
        }

        // 프로필별 동화 목록 불러오기
        const profileStories = await loadStoriesFromStorage(selectedProfile.childId);
        console.log(`프로필 ${selectedProfile.name}의 동화 ${profileStories.length}개 로드 완료`);

        // UI 호환성을 위해 기본값 설정
        const storiesWithDefaults = profileStories.map((story) => ({
          ...story,
          isBookmarked: story.isBookmarked || false,
          isLiked: story.isLiked || false,
        }));

        setStories(storiesWithDefaults);
      } catch (error) {
        console.error('동화 목록 로드 실패:', error);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStories();
  }, []);

  // 북마크 토글 함수
  const toggleBookmark = (storyId: number) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.storyId === storyId ? { ...story, isBookmarked: !story.isBookmarked } : story
      )
    );
  };

  // 좋아요 토글 함수
  const toggleLike = (storyId: number) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.storyId === storyId ? { ...story, isLiked: !story.isLiked } : story
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
        <Ionicons name="arrow-back" size={20} color={styles.backButtonText.color} />
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
                color={isActive ? styles.activeTabText.color : styles.tabText.color}
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
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.loadingText}>동화 목록을 불러오는 중...</Text>
        </View>
      ) : filteredStories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {activeTab === 'all'
              ? '아직 생성된 동화가 없습니다.\n새로운 동화를 만들어보세요!'
              : `${TABS.find((tab) => tab.key === activeTab)?.label}한 동화가 없습니다.`}
          </Text>
          {activeTab === 'all' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/(main)/storycreate')}
            >
              <Text style={styles.createButtonText}>동화 만들기</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredStories}
          keyExtractor={(item) => item.storyId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardListContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.statusIcons}>
                  <TouchableOpacity
                    onPress={() => toggleBookmark(item.storyId)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={item.isBookmarked ? 'star' : 'star-outline'}
                      size={16}
                      style={
                        item.isBookmarked ? styles.bookmarkIconActive : styles.bookmarkIconInactive
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleLike(item.storyId)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={item.isLiked ? 'heart' : 'heart-outline'}
                      size={16}
                      style={item.isLiked ? styles.likeIconActive : styles.likeIconInactive}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>

              <View style={styles.tagRow}>
                {item.keywords?.slice(0, 3).map((keyword) => (
                  <View key={keyword} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.cardSummary} numberOfLines={3}>
                {item.content}
              </Text>

              {/* 버튼들을 카드 최하단에 배치 */}
              <View style={styles.actionButtonRow}>
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => {
                    // 영어 학습 화면으로 동화 데이터와 함께 이동
                    router.push({
                      pathname: '/(english-learning)',
                      params: {
                        storyId: item.storyId.toString(),
                        title: item.title,
                        content: item.content,
                        keywords: item.keywords?.join(',') || '',
                      },
                    });
                  }}
                >
                  <Ionicons name="book-outline" size={18} color="#fff" />
                  <Text style={styles.readButtonText}>읽기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="share-social-outline" size={22} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={22} style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import nightBg from '../../../../assets/images/background/night-bg.png';
import styles from '../../../../styles/StoryListTabScreen.styles';
import BackButton from '../../../../components/ui/BackButton';

const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'star-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

const DUMMY_STORIES = [
  {
    id: '1',
    title: '마법의 용과 공주님',
    date: '2024-01-15',
    tags: ['dragon', 'princess', 'castle'],
    summary:
      'Once upon a time, there was a brave princess who met a friendly dragon. They became the best of friends and had many adventures together in the magical castle.',
    isBookmarked: true,
    isLiked: true,
  },
  {
    id: '2',
    title: '숲 속의 요정 친구들',
    date: '2024-01-14',
    tags: ['fairy', 'forest', 'friendship'],
    summary:
      'In a magical forest, little fairies lived together in harmony. They shared their magic and helped each other through every challenge.',
    isBookmarked: false,
    isLiked: true,
  },
  {
    id: '3',
    title: '별빛 모험',
    date: '2024-01-13',
    tags: ['star', 'adventure', 'night'],
    summary:
      'On a starry night, a young explorer discovered a magical path that led to the stars. The journey was filled with wonder and discovery.',
    isBookmarked: true,
    isLiked: false,
  },
  {
    id: '4',
    title: '바다의 인어 공주',
    date: '2024-01-12',
    tags: ['mermaid', 'ocean', 'love'],
    summary:
      'Deep in the ocean, a beautiful mermaid princess dreamed of exploring the world above the waves. Her courage led to an amazing adventure.',
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '5',
    title: '시간 여행자의 모험',
    date: '2024-01-11',
    tags: ['time', 'travel', 'history'],
    summary:
      'A brave explorer discovered a magical clock that could travel through time. Each journey taught valuable lessons about history and friendship.',
    isBookmarked: true,
    isLiked: true,
  },
];

export default function StoryListScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState(DUMMY_STORIES);

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
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <BackButton />
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]}
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

      {filteredStories.length === 0 ? (
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
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.statusIcons}>
                  <TouchableOpacity onPress={() => toggleBookmark(item.id)} style={styles.iconBtn}>
                    <Ionicons
                      name={item.isBookmarked ? 'star' : 'star-outline'}
                      size={16}
                      color={item.isBookmarked ? '#FFD700' : '#B6AFFF'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.iconBtn}>
                    <Ionicons
                      name={item.isLiked ? 'heart' : 'heart-outline'}
                      size={16}
                      color={item.isLiked ? '#FF6B6B' : '#B6AFFF'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.summary} numberOfLines={2}>
                {item.summary}
              </Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>읽기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="share-social-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <MaterialIcons name="delete-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
}

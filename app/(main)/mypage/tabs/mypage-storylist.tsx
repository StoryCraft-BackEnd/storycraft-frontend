import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import nightBg from '../../../../assets/images/background/night-bg.png';
import styles from '../../../../styles/StoryListTabScreen.styles';
import BackButton from '../../../../components/ui/BackButton';
import { Popup } from '../../../../components/ui/Popup';
import { loadSelectedProfile } from '../../../../features/profile/profileStorage';
import {
  loadStoriesFromStorage,
  toggleStoryBookmark,
  toggleStoryLike,
  removeStoryFromStorage,
} from '../../../../features/storyCreate/storyStorage';
import { deleteStory, fetchUserStories } from '../../../../features/storyCreate/storyApi';
import { Story } from '../../../../features/storyCreate/types';

const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'star-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

export default function StoryListScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<{ id: number; title: string } | null>(null);

  // 컴포넌트 마운트 시 프로필별 동화 목록 로드
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);

        // 선택된 프로필 불러오기
        const profile = await loadSelectedProfile();
        if (!profile) {
          console.log('선택된 프로필이 없습니다.');
          setStories([]);
          return;
        }

        setSelectedProfile(profile);

        // 서버에서 동화 목록 가져오기 (서버-로컬 동기화)
        console.log(`프로필 ${profile.name}의 동화 목록 서버에서 가져오기 시작...`);
        try {
          const serverStories = await fetchUserStories(profile.childId);
          console.log(
            `프로필 ${profile.name}의 동화 ${serverStories.length}개 서버에서 가져오기 완료`
          );

          // UI 호환성을 위해 기본값 설정
          const storiesWithDefaults = serverStories.map((story) => ({
            ...story,
            isBookmarked: story.isBookmarked || false,
            isLiked: story.isLiked || false,
          }));

          setStories(storiesWithDefaults);
        } catch (serverError) {
          console.error('서버에서 동화 목록 가져오기 실패, 로컬 데이터 사용:', serverError);

          // 서버 실패 시 로컬에서 가져오기
          const profileStories = await loadStoriesFromStorage(profile.childId);
          console.log(
            `프로필 ${profile.name}의 동화 ${profileStories.length}개 로컬에서 로드 완료`
          );

          // UI 호환성을 위해 기본값 설정
          const storiesWithDefaults = profileStories.map((story) => ({
            ...story,
            isBookmarked: story.isBookmarked || false,
            isLiked: story.isLiked || false,
          }));

          setStories(storiesWithDefaults);
        }
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
  const toggleBookmark = async (storyId: number) => {
    if (!selectedProfile) return;

    try {
      await toggleStoryBookmark(selectedProfile.childId, storyId);
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.storyId === storyId ? { ...story, isBookmarked: !story.isBookmarked } : story
        )
      );
      console.log('북마크 토글 완료:', storyId);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
    }
  };

  // 좋아요 토글 함수
  const toggleLike = async (storyId: number) => {
    if (!selectedProfile) return;

    try {
      await toggleStoryLike(selectedProfile.childId, storyId);
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.storyId === storyId ? { ...story, isLiked: !story.isLiked } : story
        )
      );
      console.log('좋아요 토글 완료:', storyId);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
    }
  };

  // 동화 삭제 함수
  const handleDeleteStory = async (storyId: number, storyTitle: string) => {
    if (!selectedProfile) return;

    // 삭제할 동화 정보 저장
    setStoryToDelete({ id: storyId, title: storyTitle });
    setDeletePopupVisible(true);
  };

  const confirmDeleteStory = async () => {
    if (!selectedProfile || !storyToDelete) return;

    try {
      // 서버에서 삭제
      await deleteStory(selectedProfile.childId, storyToDelete.id);

      // 로컬에서도 삭제
      await removeStoryFromStorage(selectedProfile.childId, storyToDelete.id);

      // UI에서 제거
      setStories((prevStories) =>
        prevStories.filter((story) => story.storyId !== storyToDelete.id)
      );

      console.log('동화 삭제 완료:', storyToDelete.id);
    } catch (error) {
      console.error('동화 삭제 실패:', error);
      Alert.alert('삭제 실패', '동화 삭제 중 오류가 발생했습니다. 다시 시도해주세요.', [
        { text: '확인' },
      ]);
    } finally {
      setDeletePopupVisible(false);
      setStoryToDelete(null);
    }
  };

  const cancelDeleteStory = () => {
    setDeletePopupVisible(false);
    setStoryToDelete(null);
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

  if (isLoading) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>동화 목록을 불러오는 중...</Text>
        </View>
      </ImageBackground>
    );
  }

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
          keyExtractor={(item) => item.storyId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.statusIcons}>
                  <TouchableOpacity
                    onPress={() => toggleBookmark(item.storyId)}
                    style={styles.iconBtn}
                  >
                    <Ionicons
                      name={item.isBookmarked ? 'star' : 'star-outline'}
                      size={16}
                      color={item.isBookmarked ? '#FFD700' : '#B6AFFF'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleLike(item.storyId)} style={styles.iconBtn}>
                    <Ionicons
                      name={item.isLiked ? 'heart' : 'heart-outline'}
                      size={16}
                      color={item.isLiked ? '#FF6B6B' : '#B6AFFF'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              <View style={styles.tagRow}>
                {item.keywords?.slice(0, 3).map((keyword) => (
                  <View key={keyword} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.summary} numberOfLines={2}>
                {item.content}
              </Text>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    // 영어 학습 화면으로 동화 데이터와 함께 이동
                    router.push({
                      pathname: '/(english-learning)',
                      params: {
                        storyId: item.storyId.toString(),
                        title: item.title,
                        content: item.content,
                        contentKr: item.contentKr || '',
                        keywords: item.keywords?.join(',') || '',
                      },
                    });
                  }}
                >
                  <Text style={styles.actionBtnText}>읽기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="share-social-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDeleteStory(item.storyId, item.title)}
                >
                  <MaterialIcons name="delete-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* 삭제 확인 팝업 */}
      <Popup
        visible={deletePopupVisible}
        onClose={cancelDeleteStory}
        title="동화 삭제"
        message={`"${storyToDelete?.title}" 동화를 정말 삭제하시겠습니까?\n\n삭제된 동화는 복구할 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={confirmDeleteStory}
        onCancel={cancelDeleteStory}
      />
    </ImageBackground>
  );
}

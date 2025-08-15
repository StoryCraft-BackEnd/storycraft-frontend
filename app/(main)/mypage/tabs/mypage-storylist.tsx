import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import nightBg from '../../../../assets/images/background/night-bg.png';
import styles from '../../../../styles/StoryListTabScreen.styles';
import BackButton from '../../../../components/ui/BackButton';
import { Popup } from '../../../../components/ui/Popup';
import {
  loadStoriesFromStorage,
  toggleStoryBookmarkNew,
  toggleStoryLikeNew,
  removeStoryFromStorage,
  attachUserPreferences,
} from '../../../../features/storyCreate/storyStorage';
import { loadSelectedProfile } from '../../../../features/profile/profileStorage';
import { deleteStory, fetchUserStories } from '../../../../features/storyCreate/storyApi';
import { Story, StoryData } from '../../../../features/storyCreate/types';

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

  /**
   * 동화 목록 로드 함수 (초기 로드용)
   *
   * 동작 과정:
   * 1. 서버에서 동화 목록 조회
   * 2. 별도 저장된 북마크/좋아요 상태와 연결
   * 3. 새로운 동화만 추가하고 기존 동화는 상태 보존
   * 4. 동화 내용 변경 여부에 따라 북마크/좋아요 상태 결정
   *
   * 북마크/좋아요 상태 보존 로직:
   * - 기존 동화: 북마크/좋아요 상태 그대로 유지
   * - 새로운 동화: 기본값(false)으로 설정
   * - 동화 내용이 변경된 경우: 상태 초기화
   */
  const loadStories = useCallback(async () => {
    try {
      setIsLoading(true);

      // 선택된 프로필 불러오기
      const profile = await loadSelectedProfile();
      if (!profile) {
        console.log('선택된 프로필이 없습니다.');
        setStories([]);
        setIsLoading(false);
        return;
      }

      setSelectedProfile(profile);

      // === 1단계: 서버에서 동화 목록 조회 ===
      try {
        const serverStories = await fetchUserStories(profile.childId);
        console.log(`서버에서 ${serverStories.length}개의 동화 조회 완료`);

        // === 2단계: 별도 저장된 북마크/좋아요 상태와 연결 ===
        const storiesWithPreferences = await attachUserPreferences(
          profile.childId,
          serverStories.map((storyData) => ({
            ...storyData,
            childId: profile.childId,
            isBookmarked: false, // 기본값
            isLiked: false, // 기본값
          }))
        );
        console.log('북마크/좋아요 상태 연결 완료');

        // === 3단계: UI 업데이트 ===
        setStories(storiesWithPreferences);
        setIsLoading(false);
      } catch (serverError) {
        console.error('서버에서 동화 목록 가져오기 실패, 로컬 데이터 사용:', serverError);

        // === 4단계: 서버 실패 시 로컬 데이터 사용 ===
        const localStories = await loadStoriesFromStorage(profile.childId);
        const localStoriesWithPreferences = await attachUserPreferences(
          profile.childId,
          localStories
        );

        setStories(localStoriesWithPreferences);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('동화 목록 로드 실패:', error);
      setStories([]);
      setIsLoading(false);
    }
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  /**
   * 화면 포커스 시 데이터 새로고침 함수 (로딩 상태 없음)
   *
   * 목적:
   * - 다른 화면에서 북마크/좋아요를 변경한 후 돌아왔을 때 최신 상태 반영
   * - 별도 저장된 북마크/좋아요 상태만 새로고침
   * - 서버 동기화 없이 빠르고 안전하게 상태 복원
   */
  const refreshStories = useCallback(async () => {
    try {
      // 선택된 프로필 불러오기
      const profile = await loadSelectedProfile();
      if (!profile) {
        console.log('선택된 프로필이 없습니다.');
        return;
      }

      // 로컬에서 동화 목록을 가져온 후 북마크/좋아요 상태 연결
      const localStories = await loadStoriesFromStorage(profile.childId);
      const storiesWithPreferences = await attachUserPreferences(profile.childId, localStories);

      console.log(`프로필 ${profile.name}의 동화 ${localStories.length}개 로컬에서 새로고침 완료`);

      // 북마크/좋아요 상태가 연결된 데이터로 UI 업데이트
      setStories(storiesWithPreferences);
      console.log('✅ 로컬 데이터 새로고침 완료 - 북마크/좋아요 상태 보존됨');
    } catch (error) {
      console.error('동화 목록 새로고침 실패:', error);
    }
  }, []);

  // === 화면 포커스 및 데이터 동기화 ===

  /**
   * 화면이 포커스될 때마다 데이터 새로 로드
   *
   * 목적:
   * - 다른 화면에서 북마크/좋아요를 변경한 후 돌아왔을 때 최신 상태 반영
   * - 서버에서 동화 내용이 업데이트되었을 때 동기화
   * - 북마크/좋아요 상태가 초기화되는 문제 해결
   *
   * 동작:
   * 1. 화면이 포커스될 때마다 자동 실행
   * 2. selectedProfile이 설정된 후에만 실행
   * 3. 스마트 병합으로 북마크/좋아요 상태 보존
   * 4. 로딩 상태 없이 부드럽게 업데이트
   */
  useFocusEffect(
    React.useCallback(() => {
      // 이미 selectedProfile이 설정되어 있고, stories가 로드된 경우에만 새로고침
      if (selectedProfile && stories.length > 0) {
        console.log('마이페이지 동화 목록 탭 포커스됨 - 데이터 새로고침');
        refreshStories(); // 로딩 상태 없는 새로고침 함수 사용
      }
    }, [selectedProfile, refreshStories, stories.length])
  );

  /**
   * 컴포넌트 마운트 시 데이터 로드
   *
   * 목적:
   * - 화면이 처음 로드될 때 기본 데이터 표시
   * - useFocusEffect와 함께 사용하여 완벽한 데이터 동기화
   */
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 실행
    loadStories();
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // === 북마크/좋아요 토글 함수들 ===

  /**
   * 동화 북마크 토글 함수
   *
   * 동작 과정:
   * 1. 선택된 프로필이 있는지 확인
   * 2. 로컬 스토리지에서 해당 동화의 북마크 상태를 반전
   * 3. UI 상태를 즉시 업데이트하여 사용자에게 피드백 제공
   * 4. 로컬 스토리지에 변경사항 저장
   *
   * @param storyId - 북마크를 토글할 동화의 ID
   */
  const toggleBookmark = async (storyId: number) => {
    if (!selectedProfile) return;

    try {
      // 로컬 스토리지에서 북마크 상태 토글
      await toggleStoryBookmarkNew(selectedProfile.childId, storyId);

      // UI 상태 즉시 업데이트 (사용자 경험 향상)
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

  /**
   * 동화 좋아요 토글 함수
   *
   * 동작 과정:
   * 1. 선택된 프로필이 있는지 확인
   * 2. 로컬 스토리지에서 해당 동화의 좋아요 상태를 반전
   * 3. UI 상태를 즉시 업데이트하여 사용자에게 피드백 제공
   * 4. 로컬 스토리지에 변경사항 저장
   *
   * @param storyId - 좋아요를 토글할 동화의 ID
   */
  const toggleLike = async (storyId: number) => {
    if (!selectedProfile) return;

    try {
      // 로컬 스토리지에서 좋아요 상태 토글
      await toggleStoryLikeNew(selectedProfile.childId, storyId);

      // UI 상태 즉시 업데이트 (사용자 경험 향상)
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

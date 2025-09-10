/**
 * 동화 관리 화면 컴포넌트
 * 사용자가 생성한 동화 목록을 조회하고 관리하는 화면입니다.
 * 전체 동화, 북마크한 동화, 좋아요한 동화로 탭을 나누어 필터링하여 표시합니다.
 * 동화 읽기, 북마크/좋아요 토글, 삭제 등의 기능을 제공합니다.
 * 서버와 로컬 저장소를 동기화하여 데이터를 관리합니다.
 */

// React: React 라이브러리의 기본 기능들
import React, { useState, useEffect, useCallback } from 'react';
// React Native: 네이티브 UI 컴포넌트들
import {
  View, // 컨테이너 컴포넌트 (div와 비슷한 역할)
  Text, // 텍스트 표시 컴포넌트
  TouchableOpacity, // 터치 가능한 버튼 컴포넌트
  ImageBackground, // 배경 이미지가 있는 컨테이너
  FlatList, // 리스트 렌더링 컴포넌트
  Alert, // 알림 팝업 표시용
  ActivityIndicator, // 로딩 스피너 컴포넌트
} from 'react-native';
// 아이콘 라이브러리들
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// Expo Router: 화면 간 이동(네비게이션) 관련
import { router, useFocusEffect } from 'expo-router';
// 배경 이미지 (밤하늘 배경)
import nightBg from '../../../../assets/images/background/night-bg.png';
// 동화 목록 화면 전용 스타일
import styles from '../../../../styles/StoryListTabScreen.styles';
// 뒤로가기 버튼 컴포넌트
import BackButton from '../../../../components/ui/BackButton';
// 팝업 컴포넌트 (삭제 확인 등)
import { Popup } from '../../../../components/ui/Popup';
// 동화 관련 로컬 저장소 관리 함수들
import {
  loadStoriesFromStorage, // 로컬에서 동화 목록 불러오기
  toggleStoryBookmarkNew, // 동화 북마크 토글
  toggleStoryLikeNew, // 동화 좋아요 토글
  removeStoryFromStorage, // 로컬에서 동화 삭제
  attachUserPreferences, // 사용자 선호도(북마크/좋아요) 연결
} from '../../../../features/storyCreate/storyStorage';
// 선택된 프로필 로컬 저장소 관리 함수
import { loadSelectedProfile } from '../../../../features/profile/profileStorage';
// 동화 관련 API 함수들
import { deleteStory, fetchUserStories } from '../../../../features/storyCreate/storyApi';
// 동화 캐시 무효화 함수
import { invalidateStoriesCache } from '../../../../features/storyCreate/storyStorage';
// 동화 관련 타입 정의
import { Story, StoryData } from '../../../../features/storyCreate/types';

// 탭 구성 상수 (전체 동화, 북마크, 좋아요)
const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'star-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

/**
 * 동화 관리 화면 컴포넌트
 * 사용자의 동화 목록을 탭별로 필터링하여 표시하고, 동화 관리 기능을 제공합니다.
 */
export default function StoryListScreen() {
  // ===== 상태 변수 정의 =====
  // 활성 탭 상태 (현재 선택된 탭)
  const [activeTab, setActiveTab] = useState('all');
  // 동화 목록 상태 (API에서 받아온 동화 데이터)
  const [stories, setStories] = useState<Story[]>([]);
  // 선택된 프로필 상태 (현재 선택된 자녀 프로필)
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  // 로딩 상태 (API 호출 중 여부)
  const [isLoading, setIsLoading] = useState(true);
  // 삭제 팝업 표시 상태
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  // 삭제할 동화 정보 상태 (삭제 확인 팝업에서 사용)
  const [storyToDelete, setStoryToDelete] = useState<{ id: number; title: string } | null>(null);

  // ===== 함수 정의 부분 =====
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

  // === 동화 삭제 관련 함수들 ===

  /**
   * 동화 삭제 요청 함수
   * 삭제할 동화 정보를 저장하고 삭제 확인 팝업을 표시합니다.
   * @param {number} storyId - 삭제할 동화의 ID
   * @param {string} storyTitle - 삭제할 동화의 제목
   */
  const handleDeleteStory = async (storyId: number, storyTitle: string) => {
    if (!selectedProfile) return; // 선택된 프로필이 없으면 종료

    // 삭제할 동화 정보 저장 (팝업에서 사용)
    setStoryToDelete({ id: storyId, title: storyTitle });
    setDeletePopupVisible(true); // 삭제 확인 팝업 표시
  };

  /**
   * 동화 삭제 확인 함수
   * 서버와 로컬 저장소에서 동화를 삭제하고 UI를 업데이트합니다.
   */
  const confirmDeleteStory = async () => {
    if (!selectedProfile || !storyToDelete) return; // 필요한 데이터가 없으면 종료

    try {
      // 서버에서 동화 삭제
      await deleteStory(selectedProfile.childId, storyToDelete.id);

      // 로컬 저장소에서도 동화 삭제
      await removeStoryFromStorage(selectedProfile.childId, storyToDelete.id);

      // 동화 목록 캐시 무효화 (메인 화면 새로고침을 위해)
      await invalidateStoriesCache(selectedProfile.childId);

      // UI에서 동화 제거 (즉시 반영)
      setStories((prevStories) =>
        prevStories.filter((story) => story.storyId !== storyToDelete.id)
      );

      console.log('동화 삭제 완료:', storyToDelete.id);
    } catch (error) {
      console.error('동화 삭제 실패:', error);
      Alert.alert('삭제 실패', '동화 삭제 중 오류가 발생했습니다. 다시 시도해주세요.', [
        { text: '확인' },
      ]); // 사용자에게 오류 알림
    } finally {
      setDeletePopupVisible(false); // 팝업 닫기
      setStoryToDelete(null); // 삭제할 동화 정보 초기화
    }
  };

  /**
   * 동화 삭제 취소 함수
   * 삭제 확인 팝업을 닫고 삭제할 동화 정보를 초기화합니다.
   */
  const cancelDeleteStory = () => {
    setDeletePopupVisible(false); // 팝업 닫기
    setStoryToDelete(null); // 삭제할 동화 정보 초기화
  };

  // === 필터링 및 유틸리티 함수들 ===

  /**
   * 탭에 따른 필터링된 동화 목록 반환 함수
   * 현재 선택된 탭에 따라 동화 목록을 필터링합니다.
   * @returns 필터링된 동화 목록
   */
  const getFilteredStories = () => {
    switch (activeTab) {
      case 'bookmark':
        // 북마크 탭: 북마크된 동화만 필터링
        return stories.filter((story) => story.isBookmarked);
      case 'like':
        // 좋아요 탭: 좋아요한 동화만 필터링
        return stories.filter((story) => story.isLiked);
      default:
        // 전체 탭: 모든 동화 반환
        return stories;
    }
  };

  /**
   * 탭별 동화 개수 계산 함수
   * 각 탭에 표시될 동화 개수를 계산합니다.
   * @param {string} tabKey - 탭 키 ('all', 'bookmark', 'like')
   * @returns {number} 해당 탭의 동화 개수
   */
  const getTabCount = (tabKey: string) => {
    switch (tabKey) {
      case 'bookmark':
        // 북마크 탭: 북마크된 동화 개수
        return stories.filter((story) => story.isBookmarked).length;
      case 'like':
        // 좋아요 탭: 좋아요한 동화 개수
        return stories.filter((story) => story.isLiked).length;
      default:
        // 전체 탭: 모든 동화 개수
        return stories.length;
    }
  };

  // ===== 실행 부분 =====
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

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 실행
    loadStories();
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 현재 탭에 맞는 필터링된 동화 목록
  const filteredStories = getFilteredStories();

  // 로딩 상태일 때 표시되는 화면 (API 호출 중)
  if (isLoading) {
    return (
      <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
        <BackButton /> {/* 뒤로가기 버튼 */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>동화 목록을 불러오는 중...</Text> {/* 로딩 메시지 */}
        </View>
      </ImageBackground>
    );
  }

  // 메인 화면 렌더링 (동화 목록이 정상적으로 로드된 상태)
  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <BackButton /> {/* 뒤로가기 버튼 */}
      {/* 탭 네비게이션 (전체 동화, 북마크, 좋아요) */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key; // 현재 활성 탭 여부
          const count = getTabCount(tab.key); // 탭별 동화 개수
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]} // 활성 탭 스타일 적용
              onPress={() => setActiveTab(tab.key)} // 탭 클릭 시 활성 탭 변경
            >
              <Ionicons
                name={tab.iconName}
                size={18}
                color={isActive ? '#fff' : '#b3b3ff'} // 활성 탭은 흰색, 비활성 탭은 연한 보라색
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label} ({count}) {/* 탭 라벨과 동화 개수 표시 */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* 동화 목록이 없을 때 표시되는 빈 상태 화면 */}
      {filteredStories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} style={styles.emptyIcon} /> {/* 빈 상태 아이콘 */}
          <Text style={styles.emptyText}>
            {activeTab === 'all'
              ? '아직 생성된 동화가 없습니다.\n새로운 동화를 만들어보세요!' // 전체 탭일 때 메시지
              : `${TABS.find((tab) => tab.key === activeTab)?.label}한 동화가 없습니다.`}{' '}
            {/* 필터 탭일 때 메시지 */}
          </Text>
          {/* 전체 탭일 때만 동화 만들기 버튼 표시 */}
          {activeTab === 'all' && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/(main)/storycreate')} // 동화 생성 화면으로 이동
            >
              <Text style={styles.createButtonText}>동화 만들기</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* 동화 목록이 있을 때 표시되는 가로 스크롤 리스트 */
        <FlatList
          data={filteredStories} // 필터링된 동화 목록
          keyExtractor={(item) => item.storyId.toString()} // 고유 키 추출
          horizontal // 가로 스크롤 설정
          showsHorizontalScrollIndicator={false} // 스크롤 인디케이터 숨김
          contentContainerStyle={styles.cardList}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* 동화 카드 헤더 (제목과 북마크/좋아요 아이콘) */}
              <View style={styles.cardHeader}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                  {item.title.length > 15 ? `${item.title.substring(0, 15)}...` : item.title}{' '}
                  {/* 제목 길이 제한 */}
                </Text>
                <View style={styles.statusIcons}>
                  {/* 북마크 토글 버튼 */}
                  <TouchableOpacity
                    onPress={() => toggleBookmark(item.storyId)} // 북마크 토글 함수 호출
                    style={styles.iconBtn}
                  >
                    <Ionicons
                      name={item.isBookmarked ? 'star' : 'star-outline'} // 북마크 상태에 따라 아이콘 변경
                      size={16}
                      color={item.isBookmarked ? '#FFD700' : '#B6AFFF'} // 북마크 상태에 따라 색상 변경
                    />
                  </TouchableOpacity>
                  {/* 좋아요 토글 버튼 */}
                  <TouchableOpacity onPress={() => toggleLike(item.storyId)} style={styles.iconBtn}>
                    <Ionicons
                      name={item.isLiked ? 'heart' : 'heart-outline'} // 좋아요 상태에 따라 아이콘 변경
                      size={16}
                      color={item.isLiked ? '#FF6B6B' : '#B6AFFF'} // 좋아요 상태에 따라 색상 변경
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* 동화 생성일 표시 */}
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              {/* 동화 키워드 태그들 (최대 3개) */}
              <View style={styles.tagRow}>
                {item.keywords?.slice(0, 3).map((keyword) => (
                  <View key={keyword} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
              </View>
              {/* 동화 내용 요약 (최대 2줄) */}
              <Text style={styles.summary} numberOfLines={2}>
                {item.content}
              </Text>
              {/* 동화 액션 버튼들 (읽기, 공유, 삭제) */}
              <View style={styles.btnRow}>
                {/* 동화 읽기 버튼 */}
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
                {/* 공유 버튼 */}
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="share-social-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
                {/* 삭제 버튼 */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDeleteStory(item.storyId, item.title)} // 삭제 함수 호출
                >
                  <MaterialIcons name="delete-outline" size={22} color="#B6AFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      {/* 삭제 확인 팝업 (동화 삭제 시 확인을 위한 모달) */}
      <Popup
        visible={deletePopupVisible} // 팝업 표시 여부
        onClose={cancelDeleteStory} // 팝업 닫기 핸들러
        title="동화 삭제" // 팝업 제목
        message={`"${storyToDelete?.title}" 동화를 정말 삭제하시겠습니까?\n\n삭제된 동화는 복구할 수 없습니다.`} // 삭제 확인 메시지
        confirmText="삭제" // 확인 버튼 텍스트
        cancelText="취소" // 취소 버튼 텍스트
        onConfirm={confirmDeleteStory} // 삭제 확인 핸들러
        onCancel={cancelDeleteStory} // 삭제 취소 핸들러
      />
    </ImageBackground>
  );
}

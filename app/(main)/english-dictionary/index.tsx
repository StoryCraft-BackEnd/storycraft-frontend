/**
 * @description
 * StoryCraft 영어 사전 페이지
 * 영어 단어 검색, 필터링, 발음, 예문 학습 기능을 제공합니다.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/EnglishDictionaryScreen.styles';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import {
  loadFavoriteWords,
  addFavoriteWord,
  removeFavoriteWord,
} from '@/features/storyCreate/storyStorage';
import { FavoriteWord } from '@/features/storyCreate/types';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

// 단어 타입 정의
interface Word {
  id: string;
  english: string;
  pronunciation: string;
  korean: string;
  difficulty: 'easy' | 'normal' | 'hard';
  example: {
    english: string;
    korean: string;
  };
  audio?: string;
}

// 난이도별 필터 옵션
const DIFFICULTY_FILTERS = [
  { key: 'all', label: '전체', color: '#FFD700' }, // COLORS.difficultyAll
  { key: 'easy', label: '쉬움', color: '#4CAF50' }, // COLORS.difficultyEasy
  { key: 'normal', label: '보통', color: '#FF9800' }, // COLORS.difficultyNormal
  { key: 'hard', label: '어려움', color: '#F44336' }, // COLORS.difficultyHard
];

// 임시 단어 데이터 (나중에 실제 API로 교체)
// const SAMPLE_WORDS: Word[] = [ ... ]; // 제거됨

/**
 * 영어 사전 화면의 메인 컴포넌트
 * - 영어 단어 검색, 필터링, 발음, 예문 학습 기능 제공
 * - 좌우 스크롤만 지원 (상하 스크롤 제한)
 * - 반응형 디자인 적용
 */
export default function EnglishDictionaryScreen() {
  // ===== 상태 변수 정의 =====
  const [words, setWords] = useState<Word[]>([]); // 전체 단어 목록 (즐겨찾기 단어만)
  const [filteredWords, setFilteredWords] = useState<Word[]>([]); // 필터링된 단어 목록
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [activeFilter, setActiveFilter] = useState('all'); // 현재 선택된 난이도 필터
  const [favoriteWords, setFavoriteWords] = useState<FavoriteWord[]>([]); // 즐겨찾기 단어 목록 (동화별 구분)
  const [selectedProfile, setSelectedProfile] = useState<{ childId: number; name: string } | null>(
    null
  ); // 현재 선택된 프로필
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set()); // 뒤집힌 카드 ID 목록

  // ===== 함수 정의 부분 =====
  /**
   * 즐겨찾기 단어 데이터 로드 함수
   * 현재 선택된 프로필의 즐겨찾기 단어 목록을 가져옴
   */
  const loadFavoriteWordsData = async () => {
    try {
      const profile = await loadSelectedProfile();
      if (profile) {
        setSelectedProfile(profile);
        console.log('🔍 프로필 로드 완료:', profile);

        const favorites = await loadFavoriteWords(profile.childId);
        console.log('⭐ 즐겨찾기 단어 로드 완료:', favorites);
        setFavoriteWords(favorites);

        // 즐겨찾기 단어를 Word 타입으로 변환하여 words 상태에 추가
        if (favorites && favorites.length > 0) {
          const favoriteWordObjects = favorites.map((fav, index) => ({
            id: `fav_${index}`,
            english: fav.word,
            pronunciation: `[${fav.word}]`, // 임시 발음 (나중에 실제 발음 API 연동)
            korean: fav.meaning,
            difficulty: 'normal' as const, // 기본값
            example: {
              english: fav.exampleEng || `This is an example sentence with ${fav.word}.`,
              korean: fav.exampleKor || `${fav.meaning}에 대한 예문입니다.`,
            },
            audio: undefined,
          }));

          console.log('🔄 즐겨찾기 단어를 Word 타입으로 변환:', favoriteWordObjects);

          // 기존 샘플 단어와 즐겨찾기 단어를 합침
          const allWords = [...favoriteWordObjects];
          console.log(
            '📚 최종 단어 목록:',
            allWords.map((w) => w.english)
          );
          setWords(allWords);
          setFilteredWords(allWords);
        }
      }
    } catch (error) {
      console.error('즐겨찾기 단어 로드 실패:', error);
    }
  };

  /**
   * 단어 필터링 함수
   * 검색어와 난이도 필터를 적용하여 단어 목록을 필터링
   */
  const filterWords = () => {
    let filtered = words;

    // 검색어 필터링 (영어 단어 또는 한글 뜻으로 검색)
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (word) =>
          word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.korean.includes(searchQuery)
      );
    }

    // 난이도 필터링 (전체가 아닌 경우에만 적용)
    if (activeFilter !== 'all') {
      filtered = filtered.filter((word) => word.difficulty === activeFilter);
    }

    setFilteredWords(filtered);
  };

  /**
   * 즐겨찾기 토글 함수
   * 단어를 즐겨찾기에 추가하거나 제거
   * 프로필별로 독립적으로 관리
   * @param word 토글할 단어
   */
  const toggleFavorite = async (word: string) => {
    if (!selectedProfile) {
      Alert.alert('알림', '프로필을 선택해주세요.');
      return;
    }

    try {
      const isFavorite = favoriteWords.some((fav) => fav.word === word);

      if (isFavorite) {
        // 즐겨찾기 제거
        await removeFavoriteWord(selectedProfile.childId, word);

        // 즐겨찾기 목록에서 즉시 제거
        const updatedFavorites = favoriteWords.filter((w) => w.word !== word);
        setFavoriteWords(updatedFavorites);

        // 단어 목록에서도 즉시 제거
        const updatedWords = words.filter((w) => w.english !== word);
        setWords(updatedWords);

        console.log(`⭐ 즐겨찾기 제거 완료: ${word}`);
      } else {
        // 즐겨찾기 추가 - 기본값 설정 (임시 storyId: 0)
        const newFavoriteWord: FavoriteWord = {
          word,
          meaning: `Meaning of ${word}`, // 기본 의미
          exampleEng: `This is an example sentence with ${word}.`, // 기본 영어 예문
          exampleKor: `${word}에 대한 예문입니다.`, // 기본 한국어 예문
          storyId: 0, // 임시 동화 ID (영어 사전에서 직접 추가한 경우)
          favoritedAt: new Date().toISOString(),
        };

        await addFavoriteWord(selectedProfile.childId, newFavoriteWord);
        setFavoriteWords((prev) => [...prev, newFavoriteWord]);

        // 단어 목록에 새 단어 추가
        const newWord: Word = {
          id: `fav_${Date.now()}`, // 고유 ID 생성
          english: word,
          pronunciation: `[${word}]`,
          korean: newFavoriteWord.meaning,
          difficulty: 'normal' as const,
          example: {
            english: newFavoriteWord.exampleEng,
            korean: newFavoriteWord.exampleKor,
          },
          audio: undefined,
        };

        setWords((prev) => [...prev, newWord]);
        console.log(`⭐ 즐겨찾기 추가 완료: ${word}`);
      }

      // 필터링된 단어 목록도 업데이트
      filterWords();
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      Alert.alert('오류', '즐겨찾기 설정에 실패했습니다.');
    }
  };

  /**
   * 카드 뒤집기 함수
   * 카드 ID를 기반으로 뒤집힌 상태를 토글
   * Set을 사용하여 효율적인 상태 관리
   * @param wordId 뒤집을 카드의 ID
   */
  const flipCard = (wordId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId); // 뒤집힌 상태에서 원래 상태로
      } else {
        newSet.add(wordId); // 원래 상태에서 뒤집힌 상태로
      }
      return newSet;
    });
  };

  /**
   * 발음 재생 함수 (임시 구현)
   * 현재는 알림으로 대체, 향후 TTS API 연동 예정
   * @param word 발음을 재생할 단어
   */
  const playPronunciation = (word: Word) => {
    Alert.alert('발음 재생', `${word.english}의 발음을 재생합니다.`);
    // TODO: 실제 TTS API 연동
  };

  /**
   * 난이도별 색상 반환 함수
   * 쉬움: 초록, 보통: 주황, 어려움: 빨강
   * @param difficulty 난이도 ('easy', 'normal', 'hard')
   * @returns 해당 난이도의 색상
   */
  const getDifficultyColor = (difficulty: string) => {
    const filter = DIFFICULTY_FILTERS.find((f) => f.key === difficulty);
    return filter?.color || COLORS.textSecondary;
  };

  /**
   * 난이도별 한글 라벨 반환 함수
   * 쉬움, 보통, 어려움으로 표시
   * @param difficulty 난이도 ('easy', 'normal', 'hard')
   * @returns 해당 난이도의 한글 라벨
   */
  const getDifficultyLabel = (difficulty: string) => {
    const filter = DIFFICULTY_FILTERS.find((f) => f.key === difficulty);
    return filter?.label || '보통';
  };

  /**
   * 단어 카드 렌더링 함수
   * 카드의 뒤집힌 상태에 따라 다른 UI 렌더링
   * 반응형 디자인 적용
   * @param item 렌더링할 단어 객체
   * @returns 단어 카드 JSX 요소
   */
  const renderWordCard = ({ item }: { item: Word }) => {
    const isFlipped = flippedCards.has(item.id); // 카드 뒤집힌 상태 확인
    const isFavorite = favoriteWords.some((fav) => fav.word === item.english); // 즐겨찾기 상태 확인

    // 동화 정보 가져오기
    const favoriteWord = favoriteWords.find((fav) => fav.word === item.english);
    const storyInfo = favoriteWord?.storyId === 0 ? '직접 추가' : `동화 ${favoriteWord?.storyId}`;

    if (isFlipped) {
      // 뒤집힌 카드 (예문 표시) - 반응형 크기 적용
      return (
        <TouchableOpacity
          style={[styles.wordCard, styles.flippedCard]}
          onPress={() => flipCard(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            {/* 난이도 태그 - 색상별 구분 (뒤집힌 카드에도 동일하게 표시) */}
            <View
              style={[
                styles.difficultyTag,
                { backgroundColor: getDifficultyColor(item.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>{getDifficultyLabel(item.difficulty)}</Text>
            </View>

            <Text style={styles.exampleHeader}>예문</Text>
            <Text style={styles.exampleEnglish}>{item.example.english}</Text>
            <Text style={styles.exampleKorean}>{item.example.korean}</Text>
            <View style={styles.flipControl}>
              <Ionicons name="arrow-back" size={16} color={COLORS.textSecondary} />
              <Text style={styles.flipText}>←클릭해서 뒤집기</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // 기본 카드 (단어 표시) - 반응형 크기 적용
    return (
      <TouchableOpacity
        style={styles.wordCard}
        onPress={() => flipCard(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          {/* 난이도 태그 - 색상별 구분 */}
          <View
            style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(item.difficulty) }]}
          >
            <Text style={styles.difficultyText}>{getDifficultyLabel(item.difficulty)}</Text>
          </View>

          {/* 즐겨찾기 버튼 - 프로필별 독립 관리 */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation(); // 카드 뒤집기 방지
              toggleFavorite(item.english);
            }}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={20}
              color={isFavorite ? COLORS.buttonFavorite : COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* 영어 단어 - 큰 글씨로 강조 */}
          <Text style={styles.englishWord}>{item.english}</Text>

          {/* 발음 기호 - IPA 표기법 */}
          <Text style={styles.pronunciation}>{item.pronunciation}</Text>

          {/* 한국어 뜻 - 초록색으로 표시 */}
          <Text style={styles.koreanMeaning}>{item.korean}</Text>

          {/* 동화 정보 표시 */}
          <Text style={styles.storyInfo}>{storyInfo}</Text>

          {/* 하단 컨트롤 - 발음 재생 및 뒤집기 안내 */}
          <View style={styles.cardControls}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={(e) => {
                e.stopPropagation(); // 카드 뒤집기 방지
                playPronunciation(item);
              }}
            >
              <Ionicons name="volume-high" size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={styles.flipControl}>
              <Text style={styles.flipText}>클릭해서 뒤집기 →</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.textSecondary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ===== 실행 부분 =====
  // 컴포넌트 마운트 시 즐겨찾기 단어 로드
  useEffect(() => {
    loadFavoriteWordsData();
  }, []);

  // 검색어나 필터 변경 시 단어 목록 업데이트
  useEffect(() => {
    filterWords();
  }, [searchQuery, activeFilter, words]);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      {/* 뒤로가기 버튼 - 반응형 위치 */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* 헤더 섹션 - 제목 및 안내 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={24} color={COLORS.accentGold} />
          <Text style={styles.headerTitle}>영어 사전</Text>
          <Ionicons name="sparkles" size={24} color={COLORS.accentGold} />
        </View>
        <Text style={styles.headerSubtitle}>단어를 클릭하면 발음을 들을 수 있어요!</Text>
      </View>

      {/* 검색 및 필터 섹션 - 가로 배치 레이아웃 */}
      <View style={styles.searchContainer}>
        {/* 검색창과 필터를 가로로 배치 */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* 검색 입력창 - 영어/한글 검색 지원 */}
          <TextInput
            style={styles.searchInput}
            placeholder="영어 단어나 한글 뜻을 검색하세요..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* 난이도 필터 버튼들 - 색상별 구분 */}
          <View style={styles.filterContainer}>
            {DIFFICULTY_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.activeFilterButton,
                  { borderColor: filter.color },
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.key && styles.activeFilterText,
                    { color: activeFilter === filter.key ? filter.color : COLORS.textSecondary },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 단어 개수 표시 - 실시간 업데이트 */}
        <Text style={styles.wordCount}>총 {filteredWords.length}개의 단어</Text>
      </View>

      {/* 단어 카드 목록 - 좌우 스크롤만 지원 */}
      {filteredWords.length > 0 ? (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false} // 세로 스크롤바 숨김
          scrollEnabled={true} // 가로 스크롤 활성화
          contentContainerStyle={styles.cardListContainer}
          renderItem={renderWordCard}
          snapToInterval={wp('60%') + wp('3%')} // 반응형 스냅 간격 대폭 조정
          decelerationRate="fast"
          bounces={false} // 바운스 효과 비활성화
          overScrollMode="never" // 오버스크롤 비활성화
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="star-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>즐겨찾기한 단어가 없어요</Text>
          <Text style={styles.emptyStateSubtitle}>
            학습 화면에서 단어에 별표를 눌러서 즐겨찾기에 추가해보세요!
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

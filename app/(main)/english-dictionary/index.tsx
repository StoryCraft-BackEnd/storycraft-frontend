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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/EnglishDictionaryScreen.styles';
import { loadSelectedProfile } from '@/features/profile/profileStorage';
import {
  loadFavoriteWords,
  addFavoriteWord,
  removeFavoriteWord,
} from '@/features/storyCreate/storyStorage';

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
const SAMPLE_WORDS: Word[] = [
  {
    id: '1',
    english: 'Cat',
    pronunciation: '[kæt]',
    korean: '고양이',
    difficulty: 'easy',
    example: {
      english: 'The cat is sleeping on the sofa.',
      korean: '고양이가 소파에서 자고 있어요.',
    },
  },
  {
    id: '2',
    english: 'Dog',
    pronunciation: '[dɔːɡ]',
    korean: '강아지',
    difficulty: 'easy',
    example: {
      english: 'I walk my dog every morning.',
      korean: '나는 매일 아침 강아지를 산책시켜요.',
    },
  },
  {
    id: '3',
    english: 'Bird',
    pronunciation: '[bɜːrd]',
    korean: '새',
    difficulty: 'easy',
    example: {
      english: 'Birds are singing in the tree.',
      korean: '새들이 나무에서 노래하고 있어요.',
    },
  },
  {
    id: '4',
    english: 'Fish',
    pronunciation: '[fɪʃ]',
    korean: '물고기',
    difficulty: 'easy',
    example: {
      english: 'Fish swim in the water.',
      korean: '물고기는 물에서 헤엄쳐요.',
    },
  },
  {
    id: '5',
    english: 'Apple',
    pronunciation: '[ˈæpl]',
    korean: '사과',
    difficulty: 'easy',
    example: {
      english: 'I eat an apple every day.',
      korean: '나는 매일 사과를 먹어요.',
    },
  },
  {
    id: '6',
    english: 'Beautiful',
    pronunciation: '[ˈbjuːtɪfl]',
    korean: '아름다운',
    difficulty: 'normal',
    example: {
      english: 'She is a beautiful girl.',
      korean: '그녀는 아름다운 소녀예요.',
    },
  },
  {
    id: '7',
    english: 'Adventure',
    pronunciation: '[ədˈventʃər]',
    korean: '모험',
    difficulty: 'normal',
    example: {
      english: 'We went on an adventure.',
      korean: '우리는 모험을 떠났어요.',
    },
  },
  {
    id: '8',
    english: 'Magnificent',
    pronunciation: '[mæɡˈnɪfɪsnt]',
    korean: '장엄한',
    difficulty: 'hard',
    example: {
      english: 'The view was magnificent.',
      korean: '경치가 장엄했어요.',
    },
  },
];

/**
 * 영어 사전 화면의 메인 컴포넌트
 * - 영어 단어 검색, 필터링, 발음, 예문 학습 기능 제공
 * - 좌우 스크롤만 지원 (상하 스크롤 제한)
 * - 반응형 디자인 적용
 */
export default function EnglishDictionaryScreen() {
  // === 상태 관리 ===
  const [words, setWords] = useState<Word[]>(SAMPLE_WORDS); // 전체 단어 목록
  const [filteredWords, setFilteredWords] = useState<Word[]>(SAMPLE_WORDS); // 필터링된 단어 목록
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [activeFilter, setActiveFilter] = useState('all'); // 현재 선택된 난이도 필터
  const [favoriteWords, setFavoriteWords] = useState<string[]>([]); // 즐겨찾기 단어 목록
  const [selectedProfile, setSelectedProfile] = useState<any>(null); // 현재 선택된 프로필
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set()); // 뒤집힌 카드 ID 목록

  // === useEffect 훅 ===
  // 컴포넌트 마운트 시 즐겨찾기 단어 로드
  useEffect(() => {
    loadFavoriteWordsData();
  }, []);

  // 검색어나 필터 변경 시 단어 목록 업데이트
  useEffect(() => {
    filterWords();
  }, [searchQuery, activeFilter, words]);

  // === 데이터 로드 함수 ===
  /**
   * 즐겨찾기 단어 데이터 로드
   * - 현재 선택된 프로필의 즐겨찾기 단어 목록을 가져옴
   */
  const loadFavoriteWordsData = async () => {
    try {
      const profile = await loadSelectedProfile();
      if (profile) {
        setSelectedProfile(profile);
        const favorites = await loadFavoriteWords(profile.childId);
        setFavoriteWords(favorites);
      }
    } catch (error) {
      console.error('즐겨찾기 단어 로드 실패:', error);
    }
  };

  // === 필터링 함수 ===
  /**
   * 단어 필터링 함수
   * - 검색어와 난이도 필터를 적용하여 단어 목록을 필터링
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

  // === 즐겨찾기 관리 함수 ===
  /**
   * 즐겨찾기 토글 함수
   * - 단어를 즐겨찾기에 추가하거나 제거
   * - 프로필별로 독립적으로 관리
   */
  const toggleFavorite = async (word: string) => {
    if (!selectedProfile) {
      Alert.alert('알림', '프로필을 선택해주세요.');
      return;
    }

    try {
      const isFavorite = favoriteWords.includes(word);

      if (isFavorite) {
        // 즐겨찾기 제거
        await removeFavoriteWord(selectedProfile.childId, word);
        setFavoriteWords((prev) => prev.filter((w) => w !== word));
      } else {
        // 즐겨찾기 추가
        await addFavoriteWord(selectedProfile.childId, word);
        setFavoriteWords((prev) => [...prev, word]);
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      Alert.alert('오류', '즐겨찾기 설정에 실패했습니다.');
    }
  };

  // === 카드 인터랙션 함수 ===
  /**
   * 카드 뒤집기 함수
   * - 카드 ID를 기반으로 뒤집힌 상태를 토글
   * - Set을 사용하여 효율적인 상태 관리
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
   * - 현재는 알림으로 대체, 향후 TTS API 연동 예정
   */
  const playPronunciation = (word: Word) => {
    Alert.alert('발음 재생', `${word.english}의 발음을 재생합니다.`);
    // TODO: 실제 TTS API 연동
  };

  // === 유틸리티 함수 ===
  /**
   * 난이도별 색상 반환 함수
   * - 쉬움: 초록, 보통: 주황, 어려움: 빨강
   */
  const getDifficultyColor = (difficulty: string) => {
    const filter = DIFFICULTY_FILTERS.find((f) => f.key === difficulty);
    return filter?.color || COLORS.textSecondary;
  };

  /**
   * 난이도별 한글 라벨 반환 함수
   * - 쉬움, 보통, 어려움으로 표시
   */
  const getDifficultyLabel = (difficulty: string) => {
    const filter = DIFFICULTY_FILTERS.find((f) => f.key === difficulty);
    return filter?.label || '보통';
  };

  // === 렌더링 함수 ===
  /**
   * 단어 카드 렌더링 함수
   * - 카드의 뒤집힌 상태에 따라 다른 UI 렌더링
   * - 반응형 디자인 적용
   */
  const renderWordCard = ({ item }: { item: Word }) => {
    const isFlipped = flippedCards.has(item.id); // 카드 뒤집힌 상태 확인
    const isFavorite = favoriteWords.includes(item.english); // 즐겨찾기 상태 확인

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

  // === 메인 렌더링 ===
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
    </ImageBackground>
  );
}

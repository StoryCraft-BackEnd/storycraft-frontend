/**
 * @description
 * StoryCraft 영어 퀴즈 페이지
 * 영어 단어와 문법 퀴즈를 풀고 학습할 수 있는 화면입니다.
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
import { LinearGradient } from 'expo-linear-gradient';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/EnglishQuizScreen.styles';

import QuizModal from '@/components/ui/QuizModal';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

// 퀴즈 타입 정의
interface Quiz {
  id: string;
  title: string; // 퀴즈 제목 (예: "Present Perfect Continuous")
  titleKorean: string; // 퀴즈 한글 제목 (예: "현재완료진행형")
  category: 'vocabulary' | 'grammar' | 'story';
  difficulty: 'easy' | 'normal' | 'hard';
  exampleSentence: string; // 예문 (예: "She has been studying English for 3 years.")
  source: string; // 출처
  score: number; // 점수
  completionDate: string; // 완료일
  isBookmarked: boolean;
}

// 퀴즈 타입별 필터 옵션
const TYPE_FILTERS = [
  { key: 'all', label: '전체', icon: 'apps' as const },
  { key: 'vocabulary', label: '어휘', icon: 'book' as const },
  { key: 'grammar', label: '문법', icon: 'star' as const },
  { key: 'story', label: '동화', icon: 'library' as const },
];

// 난이도별 필터 옵션
const DIFFICULTY_FILTERS = [
  { key: 'all', label: '전체', color: COLORS.difficultyAll },
  { key: 'easy', label: '쉬움', color: COLORS.difficultyEasy },
  { key: 'normal', label: '보통', color: COLORS.difficultyNormal },
  { key: 'hard', label: '어려움', color: COLORS.difficultyHard },
];

// 임시 퀴즈 데이터 (나중에 실제 API로 교체)
const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Present Perfect Continuous',
    titleKorean: '현재완료진행형',
    category: 'grammar',
    difficulty: 'hard',
    exampleSentence: 'She has been studying English for 3 years.',
    source: 'Snow White',
    score: 75,
    completionDate: '2024-06-28',
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'Past Perfect Tense',
    titleKorean: '과거완료시제',
    category: 'grammar',
    difficulty: 'normal',
    exampleSentence: 'I had finished my homework before dinner.',
    source: 'Cinderella',
    score: 88,
    completionDate: '2024-06-27',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'brave',
    titleKorean: '용감한',
    category: 'vocabulary',
    difficulty: 'easy',
    exampleSentence: 'The brave prince saved the princess.',
    source: 'Sleeping Beauty',
    score: 95,
    completionDate: '2024-06-26',
    isBookmarked: true,
  },
  {
    id: '4',
    title: 'magnificent',
    titleKorean: '장엄한',
    category: 'vocabulary',
    difficulty: 'normal',
    exampleSentence: 'The castle looked magnificent in the moonlight.',
    source: 'Beauty and the Beast',
    score: 82,
    completionDate: '2024-06-25',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Future Perfect',
    titleKorean: '미래완료',
    category: 'grammar',
    difficulty: 'hard',
    exampleSentence: 'By next year, I will have learned English.',
    source: 'Little Red Riding Hood',
    score: 70,
    completionDate: '2024-06-24',
    isBookmarked: false,
  },
  {
    id: '6',
    title: 'beautiful',
    titleKorean: '아름다운',
    category: 'vocabulary',
    difficulty: 'easy',
    exampleSentence: 'The princess was very beautiful.',
    source: 'The Little Mermaid',
    score: 100,
    completionDate: '2024-06-23',
    isBookmarked: true,
  },
  {
    id: '7',
    title: "Fairy Godmother's Magic",
    titleKorean: '요정 대모의 마법',
    category: 'story',
    difficulty: 'easy',
    exampleSentence: 'The fairy godmother turned a pumpkin into a carriage.',
    source: 'Cinderella',
    score: 92,
    completionDate: '2024-06-22',
    isBookmarked: false,
  },
  {
    id: '8',
    title: 'adventure',
    titleKorean: '모험',
    category: 'vocabulary',
    difficulty: 'normal',
    exampleSentence: 'We went on an exciting adventure.',
    source: 'Peter Pan',
    score: 85,
    completionDate: '2024-06-21',
    isBookmarked: false,
  },
];

/**
 * 영어 퀴즈 화면의 메인 컴포넌트
 * - 영어 단어와 문법 퀴즈를 표시
 * - 검색, 필터링, 퀴즈 풀기 기능 제공
 * - 좌우 스크롤만 지원 (상하 스크롤 제한)
 * - 반응형 디자인 적용
 */
export default function EnglishQuizScreen() {
  // === 상태 관리 ===
  const [quizzes, setQuizzes] = useState<Quiz[]>(SAMPLE_QUIZZES); // 전체 퀴즈 목록
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(SAMPLE_QUIZZES); // 필터링된 퀴즈 목록
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 현재 선택된 타입 필터
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState('all'); // 현재 선택된 난이도 필터

  const [quizModalVisible, setQuizModalVisible] = useState(false); // 퀴즈 모달 표시 여부
  const [currentQuiz, setCurrentQuiz] = useState<any>(null); // 현재 선택된 퀴즈

  // 검색어나 필터 변경 시 퀴즈 목록 업데이트
  useEffect(() => {
    filterQuizzes();
  }, [searchQuery, activeTypeFilter, activeDifficultyFilter, quizzes]);

  // === 필터링 함수 ===
  /**
   * 퀴즈 필터링 함수
   * - 검색어, 타입, 난이도 필터를 적용하여 퀴즈 목록을 필터링
   */
  const filterQuizzes = () => {
    let filtered = quizzes;

    // 검색어 필터링 (퀴즈 제목, 한글 제목, 예문으로 검색)
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.titleKorean.includes(searchQuery) ||
          quiz.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 타입 필터링 (전체가 아닌 경우에만 적용)
    if (activeTypeFilter !== 'all') {
      filtered = filtered.filter((quiz) => quiz.category === activeTypeFilter);
    }

    // 난이도 필터링 (전체가 아닌 경우에만 적용)
    if (activeDifficultyFilter !== 'all') {
      filtered = filtered.filter((quiz) => quiz.difficulty === activeDifficultyFilter);
    }

    setFilteredQuizzes(filtered);
  };

  // === 퀴즈 관리 함수 ===
  /**
   * 즐겨찾기 토글 함수
   * - 퀴즈를 즐겨찾기에 추가하거나 제거
   */
  const toggleBookmark = async (quizId: string) => {
    try {
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === quizId ? { ...quiz, isBookmarked: !quiz.isBookmarked } : quiz
        )
      );
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      Alert.alert('오류', '즐겨찾기 설정에 실패했습니다.');
    }
  };

  /**
   * 퀴즈 시작 함수
   * - 퀴즈 모달 표시
   */
  const startQuiz = (quiz: Quiz) => {
    // 퀴즈 문제 데이터 생성
    const quizQuestion = {
      id: quiz.id,
      question: `"${quiz.title}"의 뜻은 무엇인가요?`,
      example: quiz.exampleSentence,
      options: [quiz.titleKorean, '매우 작고 하찮은', '빠르고 날카로운', '어둡고 무서운'],
      correctAnswer: 0, // 첫 번째 옵션이 정답
      category: quiz.category,
      difficulty: quiz.difficulty,
      source: quiz.source,
    };

    setCurrentQuiz(quizQuestion);
    setQuizModalVisible(true);
  };

  /**
   * 퀴즈 삭제 함수
   * - 퀴즈를 컬렉션에서 삭제
   */
  const deleteQuiz = async (quizId: string) => {
    Alert.alert('퀴즈 삭제', '이 퀴즈를 컬렉션에서 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
        },
      },
    ]);
  };

  /**
   * 퀴즈 완료 처리 함수
   * - 퀴즈 결과를 처리
   */
  const handleQuizComplete = (score: number) => {
    // 퀴즈 완료 후 결과 표시 (필요시 점수 저장 로직 추가)
    console.log(`퀴즈 완료! 점수: ${score}점`);
  };

  // === 유틸리티 함수 ===
  /**
   * 카테고리별 아이콘 반환 함수
   * - 어휘, 문법, 동화별로 다른 아이콘 표시
   */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return 'book';
      case 'grammar':
        return 'star';
      case 'story':
        return 'library';
      default:
        return 'apps';
    }
  };

  /**
   * 카테고리별 한글 라벨 반환 함수
   * - 어휘, 문법, 동화로 표시
   */
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return 'Vocabulary';
      case 'grammar':
        return 'Grammar';
      case 'story':
        return 'Story Content';
      default:
        return 'All';
    }
  };

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
   * 퀴즈 카드 렌더링 함수
   * - 퀴즈 정보를 카드 형태로 표시
   * - 반응형 디자인 적용
   */
  const renderQuizCard = ({ item }: { item: Quiz }) => {
    return (
      <TouchableOpacity style={styles.quizCard} onPress={() => startQuiz(item)} activeOpacity={0.8}>
        <View style={styles.cardContent}>
          {/* 상단 액션 버튼들 */}
          <View style={styles.cardActions}>
            {/* 즐겨찾기 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // 카드 클릭 방지
                toggleBookmark(item.id);
              }}
            >
              <Ionicons
                name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={item.isBookmarked ? COLORS.buttonFavorite : COLORS.textSecondary}
              />
            </TouchableOpacity>
            {/* 삭제 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // 카드 클릭 방지
                deleteQuiz(item.id);
              }}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* 상단 정보 (제목, 태그) */}
          <View style={styles.cardTopSection}>
            {/* 동화 영어 제목 */}
            <Text style={styles.quizTitleEnglish}>{item.title}</Text>

            {/* 동화 한글 제목 */}
            <Text style={styles.quizTitleKorean}>{item.titleKorean}</Text>

            {/* 필터된 항목들 (난이도, 어휘, 문법, 동화) */}
            <View style={styles.filterTags}>
              <View style={styles.categoryTag}>
                <Ionicons
                  name={getCategoryIcon(item.category)}
                  size={12}
                  color={COLORS.textPrimary}
                />
                <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
              </View>
              <View
                style={[
                  styles.difficultyTag,
                  { backgroundColor: getDifficultyColor(item.difficulty) },
                ]}
              >
                <Text style={styles.difficultyText}>{getDifficultyLabel(item.difficulty)}</Text>
              </View>
            </View>
          </View>

          {/* 중앙 예문 박스 */}
          <View style={styles.exampleBox}>
            <Text style={styles.exampleBoxText}>{item.exampleSentence}</Text>
          </View>

          {/* 하단 정보 (출처, 점수, 버튼, 완료일) */}
          <View style={styles.cardBottomSection}>
            {/* 출처와 점수 */}
            <View style={styles.sourceScoreContainer}>
              <Text style={styles.sourceText}>출처: {item.source}</Text>
              <Text style={styles.scoreText}>점수: {item.score}점</Text>
            </View>

            {/* 다시 풀기 버튼 */}
            <LinearGradient
              colors={['#4A90E2', '#9B59B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retakeButton}
            >
              <TouchableOpacity
                style={styles.retakeButtonContent}
                onPress={(e) => {
                  e.stopPropagation(); // 카드 클릭 방지
                  startQuiz(item);
                }}
              >
                <Ionicons name="play" size={16} color={COLORS.textPrimary} />
                <Text style={styles.retakeButtonText}>다시 풀기</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* 완료일 */}
            <Text style={styles.completionDateText}>완료일: {item.completionDate}</Text>
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
          <Text style={styles.headerTitle}>영어 퀴즈</Text>
          <Ionicons name="sparkles" size={24} color={COLORS.accentGold} />
        </View>
        <Text style={styles.headerSubtitle}>퀴즈를 클릭하면 문제를 풀 수 있어요!</Text>
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
                  activeDifficultyFilter === filter.key && styles.activeFilterButton,
                  { borderColor: filter.color },
                ]}
                onPress={() => setActiveDifficultyFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeDifficultyFilter === filter.key && styles.activeFilterText,
                    {
                      color:
                        activeDifficultyFilter === filter.key ? filter.color : COLORS.textSecondary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 타입 필터와 퀴즈 개수를 한 줄에 배치 */}
        <View style={styles.typeFilterRow}>
          <View style={styles.typeFilterContainer}>
            {TYPE_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.typeFilterButton,
                  activeTypeFilter === filter.key && styles.activeTypeFilterButton,
                ]}
                onPress={() => setActiveTypeFilter(filter.key)}
              >
                <Ionicons
                  name={filter.icon}
                  size={12}
                  color={
                    activeTypeFilter === filter.key ? COLORS.textPrimary : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeFilterText,
                    activeTypeFilter === filter.key && styles.activeTypeFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 퀴즈 개수 표시 - 타입 필터 옆에 배치 */}
          <Text style={styles.quizCount}>총 {filteredQuizzes.length}개의 퀴즈</Text>
        </View>
      </View>

      {/* 퀴즈 카드 목록 - 좌우 스크롤만 지원 */}
      <FlatList
        data={filteredQuizzes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.cardListContainer}
        renderItem={renderQuizCard}
        snapToInterval={wp('120%') + wp('3%')}
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
      />

      {/* 퀴즈 모달 */}
      {currentQuiz && (
        <QuizModal
          visible={quizModalVisible}
          onClose={() => setQuizModalVisible(false)}
          quiz={currentQuiz}
          onComplete={handleQuizComplete}
        />
      )}
    </ImageBackground>
  );
}

/**
 * @description
 * StoryCraft 영어 퀴즈 페이지
 * 학습화면에서 북마크한 문제들을 표시하고 퀴즈를 풀 수 있는 화면입니다.
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
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/EnglishQuizScreen.styles';
import QuizModal from '@/components/ui/QuizModal';
import { loadBookmarkedQuizzes, removeQuizBookmark } from '@/features/quiz/quizStorage';
import { Quiz } from '@/features/quiz/quizApi';

// --- 이미지 및 리소스 ---
import backgroundImage from '@/assets/images/background/night-bg.png';

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

/**
 * 영어 퀴즈 화면의 메인 컴포넌트
 * - 학습화면에서 북마크한 문제들을 표시
 * - 검색, 필터링, 퀴즈 풀기 기능 제공
 * - 좌우 스크롤만 지원 (상하 스크롤 제한)
 * - 반응형 디자인 적용
 */
export default function EnglishQuizScreen() {
  // === 상태 관리 ===
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); // 북마크된 퀴즈 목록
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]); // 필터링된 퀴즈 목록
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 현재 선택된 타입 필터
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState('all'); // 현재 선택된 난이도 필터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const [quizModalVisible, setQuizModalVisible] = useState(false); // 퀴즈 모달 표시 여부
  const [currentQuiz, setCurrentQuiz] = useState<any>(null); // 현재 선택된 퀴즈

  // 컴포넌트 마운트 시 북마크된 퀴즈 로드
  useEffect(() => {
    fetchBookmarkedQuizzes();
  }, []);

  // 화면이 포커스될 때마다 북마크된 퀴즈 새로 로드
  useFocusEffect(
    React.useCallback(() => {
      console.log('퀴즈 화면 포커스됨 - 북마크된 퀴즈 새로 로드');
      fetchBookmarkedQuizzes();
    }, [])
  );

  // 검색어나 필터 변경 시 퀴즈 목록 업데이트
  useEffect(() => {
    filterQuizzes();
  }, [searchQuery, activeTypeFilter, activeDifficultyFilter, quizzes]);

  // === 북마크된 퀴즈 로드 ===
  const fetchBookmarkedQuizzes = async () => {
    setIsLoading(true);
    try {
      const bookmarkedQuizzes = await loadBookmarkedQuizzes();
      setQuizzes(bookmarkedQuizzes);
      setFilteredQuizzes(bookmarkedQuizzes);
    } catch (error) {
      console.error('북마크된 퀴즈 로드 실패:', error);
      Alert.alert('오류', '북마크된 퀴즈를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // === 필터링 함수 ===
  /**
   * 퀴즈 필터링 함수
   * - 검색어, 타입, 난이도 필터를 적용하여 퀴즈 목록을 필터링
   */
  const filterQuizzes = () => {
    let filtered = quizzes;

    // 검색어 필터링 (퀴즈 질문으로 검색)
    if (searchQuery.trim()) {
      filtered = filtered.filter((quiz) =>
        quiz.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuizzes(filtered);
  };

  // === 퀴즈 관리 함수 ===
  /**
   * 북마크 제거 함수
   * - 퀴즈를 북마크에서 제거
   */
  const removeBookmarkFromQuiz = async (quizId: number) => {
    // quizId가 유효하지 않으면 처리하지 않음
    if (!quizId || isNaN(quizId)) {
      console.warn('⚠️ 유효하지 않은 quizId:', quizId);
      Alert.alert('오류', '퀴즈 ID가 올바르지 않습니다.');
      return;
    }

    try {
      await removeQuizBookmark(quizId);
      // 로컬 상태에서도 제거
      setQuizzes((prev) => prev.filter((quiz) => quiz.quizId !== quizId));
      Alert.alert('알림', '북마크가 제거되었습니다.');
    } catch (error) {
      console.error('북마크 제거 실패:', error);
      Alert.alert('오류', '북마크 제거에 실패했습니다.');
    }
  };

  /**
   * 퀴즈 시작 함수
   * - 퀴즈 모달 표시
   */
  const startQuiz = (quiz: Quiz) => {
    // quizId가 없으면 퀴즈를 시작하지 않음
    if (!quiz.quizId) {
      console.warn('⚠️ quizId가 없는 퀴즈:', quiz);
      Alert.alert('오류', '퀴즈 정보가 올바르지 않습니다.');
      return;
    }

    // 퀴즈 문제 데이터 생성
    const quizQuestion = {
      id: quiz.quizId,
      question: quiz.question,
      options: quiz.options,
      correctAnswer: Object.keys(quiz.options)[0], // 첫 번째 옵션이 정답
    };

    setCurrentQuiz(quizQuestion);
    setQuizModalVisible(true);
  };

  /**
   * 퀴즈 완료 처리 함수
   * - 퀴즈 결과를 처리
   */
  const handleQuizComplete = (selectedAnswer: string) => {
    // 퀴즈 완료 후 결과 표시 (필요시 점수 저장 로직 추가)
    console.log(`퀴즈 완료! 선택된 답: ${selectedAnswer}`);
  };

  // === 렌더링 함수 ===
  /**
   * 퀴즈 카드 렌더링 함수
   * - 퀴즈 정보를 카드 형태로 표시
   * - 반응형 디자인 적용
   */
  const renderQuizCard = ({ item }: { item: Quiz }) => {
    // quizId가 없으면 렌더링하지 않음
    if (!item.quizId) {
      console.warn('⚠️ quizId가 없는 퀴즈 항목:', item);
      return null;
    }

    return (
      <TouchableOpacity style={styles.quizCard} onPress={() => startQuiz(item)} activeOpacity={0.8}>
        <View style={styles.cardContent}>
          {/* 상단 액션 버튼들 */}
          <View style={styles.cardActions}>
            {/* 북마크 제거 버튼 */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation(); // 카드 클릭 방지
                removeBookmarkFromQuiz(item.quizId);
              }}
            >
              <Ionicons name="bookmark" size={16} color={COLORS.buttonFavorite} />
            </TouchableOpacity>
          </View>

          {/* 상단 정보 (제목, 태그) */}
          <View style={styles.cardTopSection}>
            {/* 퀴즈 질문 */}
            <Text style={styles.quizTitleEnglish}>{item.question}</Text>

            {/* 퀴즈 옵션들 */}
            <View style={{ marginTop: 8 }}>
              {Object.entries(item.options).map(([key, value]) => (
                <Text
                  key={key}
                  style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 }}
                >
                  {key}. {value}
                </Text>
              ))}
            </View>
          </View>

          {/* 중앙 예문 박스 */}
          <View style={styles.exampleBox}>
            <Text style={styles.exampleBoxText}>퀴즈를 클릭하여 풀어보세요!</Text>
          </View>

          {/* 하단 정보 */}
          <View style={styles.cardBottomSection}>
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
                <Text style={styles.retakeButtonText}>퀴즈 풀기</Text>
              </TouchableOpacity>
            </LinearGradient>
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
          <Text style={styles.headerTitle}>북마크된 퀴즈</Text>
          <Ionicons name="sparkles" size={24} color={COLORS.accentGold} />
        </View>
        <Text style={styles.headerSubtitle}>학습화면에서 북마크한 문제들을 풀어보세요!</Text>
      </View>

      {/* 검색 및 필터 섹션 - 가로 배치 레이아웃 */}
      <View style={styles.searchContainer}>
        {/* 검색창과 필터를 가로로 배치 */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* 검색 입력창 - 영어/한글 검색 지원 */}
          <TextInput
            style={styles.searchInput}
            placeholder="퀴즈 질문을 검색하세요..."
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
          <Text style={styles.quizCount}>총 {filteredQuizzes.length}개의 북마크</Text>
        </View>
      </View>

      {/* 퀴즈 카드 목록 - 좌우 스크롤만 지원 */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>
            북마크된 퀴즈를 불러오는 중...
          </Text>
        </View>
      ) : filteredQuizzes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="bookmark-outline" size={48} color={COLORS.textSecondary} />
          <Text style={{ color: COLORS.textPrimary, fontSize: 18, marginTop: 16 }}>
            북마크된 퀴즈가 없습니다
          </Text>
          <Text
            style={{ color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8 }}
          >
            학습화면에서 문제를 북마크하면 여기에 표시됩니다
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuizzes}
          keyExtractor={(item) => (item.quizId || Math.random()).toString()}
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
      )}

      {/* 퀴즈 모달 */}
      {currentQuiz && (
        <QuizModal
          visible={quizModalVisible}
          onClose={() => setQuizModalVisible(false)}
          quiz={currentQuiz}
          onSubmit={handleQuizComplete}
        />
      )}
    </ImageBackground>
  );
}

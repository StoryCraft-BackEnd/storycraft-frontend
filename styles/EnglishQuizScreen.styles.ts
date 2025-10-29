import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// 색상 상수 정의
const COLORS = {
  // 기본 색상
  white: '#fff',
  black: '#000',

  // 테마 색상
  primaryPurple: '#B6AFFF', // 기본 보라색 (아이콘, 텍스트)
  accentGold: '#FFD700', // 강조 금색 (별표, 스파클)

  // 난이도별 색상
  difficultyAll: '#FFD700', // 전체 (금색)
  difficultyEasy: '#4CAF50', // 쉬움 (초록색)
  difficultyNormal: '#FF9800', // 보통 (주황색)
  difficultyHard: '#F44336', // 어려움 (빨간색)

  // 카드 색상
  cardBackground: 'rgba(30, 30, 60, 0.8)', // 기본 카드 배경
  flippedCardBackground: 'rgba(60, 60, 120, 0.95)', // 뒤집힌 카드 배경
  cardBorder: 'rgba(182, 175, 255, 0.2)', // 기본 카드 테두리
  flippedCardBorder: 'rgba(182, 175, 255, 0.6)', // 뒤집힌 카드 테두리

  // 텍스트 색상
  textPrimary: '#fff', // 주요 텍스트 (흰색)
  textSecondary: '#B6AFFF', // 보조 텍스트 (보라색)
  textSuccess: '#4CAF50', // 성공/긍정 텍스트 (초록색)

  // 버튼 색상
  buttonSuccess: '#4CAF50', // 성공 버튼 (초록색)
  buttonFavorite: '#FFD700', // 즐겨찾기 활성화 (금색)

  // 배경 색상
  overlayDark: 'rgba(0, 0, 0, 0.3)', // 어두운 오버레이
  inputBackground: 'rgba(255, 255, 255, 0.1)', // 입력창 배경
  filterBackground: 'rgba(255, 255, 255, 0.05)', // 필터 배경
  activeFilterBackground: 'rgba(255, 255, 255, 0.15)', // 활성 필터 배경
  inputBorder: 'rgba(182, 175, 255, 0.3)', // 입력창 테두리
};

export { COLORS };

const styles = StyleSheet.create({
  // === 배경 이미지 ===
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // === 뒤로가기 버튼 ===
  backButton: {
    position: 'absolute',
    top: 10, // 15에서 10으로 더 줄임
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // === 헤더 섹션 ===
  headerContainer: {
    paddingTop: 15, // 25에서 15로 더 줄임
    paddingHorizontal: 20,
    paddingBottom: 2, // 3에서 2로 더 줄임
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20, // 24에서 20으로 더 줄임
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginHorizontal: 12,
  },
  headerSubtitle: {
    fontSize: 10, // 12에서 10으로 더 줄임
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // === 검색 및 필터 섹션 ===
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 2, // 3에서 2로 더 줄임
  },
  searchInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15, // 20에서 15로 줄임
    paddingVertical: 5, // 6에서 5로 줄임
    fontSize: 11, // 12에서 11로 줄임
    color: COLORS.textPrimary,
    marginBottom: 0, // 하단 여백 제거 (필터가 옆에 있으므로)
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    flex: 0.6, // 1에서 0.6으로 줄여서 검색창 크기 축소
    marginRight: 15, // 10에서 15로 늘려서 필터와의 간격 확대
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0, // 하단 여백 제거
    flex: 0.4, // 0에서 0.4로 늘려서 필터 영역 확대
  },
  filterButton: {
    flex: 1, // 0에서 1로 변경하여 균등하게 공간 분배
    marginHorizontal: 3, // 2에서 3으로 늘림
    paddingVertical: 6, // 4에서 6으로 늘림
    paddingHorizontal: 8, // 6에서 8로 늘림
    borderRadius: 18, // 15에서 18로 늘림
    borderWidth: 1,
    backgroundColor: COLORS.filterBackground,
    alignItems: 'center',
    minWidth: 50, // 45에서 50으로 늘림
  },
  activeFilterButton: {
    backgroundColor: COLORS.activeFilterBackground,
    borderWidth: 2,
  },
  filterText: {
    fontSize: 12, // 10에서 12로 늘림
    fontWeight: '600',
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  typeFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  typeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: COLORS.filterBackground,
    borderWidth: 1,
    borderColor: COLORS.filterBackground,
  },
  activeTypeFilterButton: {
    backgroundColor: COLORS.activeFilterBackground,
    borderColor: COLORS.primaryPurple,
  },
  typeFilterText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTypeFilterText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  quizCount: {
    fontSize: 10,
    color: COLORS.textPrimary,
    textAlign: 'right',
    marginLeft: 10,
  },

  // === 카드 목록 ===
  cardListContainer: {
    paddingHorizontal: 20,
    paddingTop: 1, // 2에서 1로 더 줄임
    paddingBottom: 20,
  },

  // === 퀴즈 카드 ===
  quizCard: {
    width: wp('100%'), // 60%에서 80%로 가로 크기 확대
    height: hp('30%'), // 31%에서 25%로 세로 크기 추가 축소
    backgroundColor: COLORS.cardBackground,
    borderRadius: wp('3%'), // 4%에서 3%로 축소
    marginRight: wp('3%'), // 4%에서 3%로 축소
    padding: wp('3%'), // 4%에서 3%로 축소
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
  },
  cardTopSection: {
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  cardBottomSection: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  filterTags: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  sourceScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4, // 8에서 4로 줄여서 간격 축소
  },
  exampleBox: {
    width: '100%',
    height: hp('5%'),
    backgroundColor: COLORS.cardBackground,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginVertical: 2,
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    left: -15,
    top: '50%',
    transform: [{ translateY: -50 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  exampleBoxText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
  },
  cardTags: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.filterBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    marginLeft: 4,
    fontWeight: '500',
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
    zIndex: 2,
  },
  actionButton: {
    padding: 6,
    marginBottom: 4,
  },
  quizTitleEnglish: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'left',
    marginBottom: 4,
  },
  quizTitleKorean: {
    fontSize: 12,
    color: COLORS.textSuccess,
    textAlign: 'left',
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleSentence: {
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'left',
    marginBottom: 8,
    lineHeight: 16,
  },
  sourceText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'left',
    marginBottom: 8,
  },
  cardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  quizText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreText: {
    fontSize: 10,
    color: COLORS.accentGold,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  completionDateText: {
    fontSize: 8,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
  retakeButton: {
    borderRadius: 12,
    width: '100%', // 가로 100% 채우기
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retakeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  retakeButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginLeft: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default styles;

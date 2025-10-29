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
  cardBorder: 'rgba(182, 175, 255, 0.2)', // 기본 카드 테두리

  // 텍스트 색상
  textPrimary: '#fff', // 주요 텍스트 (흰색)
  textSecondary: '#B6AFFF', // 보조 텍스트 (보라색)
  textSuccess: '#4CAF50', // 성공/긍정 텍스트 (초록색)

  // 버튼 색상
  buttonSuccess: '#4CAF50', // 성공 버튼 (초록색)
  buttonFavorite: '#FFD700', // 즐겨찾기 활성화 (금색)
  buttonGradient: ['#4CAF50', '#2196F3'], // 그라데이션 버튼

  // 배경 색상
  overlayDark: 'rgba(0, 0, 0, 0.3)', // 어두운 오버레이
  inputBackground: 'rgba(255, 255, 255, 0.1)', // 입력창 배경
  filterBackground: 'rgba(255, 255, 255, 0.05)', // 필터 배경
  activeFilterBackground: 'rgba(255, 255, 255, 0.15)', // 활성 필터 배경
  inputBorder: 'rgba(182, 175, 255, 0.3)', // 입력창 테두리
};

// 색상 상수를 export하여 다른 파일에서 사용할 수 있도록 함
export { COLORS };

export default StyleSheet.create({
  // 배경
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // 뒤로가기 버튼
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.overlayDark,
  },
  backButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },

  // 헤더
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // 검색 및 필터
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  filterSection: {
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderWidth: 1,
    backgroundColor: COLORS.filterBackground,
    borderColor: COLORS.inputBorder,
    gap: 4,
  },
  activeFilterButton: {
    backgroundColor: COLORS.activeFilterBackground,
    borderWidth: 2,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },

  // 카드 목록
  cardListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // 퀴즈 카드
  quizCard: {
    width: wp('75%'),
    backgroundColor: COLORS.cardBackground,
    borderRadius: wp('4%'),
    marginRight: wp('4%'),
    padding: wp('4%'),
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

  // 카드 헤더
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryPurple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 퀴즈 제목
  quizTitleContainer: {
    marginBottom: 12,
  },
  quizTitleEnglish: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  quizTitleKorean: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // 예문
  exampleSentence: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },

  // 출처
  sourceText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  // 퀴즈 정보
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 11,
    color: COLORS.textSuccess,
    fontWeight: '600',
  },
  completionDateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // 다시 풀기 버튼
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonSuccess,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  retakeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});

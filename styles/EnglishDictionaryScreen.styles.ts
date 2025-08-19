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

// 색상 상수를 export하여 다른 파일에서 사용할 수 있도록 함
export { COLORS };

export default StyleSheet.create({
  // 배경
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // 뒤로가기 버튼 - 상단 위치 더욱 조정
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

  // 헤더 - 상단 여백 더욱 줄임
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

  // 검색 및 필터 - 하단 여백 더욱 줄임
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
  wordCount: {
    fontSize: 10, // 12에서 10으로 더 줄임
    color: COLORS.textPrimary, // 타이틀과 동일한 흰색으로 변경
    textAlign: 'center',
    marginTop: 5, // 상단 여백 추가
  },

  // 카드 목록 - 상단 여백 더욱 조정
  cardListContainer: {
    paddingHorizontal: 20,
    paddingTop: 1, // 2에서 1로 더 줄임
    paddingBottom: 20,
  },

  // 단어 카드 - 반응형 크기로 설정 (세로 크기 20% 추가 축소)
  wordCard: {
    width: wp('60%'), // 75%에서 60%로 대폭 축소
    height: hp('31%'), // 35%에서 28%로 20% 추가 축소 (35% * 0.8 = 28%)
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
  flippedCard: {
    backgroundColor: COLORS.flippedCardBackground, // 더 밝고 선명한 보라색으로 변경
    borderColor: COLORS.flippedCardBorder, // 테두리도 더 선명하게
    shadowOpacity: 0.5, // 그림자도 더 강하게
    shadowRadius: 12, // 그림자 반경도 늘림
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // 난이도 태그
  difficultyTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },

  // 즐겨찾기 버튼
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 1,
  },

  // 영어 단어
  englishWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },

  // 발음
  pronunciation: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'monospace',
  },

  // 한국어 뜻
  koreanMeaning: {
    fontSize: 20,
    color: COLORS.textSuccess,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },

  // 동화 정보
  storyInfo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },

  // 카드 컨트롤
  cardControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.buttonSuccess,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 12,
    color: '#B6AFFF',
    marginHorizontal: 4,
  },

  // 뒤집힌 카드 스타일
  exampleHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  exampleEnglish: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  exampleKorean: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },

  // 빈 상태 스타일
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

import { StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 카드 너비 계산 (화면 너비의 74% 또는 최대 300px)
export const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.74);

// === 색상 상수 정의 ===
const COLORS = {
  // 기본 색상
  WHITE: '#fff', // 흰색 - 텍스트, 아이콘 등에 사용
  BLACK: '#000', // 검은색 - 그림자 등에 사용

  // 배경 색상
  BACKGROUND_DARK: '#181f3a', // 카드 배경색 - 어두운 파란색 계열
  BACKGROUND_TAG: '#23284a', // 태그 배경색 - 약간 밝은 어두운 파란색

  // 텍스트 색상
  TEXT_PRIMARY: '#fff', // 주요 텍스트 색상 - 흰색
  TEXT_SECONDARY: '#b3b3ff', // 보조 텍스트 색상 - 연한 파란색
  TEXT_SUMMARY: '#e0e0ff', // 요약 텍스트 색상 - 매우 연한 파란색

  // 강조 색상
  ACCENT_GOLD: '#FFD700', // 골드 색상 - 별표 아이콘, 헤더 아이콘
  ACCENT_PINK: '#FF6B6B', // 핑크 색상 - 하트 아이콘 (좋아요)
  ACCENT_BLUE: '#4f6cff', // 파란색 - 읽기 버튼 배경
  ACCENT_PURPLE: '#6c63ff', // 보라색 - 활성 탭 배경
  ACCENT_LIGHT_BLUE: '#B6AFFF', // 연한 파란색 - 아이콘, 비활성 탭

  // 투명도 색상
  TRANSPARENT_WHITE: 'rgba(255, 255, 255, 0.1)', // 반투명 흰색 - 탭 배경
  TRANSPARENT_BLACK: 'rgba(0,0,0,0.3)', // 반투명 검은색 - 뒤로가기 버튼 배경

  // 상태 색상
  GRAY: '#666', // 회색 - 빈 상태 아이콘, 텍스트
};

/**
 * 동화 목록 화면 스타일 정의
 * react-native-responsive-screen을 활용한 반응형 디자인
 */
const styles = StyleSheet.create({
  // === 배경 관련 스타일 ===
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // === 뒤로가기 버튼 스타일 ===
  backButton: {
    position: 'absolute',
    top: hp('2%'), // 화면 높이의 2%로 조금 아래로 이동
    left: wp('5%'), // 화면 너비의 5%
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.TRANSPARENT_BLACK, // 반투명 검은색 배경
    paddingHorizontal: wp('3%'), // 화면 너비의 3%
    paddingVertical: hp('0.5%'), // 화면 높이의 0.5%로 줄임
    borderRadius: 20,
  },
  backButtonText: {
    color: COLORS.WHITE, // 흰색 텍스트
    marginLeft: wp('1%'), // 화면 너비의 1%
    fontSize: wp('4%'), // 반응형 폰트 크기
    fontWeight: '500',
  },

  // === 헤더 제목 행 스타일 ===
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // === 헤더 제목 영역 스타일 ===
  headerContainer: {
    alignItems: 'center',
    marginTop: hp('2%'), // 화면 높이의 2%로 더 위로 올림
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%로 더 줄임
    paddingHorizontal: wp('5%'), // 화면 너비의 5%
  },
  headerTitle: {
    fontSize: wp('6.5%'), // 반응형 폰트 크기 키움
    fontWeight: 'bold',
    color: COLORS.WHITE, // 흰색 텍스트
    textAlign: 'center',
    marginBottom: hp('0.2%'), // 화면 높이의 0.2%로 더 줄임
  },
  headerSubtitle: {
    fontSize: wp('3.5%'), // 반응형 폰트 크기 키움
    color: COLORS.TEXT_SECONDARY, // 보조 텍스트 색상
    textAlign: 'center',
    opacity: 0.8,
  },

  // === 탭 네비게이션 스타일 ===
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'), // 화면 높이의 1%로 줄임
    marginBottom: hp('2%'), // 화면 높이의 2%
    paddingHorizontal: wp('5%'), // 화면 너비의 5%
  },
  tabButton: {
    paddingVertical: hp('1%'), // 화면 높이의 1%
    paddingHorizontal: wp('3%'), // 화면 너비의 3%
    borderRadius: 10,
    backgroundColor: COLORS.TRANSPARENT_WHITE, // 반투명 흰색 배경
    marginRight: wp('2%'), // 화면 너비의 2%
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: COLORS.ACCENT_PURPLE, // 보라색 활성 탭 배경
  },
  tabText: {
    color: COLORS.TEXT_SECONDARY, // 보조 텍스트 색상
    fontSize: wp('3%'), // 반응형 폰트 크기
    fontWeight: 'bold',
  },
  activeTabText: {
    color: COLORS.WHITE, // 흰색 활성 탭 텍스트
  },

  // === 카드 목록 컨테이너 스타일 ===
  cardListContainer: {
    paddingLeft: wp('5%'), // 화면 너비의 5%
    paddingRight: wp('2%'), // 화면 너비의 2%
    paddingBottom: hp('1%'), // 화면 높이의 1%로 더 줄임
  },

  // === 개별 카드 스타일 ===
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.BACKGROUND_DARK, // 어두운 파란색 카드 배경
    borderRadius: 18,
    padding: wp('3%'), // 화면 너비의 3%로 더 줄임
    marginRight: wp('3%'), // 화면 너비의 3%로 줄임
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%로 더 줄임
    shadowColor: COLORS.BLACK, // 검은색 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flex: 1, // 카드가 세로 공간을 모두 차지하도록 설정
    flexDirection: 'column', // 세로 방향 배치
    justifyContent: 'space-between', // 내용을 위아래로 분산 배치
  },

  // === 카드 내부 콘텐츠 스타일 ===
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%
  },
  cardTitle: {
    fontSize: wp('3.5%'), // 반응형 폰트 크기 더 줄임
    fontWeight: 'bold',
    color: COLORS.WHITE, // 흰색 제목 텍스트
    flex: 1, // 남은 공간 차지
    lineHeight: wp('4.5%'), // 반응형 라인 높이 더 줄임
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: wp('2.5%'), // 반응형 폰트 크기 더 줄임
    color: COLORS.TEXT_SECONDARY, // 보조 텍스트 색상
    marginBottom: hp('0.3%'), // 화면 높이의 0.3%로 더 줄임
    opacity: 0.8,
  },

  // === 태그 영역 스타일 ===
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 태그가 많을 경우 줄바꿈
    gap: wp('0.8%'), // 화면 너비의 0.8%로 더 줄임
    marginBottom: hp('0.3%'), // 화면 높이의 0.3%로 더 줄임
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND_TAG, // 태그 배경색
    borderRadius: 8,
    paddingHorizontal: wp('1.5%'), // 화면 너비의 1.5%로 줄임
    paddingVertical: hp('0.2%'), // 화면 높이의 0.2%로 줄임
    marginBottom: hp('0.2%'), // 화면 높이의 0.2%로 줄임
  },
  tagText: {
    fontSize: wp('2.5%'), // 반응형 폰트 크기 줄임
    color: COLORS.TEXT_SECONDARY, // 보조 텍스트 색상
    fontWeight: '500',
  },

  // === 요약 텍스트 스타일 ===
  cardSummary: {
    fontSize: wp('2.8%'), // 반응형 폰트 크기 더 줄임
    color: COLORS.TEXT_SUMMARY, // 요약 텍스트 색상
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%로 더 줄임
    lineHeight: wp('3.5%'), // 반응형 라인 높이 더 줄임
    opacity: 0.9,
    flex: 1, // 남은 공간을 모두 차지하여 버튼을 아래로 밀어냄
  },

  // === 액션 버튼 영역 스타일 ===
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('0.3%'), // 화면 높이의 0.3%로 더 줄임
    // 버튼들이 카드 최하단에 고정되도록 설정
    alignSelf: 'flex-end', // 하단에 정렬
  },
  readButton: {
    backgroundColor: COLORS.ACCENT_BLUE, // 파란색 읽기 버튼 배경
    borderRadius: 8,
    paddingVertical: hp('0.6%'), // 화면 높이의 0.6%로 더 줄임
    paddingHorizontal: wp('2.5%'), // 화면 너비의 2.5%로 더 줄임
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 가운데 정렬 추가
    flex: 1, // 남은 공간 차지
    marginRight: wp('1.5%'), // 화면 너비의 1.5%로 줄임
  },
  readButtonText: {
    color: COLORS.WHITE, // 흰색 버튼 텍스트
    fontWeight: 'bold',
    fontSize: wp('2.8%'), // 반응형 폰트 크기 더 줄임
    marginLeft: wp('0.8%'), // 화면 너비의 0.8%로 줄임
  },

  // === 아이콘 버튼 스타일 ===
  iconButton: {
    backgroundColor: 'transparent',
    padding: wp('1%'), // 화면 너비의 1%로 줄임
    borderRadius: 8,
    marginLeft: wp('0.8%'), // 화면 너비의 0.8%로 줄임
  },

  // === 카드 아이콘 색상 스타일 ===
  bookmarkIconActive: {
    color: COLORS.ACCENT_GOLD, // 골드 색상 - 활성 북마크
  },
  bookmarkIconInactive: {
    color: COLORS.ACCENT_LIGHT_BLUE, // 연한 파란색 - 비활성 북마크
  },
  likeIconActive: {
    color: COLORS.ACCENT_PINK, // 핑크 색상 - 활성 좋아요
  },
  likeIconInactive: {
    color: COLORS.ACCENT_LIGHT_BLUE, // 연한 파란색 - 비활성 좋아요
  },
  actionIcon: {
    color: COLORS.ACCENT_LIGHT_BLUE, // 연한 파란색 - 액션 아이콘
  },

  // === 빈 상태 화면 스타일 ===
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    color: COLORS.GRAY, // 회색 빈 상태 아이콘
  },
  emptyText: {
    color: COLORS.GRAY, // 회색 빈 상태 텍스트
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: COLORS.ACCENT_LIGHT_BLUE, // 연한 파란색 동화 만들기 버튼
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  createButtonText: {
    color: COLORS.WHITE, // 흰색 버튼 텍스트
    fontSize: 14,
    fontWeight: 'bold',
  },

  // === 로딩 상태 스타일 ===
  loadingText: {
    color: COLORS.WHITE, // 흰색 로딩 텍스트
    fontSize: 16,
  },
});

export default styles;

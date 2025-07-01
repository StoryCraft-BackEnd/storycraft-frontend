import { StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.74);

/**
 * StoryListScreen에서 사용하는 상수 값들
 * 컬러, 사이즈, 기타 설정값들을 중앙에서 관리
 */
export const STORY_LIST_CONSTANTS = {
  // 아이콘 사이즈 - 모든 기기에서 일관된 크기 유지
  ICON_SIZES: {
    BACK_BUTTON: wp('7%'), // 뒤로가기 버튼 아이콘 크기 (화면 너비의 7%)
    HEADER_BOOK: wp('7.5%'), // 헤더 책 아이콘 크기 (화면 너비의 7.5%)
    HEADER_SPARKLES: wp('6%'), // 헤더 스파클 아이콘 크기 (화면 너비의 6%)
    ILLUSTRATION_SPARKLES: wp('10%'), // 삽화 스파클 아이콘 크기 (화면 너비의 10%)
    READ_BUTTON_EYE: wp('5%'), // 읽기 버튼 눈 아이콘 크기 (화면 너비의 5%)
  },

  // 컬러 값 - 앱 전체에서 일관된 색상 사용
  COLORS: {
    WHITE: 'white', // 흰색
    GOLD: '#FFD700', // 골드 색상
    ILLUSTRATION_SPARKLES: 'rgba(255, 255, 255, 0.9)', // 삽화 스파클 반투명 흰색
    GRADIENT_START: '#EADFFF', // 그라데이션 시작 색상 (연보라)
    GRADIENT_END: '#D1C4E9', // 그라데이션 끝 색상 (진보라)
  },

  // 스크롤 설정 - 부드러운 스크롤 경험을 위한 최적화 값
  SCROLL: {
    THROTTLE: 16, // 스크롤 이벤트 제한 (60fps = 1000ms/60 ≈ 16ms)
    HEADER_HIDE_THRESHOLD: hp('6%'), // 헤더 숨김 임계값 (화면 높이의 6%)
  },

  // 인라인 스타일 - 컴포넌트 내부에서 사용하는 간단한 스타일
  INLINE_STYLES: {
    CARD_CONTENT: { flex: 1 }, // 카드 내용 영역이 남은 공간을 모두 차지
  },
};

/**
 * StoryListScreen 스타일 정의
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 * 다크모드/라이트모드 테마 지원
 * 동화 목록을 그리드 형태로 표시하는 화면 전용 스타일
 */
const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
    marginLeft: 18,
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'rgba(30,40,70,0.7)',
    marginRight: 8,
  },
  activeTabBtn: {
    backgroundColor: '#a18fff',
  },
  tabText: {
    color: '#b3b3ff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  cardList: {
    paddingLeft: 18,
    paddingRight: 8,
    paddingBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(20, 30, 60, 0.92)',
    borderRadius: 18,
    padding: 12,
    marginRight: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  date: {
    color: '#b3b3ff',
    fontSize: 13,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#232e4a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
  },
  tagText: {
    color: '#b3b3ff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  summary: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 18,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 28,
    marginRight: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  iconBtn: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;

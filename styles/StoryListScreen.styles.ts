import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
export const createStoryListScreenStyles = () => {
  // 테마 색상 가져오기 - 다크모드/라이트모드에 따라 자동 변경
  const cardBackgroundColor = useThemeColor('card'); // 카드 배경색
  const textColor = useThemeColor('text'); // 텍스트 색상
  const primaryColor = useThemeColor('primary'); // 주요 색상 (버튼 등)
  const placeholderTextColor = 'rgba(128, 128, 128, 0.8)'; // 플레이스홀더 텍스트 색상
  const insets = useSafeAreaInsets(); // 안전 영역 정보 (노치, 홈 인디케이터 등)

  return StyleSheet.create({
    // 배경 이미지 컨테이너 - 전체 화면을 덮는 배경
    backgroundImage: {
      flex: 1, // 부모 컨테이너의 모든 공간을 차지
      width: '100%', // 화면 너비의 100%
      height: '100%', // 화면 높이의 100%
    },

    // 반투명 오버레이 - 배경 이미지 위에 어두운 레이어 추가
    overlay: {
      ...StyleSheet.absoluteFillObject, // 부모 컨테이너를 꽉 채우는 절대 위치
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // 검은색 30% 투명도로 어둡게 처리
    },

    // 동화 목록을 담는 스크롤 뷰 컨테이너 - 메인 콘텐츠 영역
    container: {
      flex: 1, // 남은 공간을 모두 차지
      paddingTop: insets.top + hp('12%'), // 상단 안전 영역 + 화면 높이의 12% 여백
      paddingHorizontal: wp('30%'), // 좌우 여백 (화면 너비의 30%)
      paddingBottom: insets.bottom + hp('30%'), // 하단 안전 영역 + 화면 높이의 30% 여백
    },

    // 뒤로가기 버튼 - 절대 위치로 좌측 상단에 고정
    backButton: {
      position: 'absolute', // 절대 위치 설정
      top: insets.top + hp('3%'), // 상단 안전 영역 + 화면 높이의 3% 여백
      left: wp('5%'), // 좌측 여백 (화면 너비의 5%)
      flexDirection: 'row', // 가로 방향 배치
      alignItems: 'center', // 세로 중앙 정렬
      padding: wp('2%'), // 내부 여백 (화면 너비의 2%)
      zIndex: 10, // 다른 요소들 위에 표시
    },

    // 뒤로가기 버튼 텍스트 스타일
    backButtonText: {
      color: 'white', // 흰색 텍스트
      fontSize: wp('4.5%'), // 폰트 크기 (화면 너비의 4.5%)
      marginLeft: wp('1.5%'), // 아이콘과의 간격 (화면 너비의 1.5%)
      fontWeight: '600', // 폰트 굵기 (세미볼드)
    },

    // 헤더 제목 컨테이너 - 절대 위치로 중앙 상단에 고정
    headerTitleContainer: {
      position: 'absolute', // 절대 위치 설정
      top: insets.top + hp('4%'), // 상단 안전 영역 + 화면 높이의 4% 여백
      left: 0, // 좌측 끝부터
      right: 0, // 우측 끝까지
      flexDirection: 'row', // 가로 방향 배치
      justifyContent: 'center', // 가로 중앙 정렬
      alignItems: 'center', // 세로 중앙 정렬
      zIndex: 9, // 뒤로가기 버튼 아래, 다른 요소들 위에 표시
      overflow: 'hidden', // 영역을 벗어나는 내용 숨김
    },

    // 헤더 제목 텍스트 스타일
    headerTitle: {
      color: 'white', // 흰색 텍스트
      fontSize: wp('6%'), // 폰트 크기 (화면 너비의 6%)
      fontWeight: 'bold', // 폰트 굵기 (볼드)
      marginHorizontal: wp('2%'), // 좌우 여백 (화면 너비의 2%)
    },

    // 동화 목록 그리드 - 스크롤 가능한 영역의 레이아웃
    storyListGrid: {
      flexDirection: 'row', // 가로 방향 배치
      flexWrap: 'wrap', // 줄바꿈 허용
      justifyContent: 'space-between', // 카드들 사이 공간 균등 분배
      paddingBottom: hp('15%'), // 하단 여백 (화면 높이의 15%)
    },

    // 동화 카드 아이템 - 개별 동화 카드 스타일
    storyCard: {
      width: wp('42%'), // 카드 너비 (화면 너비의 42%)
      backgroundColor: cardBackgroundColor, // 카드 배경색 (테마에 따라 변경)
      borderRadius: wp('4%'), // 모서리 둥글기 (화면 너비의 4%)
      padding: wp('4%'), // 내부 여백 (화면 너비의 4%)
      marginBottom: hp('5%'), // 하단 여백 (화면 높이의 5%)
      shadowColor: '#000', // 그림자 색상
      shadowOffset: { width: 0, height: 4 }, // 그림자 위치 (아래쪽 4px)
      shadowOpacity: 0.3, // 그림자 투명도 (30%)
      shadowRadius: 5, // 그림자 흐림 정도
      elevation: 8, // Android 그림자 깊이
      flexDirection: 'column', // 세로 방향 배치
      justifyContent: 'space-between', // 내용을 위아래로 분산 배치
    },

    // 동화 제목 텍스트 스타일
    storyTitle: {
      fontSize: wp('3.8%'), // 폰트 크기 (화면 너비의 3.8%)
      fontWeight: 'bold', // 폰트 굵기 (볼드)
      color: textColor, // 텍스트 색상 (테마에 따라 변경)
      marginBottom: hp('0.5%'), // 하단 여백 (화면 높이의 0.5%)
    },

    // 동화 키워드 텍스트 스타일
    storyKeywords: {
      fontSize: wp('3%'), // 폰트 크기 (화면 너비의 3%)
      color: placeholderTextColor, // 플레이스홀더 색상
      marginBottom: hp('1.5%'), // 하단 여백 (화면 높이의 1.5%)
    },

    // 동화 삽화 플레이스홀더 - 그라데이션 배경
    illustrationPlaceholder: {
      height: hp('12%'), // 높이 (화면 높이의 12%)
      borderRadius: wp('3%'), // 모서리 둥글기 (화면 너비의 3%)
      justifyContent: 'center', // 세로 중앙 정렬
      alignItems: 'center', // 가로 중앙 정렬
      marginBottom: hp('3%'), // 하단 여백 (화면 높이의 3%)
    },

    // 삽화 플레이스홀더 텍스트 스타일
    illustrationText: {
      fontSize: wp('4%'), // 폰트 크기 (화면 너비의 4%)
      color: 'rgba(255, 255, 255, 0.9)', // 반투명 흰색
      fontWeight: '600', // 폰트 굵기 (세미볼드)
      marginTop: hp('1%'), // 상단 여백 (화면 높이의 1%)
    },

    // 'Read Story' 버튼 스타일
    readButton: {
      backgroundColor: primaryColor, // 배경색 (테마에 따라 변경)
      borderRadius: wp('6%'), // 모서리 둥글기 (화면 너비의 6%) - 타원형
      paddingVertical: hp('1.5%'), // 세로 내부 여백 (화면 높이의 1.5%)
      flexDirection: 'row', // 가로 방향 배치
      justifyContent: 'center', // 가로 중앙 정렬
      alignItems: 'center', // 세로 중앙 정렬
    },

    // 'Read Story' 버튼 텍스트 스타일
    readButtonText: {
      color: 'white', // 흰색 텍스트
      fontSize: wp('4%'), // 폰트 크기 (화면 너비의 4%)
      fontWeight: 'bold', // 폰트 굵기 (볼드)
      marginLeft: wp('2%'), // 아이콘과의 간격 (화면 너비의 2%)
    },
  });
};

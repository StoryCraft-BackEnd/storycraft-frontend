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
  // 아이콘 사이즈
  ICON_SIZES: {
    BACK_BUTTON: 28,
    HEADER_BOOK: 30,
    HEADER_SPARKLES: 24,
    ILLUSTRATION_SPARKLES: 40,
    READ_BUTTON_EYE: 20,
  },

  // 컬러 값
  COLORS: {
    WHITE: 'white',
    GOLD: '#FFD700',
    ILLUSTRATION_SPARKLES: 'rgba(255, 255, 255, 0.9)',
    GRADIENT_START: '#EADFFF',
    GRADIENT_END: '#D1C4E9',
  },

  // 스크롤 설정
  SCROLL: {
    THROTTLE: 16, // 60fps (자연스러움을 위해)
    HEADER_HIDE_THRESHOLD: 50, // 헤더 숨김 임계값(50넘어가면 숨김)
  },

  // 인라인 스타일
  INLINE_STYLES: {
    CARD_CONTENT: { flex: 1 },
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
  const cardBackgroundColor = useThemeColor('card');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const placeholderTextColor = 'rgba(128, 128, 128, 0.8)';
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    // 배경 이미지 컨테이너
    backgroundImage: {
      flex: 1, // 전체 화면을 차지
      width: '100%',
      height: '100%',
    },

    // 반투명 오버레이
    overlay: {
      ...StyleSheet.absoluteFillObject, // 부모 컨테이너를 꽉 채우는 절대 위치
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // 약간 어두운 반투명 색상
    },

    // 동화 목록을 담는 스크롤 뷰 컨테이너
    container: {
      flex: 1,
      paddingTop: insets.top + hp('12%'),
      paddingHorizontal: wp('30%'),
      paddingBottom: insets.bottom + hp('30%'),
    },

    // 뒤로가기 버튼 - 절대 위치 (좌측 상단)
    backButton: {
      position: 'absolute',
      top: insets.top + hp('3%'),
      left: wp('5%'),
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('2%'),
      zIndex: 10,
    },

    // 뒤로가기 버튼 텍스트
    backButtonText: {
      color: 'white',
      fontSize: wp('4.5%'),
      marginLeft: wp('1.5%'),
      fontWeight: '600',
    },

    // 헤더 제목 컨테이너 - 절대 위치 (중앙 상단)
    headerTitleContainer: {
      position: 'absolute',
      top: insets.top + hp('4%'),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9,
      overflow: 'hidden',
    },

    // 헤더 제목 텍스트
    headerTitle: {
      color: 'white',
      fontSize: wp('6%'),
      fontWeight: 'bold',
      marginHorizontal: wp('2%'),
    },

    // 동화 목록 그리드 - 스크롤 가능한 영역
    storyListGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingBottom: hp('15%'),
    },

    // 동화 카드 아이템 - 개별 동화 카드
    storyCard: {
      width: wp('42%'),
      backgroundColor: cardBackgroundColor,
      borderRadius: wp('4%'),
      padding: wp('4%'),
      marginBottom: hp('5%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    // 동화 제목
    storyTitle: {
      fontSize: wp('3.8%'),
      fontWeight: 'bold',
      color: textColor,
      marginBottom: hp('0.5%'),
    },

    // 동화 키워드
    storyKeywords: {
      fontSize: wp('3%'),
      color: placeholderTextColor,
      marginBottom: hp('1.5%'),
    },

    // 동화 삽화 플레이스홀더
    illustrationPlaceholder: {
      height: hp('12%'),
      borderRadius: wp('3%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('3%'),
    },

    // 삽화 플레이스홀더 텍스트
    illustrationText: {
      fontSize: wp('4%'),
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '600',
      marginTop: hp('1%'),
    },

    // 'Read Story' 버튼
    readButton: {
      backgroundColor: primaryColor,
      borderRadius: wp('6%'), // 타원형 버튼
      paddingVertical: hp('1.5%'),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 'Read Story' 버튼 텍스트
    readButtonText: {
      color: 'white',
      fontSize: wp('4%'),
      fontWeight: 'bold',
      marginLeft: wp('2%'),
    },
  });
};

import { StyleSheet, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 카드 너비 계산 (화면 너비의 74% 또는 최대 300px)
export const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.74);

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
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: wp('3%'), // 화면 너비의 3%
    paddingVertical: hp('0.5%'), // 화면 높이의 0.5%로 줄임
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
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
    marginBottom: hp('1%'), // 화면 높이의 1%로 더 줄임
    paddingHorizontal: wp('5%'), // 화면 너비의 5%
  },
  headerTitle: {
    fontSize: wp('6.5%'), // 반응형 폰트 크기 키움
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp('0.2%'), // 화면 높이의 0.2%로 더 줄임
  },
  headerSubtitle: {
    fontSize: wp('3.5%'), // 반응형 폰트 크기 키움
    color: '#b3b3ff',
    textAlign: 'center',
    opacity: 0.8,
  },

  // === 탭 네비게이션 스타일 ===
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'), // 화면 높이의 2%
    marginBottom: hp('2%'), // 화면 높이의 2%
    paddingHorizontal: wp('5%'), // 화면 너비의 5%
  },
  tabButton: {
    paddingVertical: hp('1%'), // 화면 높이의 1%
    paddingHorizontal: wp('3%'), // 화면 너비의 3%
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명 배경
    marginRight: wp('2%'), // 화면 너비의 2%
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#6c63ff', // 활성 탭 배경색
  },
  tabText: {
    color: '#b3b3ff',
    fontSize: wp('3%'), // 반응형 폰트 크기
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff', // 활성 탭 텍스트 색상
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
    backgroundColor: '#181f3a',
    borderRadius: 18,
    padding: wp('3%'), // 화면 너비의 3%로 더 줄임
    marginRight: wp('3%'), // 화면 너비의 3%로 줄임
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%로 더 줄임
    shadowColor: '#000',
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
    color: '#fff',
    flex: 1, // 남은 공간 차지
    lineHeight: wp('4.5%'), // 반응형 라인 높이 더 줄임
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: wp('2.5%'), // 반응형 폰트 크기 더 줄임
    color: '#b3b3ff',
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
    backgroundColor: '#23284a',
    borderRadius: 8,
    paddingHorizontal: wp('1.5%'), // 화면 너비의 1.5%로 줄임
    paddingVertical: hp('0.2%'), // 화면 높이의 0.2%로 줄임
    marginBottom: hp('0.2%'), // 화면 높이의 0.2%로 줄임
  },
  tagText: {
    fontSize: wp('2.5%'), // 반응형 폰트 크기 줄임
    color: '#b3b3ff',
    fontWeight: '500',
  },

  // === 요약 텍스트 스타일 ===
  cardSummary: {
    fontSize: wp('2.8%'), // 반응형 폰트 크기 더 줄임
    color: '#e0e0ff',
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
    backgroundColor: '#4f6cff',
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
    color: '#fff',
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
});

export default styles;

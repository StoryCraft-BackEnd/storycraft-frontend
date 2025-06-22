import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * MainScreen 스타일 정의
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 * 메인 화면의 모든 UI 요소들의 반응형 레이아웃 정의
 */
export const MainScreenStyles = StyleSheet.create({
  // 메인 화면의 전체 컨테이너 (배경 이미지와 내용을 감싸는 최상위 컨테이너)
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // 메인 화면의 배경 이미지 (아침/일몰/밤 배경)
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // 중앙에 표시되는 동화 목록을 감싸는 컨테이너 (가로 스크롤 뷰의 부모)
  storyContainer: {
    flex: 1,
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
    marginTop: hp('-0.4%'), // 아래로 화면 높이의 0.4%만큼 이동 (기존 -3px)
  },
  // 가로로 스크롤되는 동화 목록의 스타일
  storyScrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1%'), // 화면 너비의 1%를 좌우 패딩으로 사용 (기존 5px)
    // 스크롤 가능하도록 컨테이너 너비 제한하지 않음
  },
  // 가로 스크롤 뷰 안의 개별 동화 아이템 (이미지와 제목을 포함)
  storyItem: {
    width: wp('50%'), // 화면 너비의 20%로 줄여서 3개 정도만 보이도록 조정 (기존 25%)
    height: hp('18%'), // 화면 높이의 18%를 아이템 높이로 사용 (기존 150px)
    marginHorizontal: wp('0.1%'), // 좌우 여백 추가하여 아이템 간격 확보
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 동화 아이템의 표지 이미지
  storyImage: {
    width: wp('48%'), // 화면 너비의 18%로 이미지 크기 조정 (기존 22%)
    height: hp('16%'), // 화면 높이의 17%를 이미지 높이로 사용 (기존 140px)
    // borderRadius: 10, // 둥근 모서리
  },
  // 동화 아이템의 제목 텍스트
  storyTitle: {
    color: 'white',
    fontSize: wp('3.5%'), // 화면 너비의 3.5%를 폰트 크기로 사용 (기존 14px)
    fontWeight: 'bold',
    marginTop: hp('1%'), // 화면 높이의 1%를 상단 여백으로 사용 (기존 8px)
    textAlign: 'center',
  },
  // 화면 하단의 5개 버튼을 감싸는 컨테이너
  buttonContainer: {
    position: 'absolute', // 화면 하단에 고정
    bottom: hp('3.5%'), // 하단에서 화면 높이의 3.5%만큼 떨어진 곳에 위치 (기존 30px)
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: wp('5%'), // 화면 너비의 5%를 좌우 패딩으로 사용 (기존 20px)
  },
  // 하단의 개별 버튼 (이미지와 텍스트를 포함)
  button: {
    position: 'absolute',
    alignItems: 'center',
  },
  button1: {
    bottom: 0,
    left: '5%',
  },
  button2: {
    bottom: 0,
    left: '15%',
  },
  button3: {
    bottom: 0,
    left: '25%',
  },
  button4: {
    bottom: 0,
    left: '35%',
  },
  button5: {
    bottom: 0,
    left: '45%',
  },
  button6: {
    bottom: 0,
    left: '55%',
  },
  button7: {
    bottom: 0,
    left: '67%',
  },
  button8: {
    bottom: 0,
    left: '74%',
  },
  // 하단 버튼 내부의 이미지
  buttonImage: {
    width: wp('8%'), // 화면 너비의 8%로 증가 (기존 5%)
    height: wp('8%'), // 화면 너비의 8%로 증가 (기존 5%)
    marginBottom: hp('1%'), // 화면 높이의 1%로 증가 (기존 0.6%)
  },
  // 하단 버튼의 텍스트
  buttonText: {
    color: 'white',
    fontSize: wp('4%'), // 화면 너비의 4%로 증가 (기존 3%)
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // 텍스트 가독성 향상을 위한 그림자 추가
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 우측 상단의 "전체 목록 보기" 버튼
  viewAllButton: {
    position: 'absolute',
    top: hp('8%'), // 위에서 화면 높이의 8%만큼 떨어진 곳에 위치 (기존 70px)
    right: wp('5%'), // 우측에서 화면 너비의 5%만큼 떨어진 곳에 위치 (기존 20px)
    padding: wp('2.5%'), // 화면 너비의 2.5%를 패딩으로 사용 (기존 10px)
    zIndex: 1000, // 다른 요소들보다 위에 표시
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 배경색 추가로 터치 영역 시각화
    borderRadius: wp('1%'), // 화면 너비의 1%를 모서리 둥글기로 사용 (기존 5px)
  },
  // "전체 목록 보기" 버튼의 텍스트
  viewAllText: {
    color: 'white',
    fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용 (기존 16px)
    fontWeight: 'bold', // 글자 두께 증가
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // 텍스트 그림자 추가
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 전체 목록 화면의 상단 헤더 (돌아가기 버튼과 제목을 포함)
  storyListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('5%'), // 화면 너비의 5%를 패딩으로 사용 (기존 20px)
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // 전체 목록 화면의 "돌아가기" 버튼
  backButton: {
    padding: wp('2.5%'), // 화면 너비의 2.5%를 패딩으로 사용 (기존 10px)
  },
  // "돌아가기" 버튼의 텍스트
  backButtonText: {
    color: 'white',
    fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용 (기존 16px)
    fontWeight: '500',
  },
  // 전체 목록 화면의 제목 텍스트
  storyListTitle: {
    color: 'white',
    fontSize: wp('5%'), // 화면 너비의 5%를 폰트 크기로 사용 (기존 20px)
    fontWeight: 'bold',
    marginLeft: wp('5%'), // 화면 너비의 5%를 좌측 여백으로 사용 (기존 20px)
  },
  // 전체 목록 화면의 그리드 레이아웃 (동화 목록을 감싸는 컨테이너)
  storyListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: wp('2.5%'), // 화면 너비의 2.5%를 패딩으로 사용 (기존 10px)
    justifyContent: 'space-around',
  },
  // 전체 목록 화면의 개별 동화 아이템 (이미지와 제목을 포함)
  storyGridItem: {
    width: '30%',
    marginBottom: hp('2.5%'), // 화면 높이의 2.5%를 하단 여백으로 사용 (기존 20px)
    alignItems: 'center',
  },
  // 전체 목록 화면의 동화 표지 이미지
  storyGridImage: {
    width: wp('15%'), // 화면 너비의 15%를 이미지 너비로 사용 (기존 120px)
    height: hp('20%'), // 화면 높이의 20%를 이미지 높이로 사용 (기존 160px)
    borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용 (기존 10px)
  },
  // 전체 목록 화면의 동화 제목 텍스트
  storyGridTitle: {
    color: 'white',
    fontSize: wp('3.5%'), // 화면 너비의 3.5%를 폰트 크기로 사용 (기존 14px)
    fontWeight: 'bold',
    marginTop: hp('1%'), // 화면 높이의 1%를 상단 여백으로 사용 (기존 8px)
    textAlign: 'center',
  },
  // 동화 생성 버튼 - 우측 하단에 떠있는 액션 버튼
  createStoryButton: {
    position: 'absolute',
    bottom: hp('6%'), // 하단에서 화면 높이의 7%만큼 떨어진 곳에 위치 (기존 60px)
    right: wp('10%'), // 우측에서 화면 너비의 8%만큼 떨어진 곳에 위치 (기존 70px)
    width: wp('18%'), // 화면 너비의 12%로 증가 (기존 7%)
    height: wp('18%'), // 화면 너비의 12%로 증가 (기존 7%)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 배경색 추가로 버튼 영역 시각화
    borderRadius: wp('6%'), // 원형 버튼을 위한 둥근 모서리
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)', // 테두리 추가
  },
  // 동화 생성 버튼의 이미지
  createStoryButtonImage: {
    width: wp('10%'), // 화면 너비의 10%로 증가 (기존 8%)
    height: wp('10%'), // 화면 너비의 10%로 증가 (기존 8%)
  },
  // 로고 이미지 스타일 - 좌측 상단에 위치
  logoImage: {
    position: 'absolute',
    top: hp('-1%'), // 위에서 화면 높이의 -1%만큼 떨어진 곳에 위치 (기존 -10px)
    left: wp('2%'), // 좌측에서 화면 너비의 2%만큼 떨어진 곳에 위치 (기존 10px)
    width: wp('45%'), // 화면 너비의 22%를 로고 너비로 사용 (기존 180px)
    height: hp('15%'), // 화면 높이의 15%를 로고 높이로 사용 (기존 120px)
    zIndex: 1000,
  },
  // 포인트 컨테이너 스타일 - 우측 상단에 위치
  pointContainer: {
    position: 'absolute',
    top: hp('1%'), // 위에서 화면 높이의 1%만큼 떨어진 곳에 위치 (기존 10px)
    right: wp('13%'), // 우측에서 화면 너비의 13%만큼 떨어진 곳에 위치 (기존 110px)
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  // 성취도 컨테이너 스타일 - 포인트 컨테이너 내부
  achieveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 포인트 이미지 스타일 - 아이콘과 텍스트 사이 간격 조정
  pointImage: {
    width: wp('5%'), // 화면 너비의 5%를 이미지 너비로 사용 (기존 40px)
    height: wp('5%'), // 화면 너비의 5%를 이미지 높이로 사용 (기존 40px)
    marginRight: wp('1%'), // 우측 여백: 화면 너비의 1% (기존 5px)
    marginLeft: wp('6%'), // 좌측 여백: 화면 너비의 6% (기존 50px)
  },
  // 포인트 텍스트 스타일 - 큰 폰트 크기로 강조
  pointText: {
    color: 'white',
    fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 사용 (기존 24px)
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 사용자 프로필 컨테이너 스타일 - 상단 중앙에 위치
  userProfileContainer: {
    position: 'absolute',
    top: hp('1%'), // 위에서 화면 높이의 1%만큼 떨어진 곳에 위치 (기존 10px)
    left: '50%',
    transform: [{ translateX: -wp('12%') }], // 가운데 정렬을 위해 컨테이너의 절반만큼 왼쪽으로 이동 (기존 -100px)
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  // 사용자 프로필 이미지 스타일 - 원형 프로필
  userProfileImage: {
    width: wp('6%'), // 화면 너비의 6%를 이미지 너비로 사용 (기존 50px)
    height: wp('6%'), // 화면 너비의 6%를 이미지 높이로 사용 (기존 50px)
    borderRadius: wp('3%'), // 화면 너비의 3%를 반지름으로 사용하여 원형 생성 (기존 25px)
    borderWidth: 2,
    borderColor: 'white',
  },
  // 사용자 이름 스타일 - 프로필 이미지 옆에 표시
  userNameText: {
    color: 'white',
    fontSize: wp('5%'), // 화면 너비의 5%를 폰트 크기로 사용 (기존 20px)
    fontWeight: 'bold',
    marginLeft: wp('4%'), // 좌측 여백: 화면 너비의 4% (기존 15px)
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

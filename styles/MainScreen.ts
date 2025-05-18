import { StyleSheet } from 'react-native';

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
    marginTop: -3, // 아래로 30픽셀 이동
  },
  // 가로로 스크롤되는 동화 목록의 스타일
  storyScrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  // 가로 스크롤 뷰 안의 개별 동화 아이템 (이미지와 제목을 포함)
  storyItem: {
    width: 200,
    height: 150,
    marginHorizontal: 0, // 좌우 여백 증가
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 동화 아이템의 표지 이미지
  storyImage: {
    width: 180,
    height: 140,
    // borderRadius: 10, // 둥근 모서리
  },
  // 동화 아이템의 제목 텍스트
  storyTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8, // 이미지와의 간격
    textAlign: 'center',
  },
  // 화면 하단의 5개 버튼을 감싸는 컨테이너
  buttonContainer: {
    position: 'absolute', // 화면 하단에 고정
    bottom: 30, // 하단에서의 거리
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  // 하단의 개별 버튼 (이미지와 텍스트를 포함)
  button: {
    position: 'absolute',
    alignItems: 'center',
  },
  button1: {
    bottom: 0,
    left: '10%',
  },
  button2: {
    bottom: 0,
    left: '20%',
  },
  button3: {
    bottom: 0,
    left: '30%',
  },
  button4: {
    bottom: 0,
    left: '40%',
  },
  button5: {
    bottom: 0,
    left: '50%',
  },
  button6: {
    bottom: 0,
    left: '60%',
  },
  button7: {
    bottom: 0,
    left: '70%',
  },
  button8: {
    bottom: 0,
    left: '78%', // 육안상 평행이 안맞아 수정
  },
  // 하단 버튼 내부의 이미지
  buttonImage: {
    width: 40,
    height: 40,
    marginBottom: 5, // 이미지와 텍스트 사이 간격
  },
  // 하단 버튼의 텍스트
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // 우측 상단의 "전체 목록 보기" 버튼
  viewAllButton: {
    position: 'absolute',
    top: 70, // 위에서부터의 거리 증가
    right: 20,
    padding: 10,
    zIndex: 1000, // 다른 요소들보다 위에 표시
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 배경색 추가로 터치 영역 시각화
    borderRadius: 5,
  },
  // "전체 목록 보기" 버튼의 텍스트
  viewAllText: {
    color: 'white',
    fontSize: 16, // 글자 크기 증가
    fontWeight: 'bold', // 글자 두께 증가
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // 텍스트 그림자 추가
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 전체 목록 화면의 상단 헤더 (돌아가기 버튼과 제목을 포함)
  storyListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // 전체 목록 화면의 "돌아가기" 버튼
  backButton: {
    padding: 10,
  },
  // "돌아가기" 버튼의 텍스트
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // 전체 목록 화면의 제목 텍스트
  storyListTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  // 전체 목록 화면의 그리드 레이아웃 (동화 목록을 감싸는 컨테이너)
  storyListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-around',
  },
  // 전체 목록 화면의 개별 동화 아이템 (이미지와 제목을 포함)
  storyGridItem: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
  },
  // 전체 목록 화면의 동화 표지 이미지
  storyGridImage: {
    width: 120,
    height: 160,
    borderRadius: 10,
  },
  // 전체 목록 화면의 동화 제목 텍스트
  storyGridTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  // 동화 생성 버튼
  createStoryButton: {
    position: 'absolute',
    bottom: 60,
    right: 70,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createStoryButtonImage: {
    width: 70,
    height: 70,
  },
  // 로고 이미지 스타일
  logoImage: {
    position: 'absolute',
    top: -10,
    left: 10,
    width: 180,
    height: 120,
    zIndex: 1000,
  },
  // 포인트 컨테이너 스타일
  pointContainer: {
    position: 'absolute',
    top: 10,
    right: 110,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  // 성취도 컨테이너 스타일
  achieveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 포인트 이미지 스타일
  pointImage: {
    width: 40,
    height: 40,
    marginRight: 5, // 아이콘과 글자 사이 간격
    marginLeft: 50, // 성취도와 포인트 사이 간격
  },
  // 포인트 텍스트 스타일
  pointText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 사용자 프로필 컨테이너 스타일
  userProfileContainer: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [{ translateX: -100 }], // 가운데 정렬을 위해 컨테이너의 절반만큼 왼쪽으로 이동
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  // 사용자 프로필 이미지 스타일
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // 원형 프로필
    borderWidth: 2,
    borderColor: 'white',
  },
  // 사용자 이름 스타일
  userNameText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

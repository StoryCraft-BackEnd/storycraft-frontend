import { StyleSheet } from 'react-native';

export const StoryCreateScreenStyles = StyleSheet.create({
  // --- 배경 ---
  backgroundImage: {
    flex: 1, // 화면 전체를 채우도록 설정
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 부모 뷰를 완전히 덮는 스타일
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 배경 이미지 위에 어두운 오버레이 효과
  },
  // --- 뒤로가기 버튼 ---
  backButton: {
    position: 'absolute', // 화면의 특정 위치에 고정
    // top 속성은 컴포넌트에서 동적으로 설정합니다.
    left: 20, // 왼쪽으로부터의 간격
    zIndex: 10, // 다른 UI 요소들보다 위에 표시되도록 함
  },
  // --- 컨테이너 ---
  container: {
    flexGrow: 1,
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
    padding: 20, // 내부 여백
  },
  // --- 메인 카드 ---
  card: {
    width: '100%',
    maxWidth: 500, // 최대 너비 제한
    backgroundColor: 'rgba(20, 15, 40, 0.8)', // 반투명한 어두운 배경색
    borderRadius: 20, // 둥근 모서리
    padding: 30, // 내부 여백
    alignItems: 'center', // 자식 요소들을 가로 중앙 정렬
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // 은은한 테두리 효과
  },
  // --- 제목 및 부제 ---
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 30,
  },
  // --- 키워드 입력 ---
  inputContainer: {
    flexDirection: 'row', // 자식 요소들을 가로로 배치
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    flex: 1, // 남은 공간을 모두 차지
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명한 흰색 배경
    borderRadius: 10,
    borderTopRightRadius: 0, // 오른쪽 상단 모서리는 각지게
    borderBottomRightRadius: 0, // 오른쪽 하단 모서리는 각지게
    paddingHorizontal: 15, // 좌우 내부 여백
    color: '#fff',
    fontSize: 16,
  },
  // --- 키워드 추가 버튼 ---
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFD700', // 금색 배경
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderTopLeftRadius: 0, // 왼쪽 상단 모서리는 각지게
    borderBottomLeftRadius: 0, // 왼쪽 하단 모서리는 각지게
  },
  addButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  // --- 키워드 목록 ---
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 여러 줄로 표시
    justifyContent: 'center',
    width: '100%',
    minHeight: 30, // 최소 높이
    marginBottom: 30,
  },
  keywordChip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    alignItems: 'center',
  },
  keywordText: {
    color: '#fff',
    fontSize: 14,
  },
  // --- 키워드 삭제 아이콘 ---
  keywordCloseIcon: {
    marginLeft: 5,
  },
  // --- 동화 생성 버튼 ---
  createButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20, // 텍스트 중앙 정렬을 위해 좌우 여백 추가
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-between', // 자식 요소들을 양쪽 끝으로 정렬
    flexDirection: 'row',
  },
  // --- 동화 생성 버튼 아이콘 스페이서 ---
  buttonIconSpacer: {
    width: 22, // 아이콘 너비와 동일하게 설정하여 텍스트 중앙 정렬
  },
  // --- 비활성화된 버튼 스타일 ---
  disabledButton: {
    opacity: 0.6, // 투명도 조절
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

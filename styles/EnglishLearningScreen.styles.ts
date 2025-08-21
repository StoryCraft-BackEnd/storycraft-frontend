/**
 * ===================================================================
 * 🌟 영어 학습 화면 스타일 정의 (EnglishLearningScreen.styles.ts)
 * ===================================================================
 *
 * 이 파일은 영어 학습 화면의 모든 UI 컴포넌트 스타일을 정의합니다.
 * 동화 스타일의 아름다운 학습 환경을 제공하기 위해 신중하게 디자인되었습니다.
 *
 */

import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const englishLearningStyles = StyleSheet.create({
  // ===================================================================
  // 🏠 기본 컨테이너 및 배경 스타일
  // ===================================================================

  /**
   * 💫 메인 컨테이너
   * 전체 화면을 차지하는 루트 컨테이너
   * 어두운 네이비 배경으로 동화 같은 분위기 연출
   */
  container: {
    flex: 1, // 화면 전체 차지
    backgroundColor: '#1a1a2e', // 어두운 네이비 배경
  },

  /**
   * 🌌 배경 이미지 레이어
   * 전체 화면을 덮는 배경 그라데이션
   * 마법같은 학습 환경을 위한 색상 조합
   */
  backgroundImage: {
    flex: 1, // 전체 화면 차지
    position: 'absolute', // 절대 위치로 배치
    width: '100%', // 전체 너비
    height: '100%', // 전체 높이
    backgroundColor: '#1a1a4a', // 어두운 보라 배경
  },

  /**
   * 🎭 오버레이 레이어
   * 배경 위에 반투명 레이어를 추가하여 텍스트 가독성 향상
   * 모든 콘텐츠의 패딩과 여백 관리
   */
  overlay: {
    flex: 1, // 전체 화면 차지
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 반투명 검정 오버레이
    paddingHorizontal: wp(5), // 좌우 여백 5% (반응형)
    paddingTop: hp(2), // 상단 여백 2% (반응형) - 상단 요소들을 위한 공간
    paddingBottom: hp(4), // 하단 여백 5% (반응형)
  },

  // ===================================================================
  // 🧭 상단 네비게이션 및 헤더 스타일
  // ===================================================================

  /**
   * 📋 헤더 컨테이너
   * 상단 네비게이션 요소들의 기본 레이아웃
   * 좌우 정렬로 균형잡힌 배치
   */
  header: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    alignItems: 'center', // 수직 중앙 정렬
    marginBottom: hp(2.5), // 아래쪽 여백 2.5% (반응형)
  },

  /**
   * ⬅️ 뒤로가기 버튼
   * 좌측 상단에 위치한 네비게이션 버튼
   * 반투명 배경으로 자연스러운 시각적 통합
   */
  backButton: {
    position: 'absolute', // 절대 위치
    top: hp(2), // 상단에서 2% (반응형) - 기존 4%에서 2%로 변경
    left: wp(5), // 좌측에서 5% (반응형)
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 반투명 흰색 배경
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    padding: wp(2.5), // 내부 여백 2.5% (반응형)
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * ⬅️ 뒤로가기 버튼 텍스트
   * 화살표 아이콘 스타일링
   * 굵은 글꼴로 시각적 명확성 확보
   */
  backButtonText: {
    color: '#ffffff', // 흰색 텍스트
    fontSize: wp(4.5), // 글자 크기 4.5% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
  },

  /**
   * 📄 페이지 진행 상황 표시기
   * 우측 상단에 현재 페이지 정보 표시
   * 황금색 배경으로 중요 정보 강조
   */
  progressContainer: {
    position: 'absolute', // 절대 위치
    top: hp(4), // 상단에서 4% (반응형)
    right: wp(5), // 우측에서 5% (반응형)
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경 (90% 투명도)
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1), // 상하 내부 여백 1% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * 📄 페이지 진행 텍스트
   * "페이지 2/3" 형태의 정보 표시
   * 어두운 색상으로 명확한 가독성
   */
  progressText: {
    color: '#333', // 어두운 회색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
  },

  /**
   * 🔊 읽어주기 버튼
   * 텍스트 음성 변환 기능 버튼
   * 페이지 표시기 옆에 배치하여 접근성 향상
   */
  readAloudButton: {
    position: 'absolute', // 절대 위치
    top: hp(4), // 상단에서 4% (반응형)
    right: wp(34), // 우측에서 25% (페이지 표시기 옆, 반응형)
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1), // 상하 내부 여백 1% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * 🔊 읽어주기 버튼 텍스트
   * 스피커 이모지와 텍스트 조합
   * 직관적인 기능 인식을 위한 디자인
   */
  readAloudText: {
    color: '#333', // 어두운 회색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
  },

  /**
   * 🎛️ 상단 버튼 컨트롤 그룹
   * 읽어주기와 퀴즈 버튼을 그룹화
   * 일관된 레이아웃 유지
   */
  topControls: {
    position: 'absolute', // 절대 위치
    top: hp(2), // 상단에서 2% (반응형) - 기존 4%에서 2%로 변경
    right: wp(5), // 우측에서 5% (반응형)
    flexDirection: 'row', // 가로 방향 정렬
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * 🔊 그룹 내 읽어주기 버튼
   * topControls 그룹 내에서 사용되는 읽어주기 버튼
   * 퀴즈 버튼과 일관된 스타일
   */
  readAloudButtonInGroup: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1), // 상하 내부 여백 1% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    marginRight: wp(2), // 페이지 현황과의 간격 2% (반응형)
  },

  /**
   * 🎭 TTS 설정 버튼
   * topControls 그룹 내에서 사용되는 TTS 설정 버튼
   * 성우 변경 등의 TTS 설정을 위한 버튼
   */
  ttsSettingsButton: {
    backgroundColor: 'rgba(183, 155, 229, 0.85)', // 귀여운 라벤더 파스텔 보라색 배경 (#B79BE5와 유사)
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1), // 상하 내부 여백 1% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    marginRight: wp(2), // 페이지 현황과의 간격 2% (반응형)
  },

  /**
   * 📄 그룹 내 페이지 진행 상황 표시기
   * topControls 그룹 내에서 사용되는 페이지 현황 표시
   * 다른 버튼들과 일관된 스타일
   */
  progressContainerInGroup: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경 (90% 투명도)
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1), // 상하 내부 여백 1% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
  },

  // ===================================================================
  // 🏷️ 제목 및 헤더 섹션
  // ===================================================================

  /**
   * 🎯 제목 섹션 컨테이너
   * 동화 제목을 중앙에 배치하는 컨테이너
   * 적절한 상하 여백으로 시각적 균형 유지
   */
  titleSection: {
    alignItems: 'center', // 중앙 정렬
    marginTop: hp(0), // 상단에서 0% 여백
    marginBottom: hp(10), // 하단 여백 10% (반응형)
  },

  /**
   * 📚 동화 제목 스타일
   * 메인 제목 텍스트 ("The Brave Little Rabbit")
   * 그림자 효과로 깊이감 있는 시각적 표현
   */
  storyTitle: {
    fontSize: wp(6), // 큰 글자 크기로 제목 강조 6% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
    color: '#ffffff', // 흰색 텍스트
    textAlign: 'center', // 중앙 정렬
    marginBottom: hp(1.5), // 하단 여백 1.5% (반응형)
    // 그림자 효과로 깊이감 연출
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정 그림자
    textShadowOffset: { width: wp(0.5), height: wp(0.5) }, // 그림자 오프셋 (반응형)
    textShadowRadius: wp(1), // 그림자 블러 반경 1% (반응형)
  },

  /**
   * 🔄 삽화 로딩 상태 텍스트
   * 삽화가 로딩 중일 때 표시되는 텍스트
   * 제목 아래에 작게 표시되어 사용자에게 피드백 제공
   */
  loadingText: {
    fontSize: wp(3.5), // 작은 글자 크기 3.5% (반응형)
    color: '#ffd700', // 황금색으로 시각적 강조
    textAlign: 'center', // 중앙 정렬
    marginTop: hp(1), // 상단 여백 1% (반응형)
    fontStyle: 'italic', // 이탤릭체로 로딩 상태 표현
    opacity: 0.8, // 약간 투명하게 처리
  },

  // ===================================================================
  // 📖 메인 콘텐츠 영역
  // ===================================================================

  /**
   * 🎭 메인 콘텐츠 컨테이너
   * 동화 텍스트와 단어 학습 패널을 나란히 배치
   * 2:1 비율로 균형있는 레이아웃 구성
   */
  mainContent: {
    flex: 1, // 남은 공간 모두 차지
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    alignItems: 'flex-start', // 상단 정렬로 변경
    marginTop: hp(-9), // 상단 여백 -9% (반응형) - 제목과의 간격 최소화
  },

  /**
   * 📜 동화 내용 섹션
   * 메인 스토리 텍스트와 단어 학습 요소들을 포함
   * 토글 상태에 따라 크기 조정
   */
  storyContentSection: {
    flex: 0.65, // 기본 크기로 복원 (즐겨찾기 패널과 함께 사용)
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 검정 배경
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    padding: wp(6), // 내부 여백 6% (반응형)
    marginRight: wp(4), // 우측 여백 4%로 복원 (반응형)
    minHeight: hp(25), // 최소 높이 25% (반응형)
  },

  /**
   * 📝 동화 본문 텍스트
   * 메인 스토리 내용 표시
   * 적절한 줄 간격으로 가독성 최적화
   */
  storyText: {
    fontSize: wp(4.5), // 읽기 좋은 글자 크기 4.5% (반응형)
    color: '#ffffff', // 흰색 텍스트
    lineHeight: wp(7), // 줄 간격 7% (반응형)
    textAlign: 'center', // 중앙 정렬
    marginBottom: hp(2.5), // 하단 여백 2.5% (반응형)
  },

  /**
   * ✨ 하이라이트된 단어 스타일
   * 본문 내에서 학습 대상 단어 강조
   * 황금색과 밑줄로 시각적 구분
   */
  highlightedWord: {
    color: '#ffd700', // 황금색 텍스트
    fontWeight: 'bold', // 굵은 글꼴
    textDecorationLine: 'underline', // 밑줄 효과
  },

  /**
   * 🎯 한국어 번역 텍스트
   * 동화 내용의 한국어 번역 표시
   * 이탤릭체로 원문과 시각적 구분
   */
  koreanTranslation: {
    fontSize: wp(4), // 글자 크기 4% (반응형)
    color: '#cccccc', // 밝은 회색
    lineHeight: wp(6), // 줄 간격 6% (반응형)
    textAlign: 'center', // 중앙 정렬
    marginBottom: hp(2), // 하단 여백 2% (반응형)
    fontStyle: 'italic', // 이탤릭체
    alignSelf: 'center', // 자체 중앙 정렬
    width: '100%', // 전체 너비
  },

  // ===================================================================
  // 📚 단어 학습 관련 컴포넌트
  // ===================================================================

  /**
   * 🔤 핵심 단어 컨테이너
   * 학습 대상 단어들을 카드 형태로 배치
   * 반응형 레이아웃으로 자동 줄바꿈
   */
  keyWords: {
    flexDirection: 'row', // 가로 방향 배치
    flexWrap: 'wrap', // 공간 부족시 자동 줄바꿈
    justifyContent: 'center', // 중앙 정렬
    gap: wp(2), // 카드 간 간격 2% (반응형)
    marginTop: hp(2), // 상단 여백 2% (반응형)
  },

  /**
   * 🎴 단어 카드 아이템
   * 개별 단어와 즐겨찾기 버튼을 포함하는 카드
   * 반투명 배경과 황금색 테두리로 시각적 구분
   */
  keyWordItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명 흰색 배경
    paddingHorizontal: wp(2.5), // 좌우 내부 여백 2.5% (반응형)
    paddingVertical: hp(0.6), // 상하 내부 여백 0.6% (반응형)
    borderRadius: wp(4), // 둥근 모서리 4% (반응형)
    borderWidth: 1, // 테두리 두께
    borderColor: 'rgba(255, 215, 0, 0.5)', // 황금색 테두리
    flexDirection: 'row', // 가로 방향 배치 (별표 + 단어)
    alignItems: 'center', // 수직 중앙 정렬
    gap: wp(1.5), // 별표와 단어 사이 간격 1.5% (반응형)
  },

  /**
   * 📝 단어 텍스트 컨테이너
   * 영어 단어와 한국어 뜻을 세로로 배치
   * 카드 내부의 텍스트 영역 관리
   */
  wordTextContainer: {
    flexDirection: 'column', // 세로 방향 배치
    alignItems: 'center', // 중앙 정렬
  },

  /**
   * ⭐ 단어별 즐겨찾기 버튼
   * 각 단어 카드 내부의 별표 버튼
   * 최소한의 패딩으로 컴팩트한 디자인
   */
  wordFavoriteButton: {
    padding: wp(0.5), // 최소 패딩 0.5% (반응형)
  },

  /**
   * ⭐ 즐겨찾기 별표 텍스트
   * 채워진 별(⭐)과 빈 별(☆) 표시
   * 영어 단어와 동일한 크기로 시각적 균형
   */
  wordFavoriteText: {
    fontSize: wp(3.5), // 영어 단어와 동일한 크기 3.5% (반응형)
    color: '#ffd700', // 황금색
  },

  /**
   * 🔤 영어 단어 텍스트
   * 학습 대상 영어 단어 표시
   * 황금색으로 강조하여 학습 포인트 명확화
   */
  keyWordText: {
    color: '#ffd700', // 황금색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '500', // 중간 굵기
  },

  /**
   * 🇰🇷 한국어 뜻 텍스트
   * 영어 단어의 한국어 번역
   * 클릭시에만 표시되는 조건부 요소
   */
  keyWordKorean: {
    color: '#cccccc', // 밝은 회색
    fontSize: wp(2.5), // 작은 글자 크기 2.5% (반응형)
    marginTop: hp(0.3), // 상단 여백 0.3% (반응형)
  },

  // ===================================================================
  // 📋 우측 학습 패널
  // ===================================================================

  /**
   * 📚 단어 학습 패널
   * 우측에 위치한 즐겨찾기 단어 표시 영역
   * 세로 높이만 스토리 콘텐츠와 동일하게 설정
   */
  vocabularyPanel: {
    flex: 0.3, // 원래 크기로 복원 (30%)
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 반투명 흰색 배경
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    padding: wp(5), // 내부 여백 5% (반응형) - 원래 값으로 복원
    alignItems: 'center', // 중앙 정렬
    // justifyContent: 'center', // 수직 중앙 정렬
    minHeight: hp(37), // 최소 높이 25% (반응형) - 스토리 콘텐츠와 동일한 세로 높이
    alignSelf: 'stretch', // 세로 높이를 부모 컨테이너에 맞춤
  },

  /**
   * 🏷️ 패널 제목
   * "즐겨찾기 단어" 제목 텍스트
   * 패널의 기능을 명확히 설명
   */
  vocabularyTitle: {
    fontSize: wp(4.5), // 제목 크기 4.5% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
    color: '#333', // 어두운 회색
    marginBottom: hp(2), // 하단 여백 2% (반응형)
  },

  /**
   * 🌟 패널 아이콘
   * 즐겨찾기를 나타내는 별표 이모지
   * 패널 기능의 시각적 표현
   */
  vocabularyIcon: {
    fontSize: wp(15), // 큰 아이콘 크기 15% (반응형)
    color: '#666', // 중간 회색
    marginBottom: hp(1.5), // 하단 여백 1.5% (반응형)
  },

  /**
   * 📚 즐겨찾기 단어 설명
   * 즐겨찾기 단어 기능에 대한 안내 텍스트
   * 작은 글자로 부가 정보 제공
   */
  vocabularyDescription: {
    color: '#b8b8b8', // 연한 회색 텍스트
    fontSize: wp(3), // 글자 크기 3% (반응형)
    textAlign: 'center', // 중앙 정렬
    lineHeight: wp(4), // 줄 간격 4% (반응형)
    marginTop: hp(1), // 위쪽 여백 1% (반응형)
  },

  // ===================================================================
  // 📚 저장된 단어 표시 스타일
  // ===================================================================

  /**
   * 📚 저장된 단어 컨테이너
   * 동화에서 추출된 학습 단어들을 표시하는 영역
   * 단어, 뜻, 예문을 포함한 완전한 학습 정보 제공
   */
  savedWordsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명 흰색 배경
    borderRadius: wp(3), // 둥근 모서리 3% (반응형)
    padding: wp(4), // 내부 여백 4% (반응형)
    marginTop: hp(2), // 위쪽 여백 2% (반응형)
    marginBottom: hp(2), // 아래쪽 여백 2% (반응형)
  },

  /**
   * 📚 저장된 단어 제목
   * 학습 단어 섹션의 제목
   * 책 아이콘과 함께 표시
   */
  savedWordsTitle: {
    color: '#ffffff', // 흰색 텍스트
    fontSize: wp(4.5), // 글자 크기 4.5% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
    textAlign: 'center', // 중앙 정렬
    marginBottom: hp(2), // 아래쪽 여백 2% (반응형)
  },

  /**
   * 📚 저장된 단어 아이템
   * 각 단어의 정보를 담는 개별 컨테이너
   * 단어, 뜻, 예문을 세로로 배치
   */
  savedWordItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // 매우 연한 반투명 흰색 배경
    borderRadius: wp(2), // 둥근 모서리 2% (반응형)
    padding: wp(3), // 내부 여백 3% (반응형)
    marginBottom: hp(1.5), // 아래쪽 여백 1.5% (반응형)
    borderLeftWidth: 3, // 왼쪽 테두리 두께
    borderLeftColor: '#4a90e2', // 파란색 테두리
  },

  /**
   * 📚 저장된 단어 텍스트
   * 영어 단어 자체
   * 강조된 스타일로 표시
   */
  savedWordText: {
    color: '#4a90e2', // 파란색 텍스트 (강조)
    fontSize: wp(4), // 글자 크기 4% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
    marginBottom: hp(0.5), // 아래쪽 여백 0.5% (반응형)
  },

  /**
   * 📚 저장된 단어 뜻
   * 한국어 뜻
   * 영어 단어 아래에 표시
   */
  savedWordMeaning: {
    color: '#ffffff', // 흰색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
    marginBottom: hp(0.5), // 아래쪽 여백 0.5% (반응형)
  },

  /**
   * 📚 저장된 단어 영어 예문
   * 영어 예문
   * 작은 글자로 표시
   */
  savedWordExample: {
    color: '#e0e0e0', // 연한 회색 텍스트
    fontSize: wp(3), // 글자 크기 3% (반응형)
    fontStyle: 'italic', // 기울임꼴
    marginBottom: hp(0.3), // 아래쪽 여백 0.3% (반응형)
  },

  /**
   * 📚 저장된 단어 한국어 예문
   * 한국어 예문
   * 가장 작은 글자로 표시
   */
  savedWordExampleKr: {
    color: '#b8b8b8', // 연한 회색 텍스트
    fontSize: wp(2.8), // 글자 크기 2.8% (반응형)
    fontStyle: 'italic', // 기울임꼴
  },

  // ===================================================================
  // ⭐ 즐겨찾기 단어 목록 스타일
  // ===================================================================

  /**
   * 📝 즐겨찾기 단어 컨테이너
   * 즐겨찾기된 단어들을 가로로 배치하는 컨테이너
   * 본문 단어들과 동일한 레이아웃 구조
   */
  favoriteWordsContainer: {
    flex: 1,
    marginTop: hp(1),
    maxHeight: hp(20), // 최대 높이 제한
  },

  /**
   * 📄 즐겨찾기 단어 페이지
   * 현재 페이지의 단어들을 가로로 배치
   * 본문 단어들과 동일한 flexWrap 구조
   */
  favoriteWordsPage: {
    flexDirection: 'row', // 가로 배치
    flexWrap: 'wrap', // 줄바꿈 허용
    justifyContent: 'center', // 중앙 정렬
    gap: wp(2), // 단어 간 간격 2% (반응형)
  },

  // ===================================================================
  // 🔄 즐겨찾기 페이지네이션
  // ===================================================================

  /**
   * 🔄 즐겨찾기 페이지네이션 컨테이너
   * 페이지 이동 버튼들과 페이지 정보 표시
   * 하단에 배치하여 공간 효율성 확보
   */
  favoritePaginationContainer: {
    flexDirection: 'row', // 가로 배치
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 수직 중앙 정렬
    marginTop: hp(2), // 상단 여백 2% (반응형)로 증가
    gap: wp(4), // 요소 간 간격 4% (반응형)로 증가
  },

  /**
   * ⬅️➡️ 즐겨찾기 페이지네이션 버튼
   * 이전/다음 페이지 이동 버튼
   * 작고 깔끔한 디자인
   */
  favoritePaginationButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.8)', // 더 진한 황금색 배경
    borderRadius: wp(5), // 원형 버튼 5% (반응형)
    width: wp(8), // 너비 8% (반응형)
    height: wp(8), // 높이 8% (반응형)
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    borderWidth: 2, // 테두리 두께 증가
    borderColor: 'rgba(255, 215, 0, 0.9)', // 더 진한 황금색 테두리
  },

  /**
   * 🚫 비활성화된 즐겨찾기 페이지네이션 버튼
   * 첫 페이지/마지막 페이지에서 사용 불가
   * 더 투명한 배경으로 비활성 상태 표시
   */
  disabledFavoritePaginationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 매우 투명한 배경
    borderColor: 'rgba(255, 255, 255, 0.2)', // 투명한 테두리
  },

  /**
   * ↔️ 즐겨찾기 페이지네이션 버튼 텍스트
   * 화살표 아이콘 스타일링
   * 작고 명확한 표시
   */
  favoritePaginationButtonText: {
    color: '#ffffff', // 흰색으로 변경하여 가독성 향상
    fontSize: wp(4), // 글자 크기 4% (반응형)로 증가
    fontWeight: 'bold', // 굵은 글꼴
  },

  /**
   * 🚫 비활성화된 즐겨찾기 페이지네이션 텍스트
   * 비활성 상태의 화살표 텍스트
   * 흐린 색상으로 클릭 불가능함을 표시
   */
  disabledFavoritePaginationText: {
    color: 'rgba(255, 255, 255, 0.3)', // 매우 투명한 흰색
  },

  /**
   * 📄 즐겨찾기 페이지 정보 텍스트
   * 현재 페이지 / 전체 페이지 표시
   * 작고 간결한 정보 제공
   */
  favoritePageInfo: {
    color: '#000000', // 검은색으로 변경하여 가독성 향상
    fontSize: wp(3), // 글자 크기 3% (반응형)로 증가
    textAlign: 'center', // 중앙 정렬
    fontWeight: '600', // 더 굵게
  },

  // ===================================================================
  // 🧭 화면 중앙 화살표 네비게이션
  // ===================================================================

  /**
   * ⬅️ 좌측 화살표 버튼
   * 화면 중앙 좌측에 위치한 이전 페이지 버튼
   * 반투명 배경으로 자연스러운 통합
   */
  leftArrowButton: {
    position: 'absolute', // 절대 위치
    left: 0, // 카드 좌측 끝에 붙임
    top: '50%', // 카드 세로 중앙
    transform: [{ translateY: -wp(6) }], // 버튼 높이의 절반만큼 위로 이동
    backgroundColor: 'rgba(255, 215, 0, 0.8)', // 황금색 배경
    borderRadius: wp(6), // 원형 버튼 6% (반응형)
    width: wp(12), // 너비 12% (반응형)
    height: wp(12), // 높이 12% (반응형)
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * ➡️ 우측 화살표 버튼
   * 화면 중앙 우측에 위치한 다음 페이지 버튼
   * 반투명 배경으로 자연스러운 통합
   */
  rightArrowButton: {
    position: 'absolute', // 절대 위치
    right: 0, // 카드 우측 끝에 붙임
    top: '50%', // 카드 세로 중앙
    transform: [{ translateY: -wp(6) }], // 버튼 높이의 절반만큼 위로 이동
    backgroundColor: 'rgba(255, 215, 0, 0.8)', // 황금색 배경
    borderRadius: wp(6), // 원형 버튼 6% (반응형)
    width: wp(12), // 너비 12% (반응형)
    height: wp(12), // 높이 12% (반응형)
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    zIndex: 10, // 다른 요소 위에 표시
  },

  /**
   * ↔️ 화살표 버튼 텍스트
   * 좌우 화살표 아이콘 스타일링
   * 크고 명확한 화살표 표시
   */
  arrowButtonText: {
    color: '#ffffff', // 흰색 텍스트
    fontSize: wp(6), // 큰 화살표 크기 6% (반응형)
    fontWeight: 'bold', // 굵은 글꼴
  },

  /**
   * 🚫 비활성화된 화살표 버튼
   * 첫 페이지/마지막 페이지에서 사용할 수 없는 버튼
   * 더 투명한 배경으로 비활성 상태 표시
   */
  disabledArrowButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 더 투명한 배경
  },

  /**
   * 🚫 비활성화된 화살표 텍스트
   * 비활성 상태의 화살표 텍스트
   * 흐린 색상으로 클릭 불가능함을 시각적으로 표현
   */
  disabledArrowText: {
    color: 'rgba(255, 255, 255, 0.3)', // 매우 투명한 흰색 텍스트
  },

  // ===================================================================
  // 💡 사용자 도움말 및 팁
  // ===================================================================

  /**
   * 💡 팁 컨테이너
   * 사용자 도움말 메시지를 담는 컨테이너
   * 미묘한 배경색과 테두리로 구분
   */
  tipContainer: {
    marginTop: hp(1.5), // 상단 여백 1.5% (반응형)
    padding: wp(2.5), // 내부 여백 2.5% (반응형)
    backgroundColor: 'rgba(0,0,0,0.1)', // 반투명 검정 배경
    borderRadius: wp(2), // 둥근 모서리 2% (반응형)
  },

  /**
   * 💡 팁 텍스트
   * 사용자에게 기능 사용법을 안내하는 도움말 텍스트
   * 작은 글자 크기로 부담스럽지 않게 표시
   */
  tipText: {
    color: '#333', // 어두운 회색
    fontSize: wp(3), // 작은 글자 크기 3% (반응형)
    textAlign: 'center', // 중앙 정렬
  },

  // ===================================================================
  // 🧭 하단 네비게이션 섹션
  // ===================================================================

  /**
   * 🧭 네비게이션 섹션 컨테이너
   * 하단에 위치한 이전/다음 버튼과 즐겨찾기 버튼을 포함하는 컨테이너
   * 가로 방향으로 균등하게 배치
   */
  navigationSection: {
    flexDirection: 'row', // 가로 방향 배치
    justifyContent: 'space-between', // 양쪽 끝 정렬
    alignItems: 'center', // 수직 중앙 정렬
    marginTop: hp(12), // 상단 여백 4%로 증가 (반응형) - 버튼을 더 아래로 이동
    paddingHorizontal: wp(2), // 좌우 내부 여백 2% (반응형)
  },

  /**
   * ⬅️➡️ 네비게이션 버튼
   * 이전/다음 페이지 이동 버튼
   * 황금색 배경과 테두리로 시각적 강조
   */
  navButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1.2), // 상하 내부 여백 1.5% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    borderWidth: 1, // 테두리 두께
    borderColor: '#ffd700', // 황금색 테두리
    minWidth: wp(20), // 최소 너비 20% (반응형)
    alignItems: 'center', // 중앙 정렬
  },

  /**
   * 🚫 비활성화된 네비게이션 버튼
   * 첫 페이지/마지막 페이지에서 사용할 수 없는 버튼
   * 더 투명한 배경으로 비활성 상태 표시
   */
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 반투명 흰색 배경
    borderColor: 'rgba(255, 255, 255, 0.3)', // 투명한 테두리
  },

  /**
   * ⬅️➡️ 네비게이션 버튼 텍스트
   * 이전/다음 버튼 내부의 텍스트
   * 어두운 색상으로 명확한 가독성
   */
  navButtonText: {
    color: '#333', // 어두운 회색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
  },

  /**
   * ⭐ 즐겨찾기 페이지 버튼
   * 즐겨찾기된 단어들을 보기 위한 버튼
   * 중앙에 위치하여 균형잡힌 레이아웃 구성
   */
  favoritePageButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1.5), // 상하 내부 여백 1.5% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    borderWidth: 1, // 테두리 두께
    borderColor: '#ffd700', // 황금색 테두리
    minWidth: wp(25), // 최소 너비 25% (반응형)
    alignItems: 'center', // 중앙 정렬
  },

  /**
   * ⭐ 즐겨찾기 페이지 버튼 텍스트
   * 즐겨찾기 버튼 내부의 텍스트
   * 별표 이모지와 함께 직관적인 기능 표시
   */
  favoritePageButtonText: {
    color: '#333', // 어두운 회색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
  },

  /**
   * 🎯 퀴즈 시작 버튼
   * 마지막 페이지에서 표시되는 퀴즈 시작 버튼
   * 빨간색 배경으로 시각적 강조
   */
  quizStartButton: {
    backgroundColor: '#FFB3A7', // 파스텔 살구색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형)
    paddingVertical: hp(1.2), // 상하 내부 여백 1.2% (반응형)
    borderRadius: wp(5), // 둥근 모서리 5% (반응형)
    borderWidth: 1, // 테두리 두께
    borderColor: '#FFB3A7', // 빨간색 테두리
    minWidth: wp(20), // 최소 너비 20% (반응형)
    alignItems: 'center', // 중앙 정렬
    marginHorizontal: wp(2.5), // 좌우 여백 2.5% (반응형)
  },

  /**
   * 🎯 마지막 페이지 퀴즈 버튼
   * 마지막 페이지에서 '다음' 버튼 대신 표시되는 퀴즈 버튼
   * 기존 navButton과 동일한 크기와 모양, 배경만 퀴즈 스타일
   */
  lastPageQuizButton: {
    backgroundColor: '#FFB3A7', // 파스텔 살구색 배경
    paddingHorizontal: wp(4), // 좌우 내부 여백 4% (반응형) - navButton과 동일
    paddingVertical: hp(1.2), // 상하 내부 여백 1.2% (반응형) - navButton과 동일
    borderRadius: wp(5), // 둥근 모서리 5% (반응형) - navButton과 동일
    borderWidth: 1, // 테두리 두께 - navButton과 동일
    borderColor: '#FFB3A7', // 파스텔 살구색 테두리
    minWidth: wp(20), // 최소 너비 20% (반응형) - navButton과 동일
    alignItems: 'center', // 중앙 정렬 - navButton과 동일
  },

  /**
   * 📝 상단 컨트롤 버튼 텍스트
   * 읽어주기, TTS 설정 등 상단 컨트롤 버튼의 텍스트 스타일
   * 어두운 색상으로 명확한 가독성
   */
  quizButtonText: {
    color: '#333', // 어두운 회색 텍스트
    fontSize: wp(3.5), // 글자 크기 3.5% (반응형)
    fontWeight: '600', // 중간 굵기
  },

  /**
   * ⭐ 즐겨찾기 단어 아이템
   * 개별 즐겨찾기 단어를 표시하는 아이템
   * 영어 단어와 한국어 뜻을 세로로 배치
   */
  favoriteWordItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // 연한 황금색 배경
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginBottom: hp(0.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)', // 황금색 테두리
  },

  /**
   * ⭐ 즐겨찾기 단어 영어 텍스트
   * 즐겨찾기된 단어의 영어 표기
   * 어두운 색상으로 가독성 향상
   */
  favoriteWordEnglish: {
    color: '#2c3e50', // 어두운 네이비 블루 텍스트
    fontSize: wp(3), // 글자 크기 3% (반응형)
    fontWeight: '600',
    marginBottom: hp(0.3),
  },

  /**
   * ⭐ 즐겨찾기 단어 한국어 텍스트
   * 즐겨찾기된 단어의 한국어 뜻
   * 어두운 회색으로 표시하여 가독성 향상
   */
  favoriteWordKorean: {
    color: '#34495e', // 어두운 회색 텍스트
    fontSize: wp(2.5), // 글자 크기 2.5% (반응형)
    fontWeight: '400',
  },

  // ===================================================================
  // 🔄 동기화 화면 스타일
  // ===================================================================

  /**
   * 🔄 동기화 화면 컨테이너
   * 전체 화면을 덮는 동기화 화면
   * 사용자 터치를 막고 동기화 상태를 표시
   */
  syncContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  /**
   * 🔄 동기화 아이콘
   * 랜덤 캐릭터 이미지
   * 화면 크기에 맞춤 조절
   */
  syncIcon: {
    width: wp('30%'), // 화면 너비의 20%로 설정
    height: wp('30%'), // 화면 너비의 20%로 설정 (정사각형 유지)
    marginBottom: hp('1%'),
    resizeMode: 'contain', // 이미지 비율 유지하면서 컨테이너에 맞춤
    alignSelf: 'center', // 중앙 정렬
  },

  /**
   * 🔄 동기화 제목
   * "동기화 중..." 메인 텍스트
   * 흰색으로 강조하여 가독성 향상
   */
  syncTitle: {
    color: '#ffffff',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },

  /**
   * 🔄 동기화 설명
   * 동기화 상태에 대한 상세 설명
   * 약간 투명하게 처리하여 부드러운 느낌
   */
  syncDescription: {
    color: '#ffffff',
    fontSize: wp('4%'),
    textAlign: 'center',
    lineHeight: wp('6%'),
    opacity: 0.8,
  },

  // ===================================================================
  // 🔘 토글 버튼 스타일
  // ===================================================================

  /**
   * 🔘 토글 버튼
   * 즐겨찾기 패널을 표시/숨김하는 동그란 버튼
   * 위아래로 움직이는 애니메이션 적용
   */
  toggleButton: {
    position: 'absolute',
    right: wp(2),
    top: hp(2), // 패널 상단에서 2% 여백
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // 황금색 배경
    borderWidth: 2,
    borderColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },

  /**
   * 🔘 토글 버튼 - 패널 숨김 상태
   * 화면 우측 중앙보다 위쪽에 위치
   */
  toggleButtonHidden: {
    right: wp(2),
    top: '30%',
    transform: [{ translateY: -wp(10) }], // 중앙보다 10% 위쪽
  },

  /**
   * 🔘 토글 버튼 텍스트
   * 토글 버튼 내부의 아이콘 텍스트
   */
  toggleButtonText: {
    fontSize: wp(6),
    color: '#333',
    fontWeight: 'bold',
  },
});

export default englishLearningStyles;

/**
 * ===================================================================
 * 📝 스타일 파일 사용 가이드
 * ===================================================================
 *
 * 이 스타일 파일을 사용할 때 주의사항:
 *
 * 1. 🎨 색상 일관성 유지
 *    - 주요 색상: #ffd700 (황금색)
 *    - 배경 색상: #1a1a2e, #1a1a4a
 *    - 텍스트 색상: #ffffff, #cccccc, #333
 *
 * 2. 📏 간격 규칙
 *    - 기본 패딩: 10px, 15px, 20px
 *    - 마진: 10px, 15px, 20px
 *    - 큰 간격: 25px, 30px
 *
 * 3. 🔤 글자 크기 규칙
 *    - 제목: 24px, 18px
 *    - 본문: 16px, 14px
 *    - 보조 텍스트: 12px, 10px
 *
 * 4. 🌟 투명도 규칙
 *    - 배경: 0.1, 0.3, 0.7, 0.9
 *    - 텍스트: 0.5, 0.8
 *
 * 5. 📱 반응형 고려사항
 *    - flex 속성 활용
 *    - 최소/최대 크기 지정
 *    - 비율 기반 레이아웃
 *
 * 업데이트 시 이 가이드를 참고하여 일관성을 유지해주세요.
 */

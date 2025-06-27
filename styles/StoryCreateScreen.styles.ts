/**
 * StoryCreateScreen 컴포넌트의 스타일 정의
 * 동화 생성 화면에서 사용되는 스타일들을 정의합니다.
 * react-native-responsive-screen을 사용하여 다양한 화면 크기에 대응합니다.
 */

import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 아이콘 크기를 스타일 파일에서 관리하기 위한 상수
export const ICON_SIZES = {
  keywordClose: 16,
  createButtonSparkles: 22,
  backButton: 28,
  voiceButton: 24,
};

// 그라데이션 색상을 관리하기 위한 상수
export const GRADIENT_COLORS = {
  createButton: ['#8A2BE2', '#4B0082'] as const,
};

// 앱 전체에서 사용될 수 있는 공통 색상 상수
export const COLORS = {
  placeholder: '#999',
  headerIcon: '#fff',
  voiceButton: '#ccc',
  voiceButtonActive: '#FF6B6B',
};

export const useStoryCreateScreenStyles = () => {
  const insets = useSafeAreaInsets(); // 기기의 안전 영역(노치 등) 값을 가져옴

  return StyleSheet.create({
    // --- 배경 ---
    // 배경 이미지 스타일 - 화면 전체를 채우도록 설정
    backgroundImage: {
      flex: 1, // 화면 전체를 채우도록 설정
      width: '100%',
      height: '100%',
    },
    // 배경 이미지 위에 어두운 오버레이 효과를 주는 스타일
    overlay: {
      ...StyleSheet.absoluteFillObject, // 부모 뷰를 완전히 덮는 스타일
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // 배경 이미지 위에 어두운 오버레이 효과
    },

    // --- 뒤로가기 버튼 ---
    // 화면 좌측 상단에 위치하는 뒤로가기 버튼 스타일
    backButton: {
      position: 'absolute',
      top: insets.top + hp('3%'), // 안전 영역 아래로 배치
      left: wp('5%'),
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp('2%'),
      zIndex: 10, // 다른 UI 요소들보다 위에 표시되도록 함
    },

    // 뒤로가기 버튼 텍스트
    backButtonText: {
      color: 'white',
      fontSize: wp('4.5%'),
      marginLeft: wp('1.5%'),
      fontWeight: '600',
    },

    // --- 컨테이너 ---
    // 메인 콘텐츠를 감싸는 컨테이너 스타일
    container: {
      flexGrow: 1, // 이 속성을 제거하여 스크롤 뷰가 콘텐츠 크기에 맞게 자연스럽게 동작하도록 변경합니다.
      alignItems: 'center', // 가로 중앙 정렬은 유지
      padding: wp('5%'), // 화면 너비의 5%를 내부 여백으로 사용
      paddingTop: hp('5%'), // 화면 상단과 카드의 간격을 충분히 확보
    },

    // --- 메인 카드 ---
    // 동화 생성 폼을 담는 메인 카드 스타일
    card: {
      width: '100%',
      maxWidth: wp('138%'),
      minHeight: hp('38%'),
      backgroundColor: 'rgba(20, 15, 40, 0.8)',
      borderRadius: wp('5%'),
      padding: wp('7%'),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },

    // 카드 내부 콘텐츠를 감싸는 컨테이너
    contentContainer: {
      // 이 컨테이너는 제목, 부제, 입력 필드를 그룹화합니다.
      width: '100%',
      alignItems: 'center',
      marginBottom: hp('-2%'), // ★★★ 이 값으로 입력창과 키워드 목록 사이 간격을 조절하세요.
    },

    // --- 제목 및 부제 ---
    // 동화 생성 화면의 메인 제목 스타일
    title: {
      fontSize: wp('6%'), // 화면 너비의 6%로 감소 (기존 7%)
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: hp('0.8%'), // 화면 높이의 0.8%로 감소 (기존 1.2%)
    },
    // 제목 아래의 설명 텍스트 스타일
    subtitle: {
      fontSize: wp('3.5%'), // 화면 너비의 3.5%로 감소 (기존 4%)
      color: '#eee',
      textAlign: 'center',
      marginBottom: hp('4%'), // 하단 여백 4%
    },

    // --- 키워드 입력 ---
    // 키워드 입력 필드와 추가 버튼을 감싸는 컨테이너
    inputContainer: {
      flexDirection: 'row', // 자식 요소들을 가로로 배치
      width: '100%',
      marginBottom: hp('2%'), // 하단 여백 2%
    },
    // 키워드 입력 필드 스타일
    textInput: {
      flex: 1, // 남은 공간을 모두 차지
      height: hp('6%'), // 화면 높이의 6%
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명한 흰색 배경
      borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용 (기존 10px)
      borderTopRightRadius: 0, // 오른쪽 상단 모서리는 각지게
      borderBottomRightRadius: 0, // 오른쪽 하단 모서리는 각지게
      paddingHorizontal: wp('4%'), // 좌우 패딩 4%
      color: '#fff',
      fontSize: wp('4%'), // 폰트 크기 4%
    },

    // --- 음성 입력 버튼 ---
    // 음성 입력 버튼 스타일 (입력창과 동일한 배경색으로 통합)
    voiceButton: {
      width: wp('12.5%'), // 화면 너비의 12.5%를 너비로 사용
      height: hp('6%'), // 입력창과 동일한 높이
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // 입력창과 동일한 배경색
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 0, // 모서리를 각지게
    },

    // --- 키워드 추가 버튼 ---
    // 키워드 추가 버튼 스타일
    addButton: {
      width: wp('12.5%'), // 화면 너비의 12.5%를 너비로 사용 (기존 50px)
      height: hp('6%'), // 입력창과 동일한 높이
      backgroundColor: '#FFD700', // 금색 배경
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용 (기존 10px)
      borderTopLeftRadius: 0, // 왼쪽 상단 모서리는 각지게
      borderBottomLeftRadius: 0, // 왼쪽 하단 모서리는 각지게
      marginLeft: wp('2%'), // 좌측 여백 2%
    },
    // 키워드 추가 버튼 내부 텍스트 스타일
    addButtonText: {
      color: '#4B0082',
      fontSize: wp('6%'), // 폰트 크기 6%
      fontWeight: 'bold',
      lineHeight: hp('3.5%'), // 줄 높이 설정
    },

    // --- 키워드 목록 ---
    // 입력된 키워드들을 표시하는 컨테이너
    keywordContainer: {
      // flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'flex-start',
      width: '100%',
      minHeight: hp('5%'),
      marginBottom: hp('1.1%'), // 이 값이 이제 키워드 목록과 버튼 사이의 고정 간격이 됩니다.
    },

    // 남는 공간을 모두 차지하여 버튼을 아래로 밀어내는 스페이서
    spacer: {
      flex: 1,
    },

    // 개별 키워드 칩 스타일
    keywordChip: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: hp('1.5%'), // 화면 높이의 1.5%로 감소 (기존 1.8%)
      paddingVertical: hp('0.4%'), // 화면 높이의 0.4%로 감소 (기존 0.6%)
      paddingHorizontal: wp('2%'), // 화면 너비의 2%로 감소 (기존 2.5%)
      margin: wp('1%'), // 주변 여백 1%
      alignItems: 'center',
    },
    // 키워드 텍스트 스타일
    keywordText: {
      color: '#fff',
      marginRight: wp('1%'), // 우측 여백 1%
    },

    // --- 키워드 삭제 아이콘 ---
    // 키워드 옆의 삭제 아이콘 스타일
    keywordCloseIcon: {
      opacity: 0.8, // 약간 투명하게
      color: '#fff', // 아이콘 색상을 스타일시트에서 관리
    },

    // --- 동화 생성 버튼 ---
    // 동화 생성 메인 버튼 스타일
    createButton: {
      width: '100%',
      paddingVertical: hp('2%'),
      paddingHorizontal: wp('5%'),
      borderRadius: wp('6.2%'),
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },

    // --- 동화 생성 버튼 아이콘 스페이서 ---
    // 버튼 내부 아이콘과 텍스트 사이의 간격을 위한 스페이서
    buttonIconSpacer: {
      width: wp('5.5%'), // 아이콘 너비와 동일하게 설정 (22px -> wp('5.5%'))
    },

    // --- 비활성화된 버튼 스타일 ---
    // 버튼이 비활성화되었을 때 적용되는 스타일
    disabledButton: {
      opacity: 0.6, // 약간 투명하게
    },

    // 동화 생성 버튼 내부 텍스트 스타일
    createButtonText: {
      color: '#fff',
      fontSize: wp('4.5%'), // 폰트 크기 4.5%
      fontWeight: 'bold',
      textAlign: 'center',
      marginHorizontal: wp('3%'), // 좌우 여백 3%
    },
  });
};

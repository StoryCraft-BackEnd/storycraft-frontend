import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * StoryListScreen 스타일 정의
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 * 다크모드/라이트모드 테마 지원
 * 동화 목록을 그리드 형태로 표시하는 화면 전용 스타일
 */
export const createStoryListScreenStyles = () => {
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');

  // 테두리 색상을 배경색보다 약간 밝게 설정
  // 다크모드에서는 반투명 흰색, 라이트모드에서는 반투명 검정색 사용
  const borderColorAdjusted =
    backgroundColor === '#000000' // 검정인지 확인
      ? 'rgba(255, 255, 255, 0.1)' // 다크모드: 반투명 흰색
      : 'rgba(0, 0, 0, 0.1)'; // 라이트모드: 반투명 검정색

  return StyleSheet.create({
    // 메인 컨테이너 - 전체 화면을 차지하는 루트 컨테이너
    container: {
      flex: 1, // 전체 화면을 차지
      backgroundColor: backgroundColor, // 테마에 따른 배경색
      paddingTop: hp('2%'), // 화면 높이의 2%를 상단 여백으로 사용
    },

    // 헤더 영역 - 뒤로가기 버튼과 제목을 포함하는 상단 영역
    storyListHeader: {
      flexDirection: 'row', // 가로 방향으로 요소들을 배치
      alignItems: 'center', // 세로 중앙 정렬
      justifyContent: 'space-between', // 요소들을 양 끝으로 분산 배치
      paddingHorizontal: wp('5%'), // 화면 너비의 5%를 좌우 패딩으로 사용
      paddingVertical: hp('2%'), // 화면 높이의 2%를 상하 패딩으로 사용
      borderBottomWidth: 1, // 하단 테두리 두께
      borderBottomColor: borderColorAdjusted, // 테마에 따른 테두리 색상
    },

    // 뒤로가기 버튼 - 이전 화면으로 돌아가는 버튼
    backButton: {
      paddingVertical: hp('1%'), // 화면 높이의 1%를 상하 패딩으로 사용
      paddingHorizontal: wp('3%'), // 화면 너비의 3%를 좌우 패딩으로 사용
      borderRadius: wp('2%'), // 화면 너비의 2%를 모서리 둥글기로 사용
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // 반투명한 배경색
    },

    // 뒤로가기 버튼 텍스트 - 버튼 내부의 텍스트 스타일
    backButtonText: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      color: primaryColor, // 테마의 primary 색상 사용
      fontWeight: '600', // 글씨 굵기 설정
    },

    // 동화 목록 제목 - 헤더 중앙에 표시되는 제목
    storyListTitle: {
      fontSize: wp('6%'), // 화면 너비의 6%를 폰트 크기로 사용
      fontWeight: 'bold', // 굵은 글씨
      color: textColor, // 테마에 따른 텍스트 색상
      flex: 1, // 남은 공간을 모두 차지
      textAlign: 'center', // 가운데 정렬
    },

    // 동화 목록 그리드 - 동화들을 그리드 형태로 배치하는 컨테이너
    storyListGrid: {
      paddingHorizontal: wp('3%'), // 화면 너비의 3%를 좌우 패딩으로 사용
      paddingVertical: hp('2%'), // 화면 높이의 2%를 상하 패딩으로 사용
      flexDirection: 'row', // 가로 방향으로 요소들을 배치
      flexWrap: 'wrap', // 요소들이 넘칠 경우 다음 줄로 넘김
      justifyContent: 'space-between', // 요소들을 균등하게 분산 배치
    },

    // 동화 그리드 아이템 - 개별 동화를 표시하는 카드 형태의 컨테이너
    storyGridItem: {
      width: wp('44%'), // 화면 너비의 44%를 아이템 너비로 사용 (2열 그리드)
      marginBottom: hp('3%'), // 화면 높이의 3%를 하단 여백으로 사용
      backgroundColor: backgroundColor, // 테마에 따른 배경색
      borderRadius: wp('4%'), // 화면 너비의 4%를 모서리 둥글기로 사용
      padding: wp('2%'), // 화면 너비의 2%를 패딩으로 사용
      elevation: 3, // Android 그림자 효과
      shadowColor: '#000', // 그림자 색상
      shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
      shadowOpacity: 0.25, // 그림자 투명도
      shadowRadius: 3.84, // 그림자 블러 반경
      borderWidth: 1, // 테두리 두께
      borderColor: borderColorAdjusted, // 테마에 따른 테두리 색상
    },

    // 동화 그리드 이미지 - 동화 커버 이미지
    storyGridImage: {
      width: '100%', // 부모 컨테이너의 전체 너비
      height: hp('20%'), // 화면 높이의 20%를 이미지 높이로 사용
      borderRadius: wp('2%'), // 화면 너비의 2%를 모서리 둥글기로 사용
      marginBottom: hp('1%'), // 화면 높이의 1%를 하단 여백으로 사용
    },

    // 동화 그리드 제목 - 동화 제목 텍스트
    storyGridTitle: {
      fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
      fontWeight: '600', // 글씨 굵기 설정
      color: textColor, // 테마에 따른 텍스트 색상
      textAlign: 'center', // 가운데 정렬
      marginTop: hp('0.5%'), // 화면 높이의 0.5%를 상단 여백으로 사용
    },
  });
};

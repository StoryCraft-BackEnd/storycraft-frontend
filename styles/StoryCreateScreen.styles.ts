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

export const StoryCreateScreenStyles = StyleSheet.create({
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
    position: 'absolute', // 화면의 특정 위치에 고정
    // top 속성은 컴포넌트에서 동적으로 설정합니다.
    left: wp('5%'), // 왼쪽으로부터 화면 너비의 5%만큼 간격 (기존 20px)
    zIndex: 10, // 다른 UI 요소들보다 위에 표시되도록 함
  },

  // --- 컨테이너 ---
  // 메인 콘텐츠를 감싸는 컨테이너 스타일
  container: {
    flexGrow: 1, // 사용 가능한 공간을 모두 차지
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
    padding: wp('5%'), // 화면 너비의 5%를 내부 여백으로 사용 (기존 20px)
  },

  // --- 메인 카드 ---
  // 동화 생성 폼을 담는 메인 카드 스타일
  card: {
    width: '100%',
    maxWidth: wp('130%'), // 화면 너비의 90%로 증가 (기존 80%)
    backgroundColor: 'rgba(20, 15, 40, 0.8)', // 반투명한 어두운 배경색
    borderRadius: wp('5%'), // 화면 너비의 5%를 모서리 둥글기로 사용 (기존 20px)
    padding: wp('10%'), // 화면 너비의 5%로 감소 (기존 7.5%)
    alignItems: 'center', // 자식 요소들을 가로 중앙 정렬
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // 은은한 테두리 효과
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
    marginBottom: hp('2%'), // 화면 높이의 2%로 감소 (기존 3.7%)
  },

  // --- 키워드 입력 ---
  // 키워드 입력 필드와 추가 버튼을 감싸는 컨테이너
  inputContainer: {
    flexDirection: 'row', // 자식 요소들을 가로로 배치
    width: '100%',
    marginBottom: hp('1.5%'), // 화면 높이의 1.5%로 감소 (기존 2.5%)
  },
  // 키워드 입력 필드 스타일
  textInput: {
    flex: 1, // 남은 공간을 모두 차지
    height: hp('5%'), // 화면 높이의 5%로 감소 (기존 6%)
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 반투명한 흰색 배경
    borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용 (기존 10px)
    borderTopRightRadius: 0, // 오른쪽 상단 모서리는 각지게
    borderBottomRightRadius: 0, // 오른쪽 하단 모서리는 각지게
    paddingHorizontal: wp('3.7%'), // 화면 너비의 3.7%를 좌우 내부 여백으로 사용 (기존 15px)
    color: '#fff',
    fontSize: wp('3.5%'), // 화면 너비의 3.5%로 감소 (기존 4%)
  },

  // --- 키워드 추가 버튼 ---
  // 키워드 추가 버튼 스타일
  addButton: {
    width: wp('12.5%'), // 화면 너비의 12.5%를 너비로 사용 (기존 50px)
    height: hp('5%'), // 화면 높이의 5%로 감소 (기존 6%)
    backgroundColor: '#FFD700', // 금색 배경
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.5%'), // 화면 너비의 2.5%를 모서리 둥글기로 사용 (기존 10px)
    borderTopLeftRadius: 0, // 왼쪽 상단 모서리는 각지게
    borderBottomLeftRadius: 0, // 왼쪽 하단 모서리는 각지게
  },
  // 키워드 추가 버튼 내부 텍스트 스타일
  addButtonText: {
    fontSize: wp('5%'), // 화면 너비의 5%로 감소 (기존 6%)
    color: '#333',
    fontWeight: 'bold',
  },

  // --- 키워드 목록 ---
  // 입력된 키워드들을 표시하는 컨테이너
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 여러 줄로 표시
    justifyContent: 'center',
    width: '100%',
    minHeight: hp('2.5%'), // 화면 높이의 2.5%로 감소 (기존 3.7%)
    marginBottom: hp('2%'), // 화면 높이의 2%로 감소 (기존 3.7%)
  },
  // 개별 키워드 칩 스타일
  keywordChip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp('1.5%'), // 화면 높이의 1.5%로 감소 (기존 1.8%)
    paddingVertical: hp('0.4%'), // 화면 높이의 0.4%로 감소 (기존 0.6%)
    paddingHorizontal: wp('2%'), // 화면 너비의 2%로 감소 (기존 2.5%)
    margin: wp('1%'), // 화면 너비의 1%로 감소 (기존 1.2%)
    alignItems: 'center',
  },
  // 키워드 텍스트 스타일
  keywordText: {
    color: '#fff',
    fontSize: wp('3%'), // 화면 너비의 3%로 감소 (기존 3.5%)
  },

  // --- 키워드 삭제 아이콘 ---
  // 키워드 옆의 삭제 아이콘 스타일
  keywordCloseIcon: {
    marginLeft: wp('1%'), // 화면 너비의 1%로 감소 (기존 1.2%)
  },

  // --- 동화 생성 버튼 ---
  // 동화 생성 메인 버튼 스타일
  createButton: {
    width: '100%',
    paddingVertical: hp('1.2%'), // 화면 높이의 1.2%로 감소 (기존 1.8%)
    paddingHorizontal: wp('5%'), // 화면 너비의 5%를 좌우 패딩으로 사용 (기존 20px)
    borderRadius: wp('6.2%'), // 화면 너비의 6.2%를 모서리 둥글기로 사용 (기존 25px)
    alignItems: 'center',
    justifyContent: 'space-between', // 자식 요소들을 양쪽 끝으로 정렬
    flexDirection: 'row',
  },

  // --- 동화 생성 버튼 아이콘 스페이서 ---
  // 버튼 내부 아이콘과 텍스트 사이의 간격을 위한 스페이서
  buttonIconSpacer: {
    width: wp('5.5%'), // 화면 너비의 5.5%를 너비로 사용 (기존 22px) - 아이콘 너비와 동일하게 설정하여 텍스트 중앙 정렬
  },

  // --- 비활성화된 버튼 스타일 ---
  // 버튼이 비활성화되었을 때 적용되는 스타일
  disabledButton: {
    opacity: 0.6, // 투명도 조절
  },

  // 동화 생성 버튼 내부 텍스트 스타일
  createButtonText: {
    color: '#fff',
    fontSize: wp('4%'), // 화면 너비의 4%로 감소 (기존 4.5%)
    fontWeight: 'bold',
  },
});

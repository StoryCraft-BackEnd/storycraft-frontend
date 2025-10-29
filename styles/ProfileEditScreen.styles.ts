import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * ProfileEditScreen 스타일 정의
 * react-native-responsive-screen을 사용하여 모든 기기에서 반응형으로 작동
 * 모든 픽셀 값은 화면 크기에 비례하여 자동 조정됨
 */
export const ProfileEditScreenStyles = StyleSheet.create({
  // 메인 컨테이너 - 전체 화면을 차지하며 흰색 배경
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('6%'), // 화면 너비의 6%를 패딩으로 사용
  },

  // 중앙 정렬 컨테이너 - 로딩이나 빈 상태 표시용
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // 뒤로가기 버튼 - 절대 위치로 화면 좌상단에 고정
  backButton: {
    position: 'absolute',
    top: hp('3%'), // 화면 높이의 3%를 상단 여백으로 사용
    left: wp('4%'), // 화면 너비의 4%를 좌측 여백으로 사용
    zIndex: 10,
    padding: wp('2%'), // 화면 너비의 2%를 패딩으로 사용
  },

  // 뒤로가기 버튼 텍스트 - 큰 폰트 크기로 터치하기 쉽게
  backButtonText: {
    fontSize: wp('7%'), // 화면 너비의 7%를 폰트 크기로 사용
    color: '#222',
  },

  // 가로 모드 래퍼 - 가로 모드에서 좌우 분할 레이아웃을 위한 컨테이너
  landscapeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  // 프로필 왼쪽 영역 - 프로필 이미지와 기본 정보 표시
  profileLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 프로필 이미지 - 원형으로 표시되며 반응형 크기
  profileImage: {
    width: wp('30%'), // 화면 너비의 30%를 이미지 크기로 사용
    height: wp('30%'), // 정사각형 유지를 위해 너비와 동일
    borderRadius: wp('15%'), // 원형을 위해 너비의 절반을 반지름으로 사용
    marginBottom: hp('2%'), // 화면 높이의 2%를 하단 여백으로 사용
  },

  // 프로필 이름 - 굵은 폰트로 강조
  profileName: {
    fontSize: wp('5.5%'), // 화면 너비의 5.5%를 폰트 크기로 사용
    fontWeight: 'bold',
    marginBottom: hp('0.5%'), // 화면 높이의 0.5%를 하단 여백으로 사용
  },

  // 프로필 이메일 - 회색으로 표시하여 부가 정보임을 나타냄
  profileEmail: {
    color: '#6b7280',
    marginBottom: hp('3%'), // 화면 높이의 3%를 하단 여백으로 사용
  },

  // 프로필 오른쪽 영역 - 상세 정보 편집 폼을 위한 공간
  profileRight: {
    flex: 2, // 왼쪽 영역보다 2배 넓게 설정
    padding: wp('8%'), // 화면 너비의 8%를 패딩으로 사용
  },

  // 섹션 제목 - 각 정보 그룹의 제목
  sectionTitle: {
    fontSize: wp('4.5%'), // 화면 너비의 4.5%를 폰트 크기로 사용
    fontWeight: 'bold',
    marginBottom: hp('2%'), // 화면 높이의 2%를 하단 여백으로 사용
  },

  // 정보 행 - 라벨과 값을 가로로 배치
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'), // 화면 높이의 2%를 하단 여백으로 사용
  },

  // 라벨 - 정보 항목의 이름을 표시
  label: {
    fontWeight: 'bold',
    color: '#333',
    minWidth: wp('25%'), // 화면 너비의 25%를 최소 너비로 사용
  },

  // 값 - 실제 정보 내용을 표시
  value: {
    fontSize: wp('4%'), // 화면 너비의 4%를 폰트 크기로 사용
    color: '#222',
    marginBottom: hp('1%'), // 화면 높이의 1%를 하단 여백으로 사용
  },
});

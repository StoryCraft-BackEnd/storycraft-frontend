import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const BadgesScreenStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // 뒤로가기 버튼
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    top: 34,
    left: 26,
    zIndex: 10,
  },

  // 헤더 섹션
  headerContainer: {
    alignItems: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('2%'),
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: wp('2%'),
  },

  // 탭 네비게이션 - 동화관리 탭과 같은 색상
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    marginTop: hp('4%'),
    marginBottom: hp('2%'),
    gap: wp('2%'),
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    backgroundColor: '#23284a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTabButton: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  tabText: {
    fontSize: wp('2.5%'),
    color: '#b3b3ff',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // 배지 그리드 - 가로 스크롤로 변경, 시작 여백 추가
  badgeGridContainer: {
    paddingHorizontal: wp('4%'),
    paddingLeft: wp('8%'),
    paddingBottom: hp('5%'),
    alignItems: 'center',
  },

  // 배지 카드 - 가로 스크롤에 맞게 조정, 중앙 정렬
  badgeCard: {
    width: wp('25%'),
    backgroundColor: '#181f3a',
    borderRadius: wp('3%'),
    padding: wp('2.5%'),
    marginRight: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    minHeight: hp('25%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  badgeIcon: {
    width: wp('8%'),
    height: wp('8%'),
  },
  plusIcon: {
    fontSize: wp('5%'),
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 'bold',
  },
  badgeName: {
    fontSize: wp('2.2%'),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp('1%'),
    lineHeight: wp('2.8%'),
  },
  badgeDescription: {
    fontSize: wp('1.8%'),
    color: '#e0e0ff',
    textAlign: 'center',
    lineHeight: wp('2.2%'),
  },
  earnedBadge: {
    position: 'absolute',
    top: wp('1.5%'),
    right: wp('1.5%'),
    backgroundColor: '#4CAF50',
    borderRadius: wp('1.2%'),
    paddingHorizontal: wp('1.2%'),
    paddingVertical: hp('0.2%'),
  },
  earnedText: {
    color: 'white',
    fontSize: wp('1.5%'),
    fontWeight: 'bold',
  },
});

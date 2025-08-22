import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const DailyMissionScreenStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },

  // 헤더 섹션
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('4%'),
    paddingTop: hp('2%'),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },

  // 메인 콘텐츠 영역
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
    paddingLeft: wp('6%'), // 뒤로가기 버튼과 겹치지 않도록 여백 추가
  },

  // 원형 진행률 컴포넌트
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgress: {
    position: 'relative',
  },
  circularProgressTrack: {
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  circularProgressFill: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  circularProgressText: {
    position: 'absolute',
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
    color: 'white',
  },

  // 연속 학습 섹션
  streakSection: {
    width: wp('25%'),
    alignItems: 'center',
    marginRight: wp('3%'),
    padding: wp('3%'),
    justifyContent: 'center',
    minHeight: hp('30%'),
  },
  streakCircle: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  fireIcon: {
    fontSize: wp('6%'),
    marginBottom: hp('1%'),
  },
  streakNumber: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#FFC107',
  },
  streakLabel: {
    fontSize: wp('2%'),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  streakTitle: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#FFC107',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  streakSubtitle: {
    fontSize: wp('2.5%'),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },

  // 포인트 섹션
  pointsSection: {
    width: wp('25%'),
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginRight: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: hp('30%'),
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  pointsIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('2%'),
  },
  pointsTitle: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: 'white',
  },
  pointsValue: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: hp('2%'),
  },
  rewardHistoryButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#FFD700',
    marginTop: hp('1%'),
  },
  rewardHistoryButtonText: {
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },

  // 레벨 카드
  levelCard: {
    width: wp('25%'),
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginRight: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('30%'),
  },
  levelTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: hp('1%'),
  },
  levelSubtitle: {
    fontSize: wp('2.5%'),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: hp('2%'),
  },
  levelProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  levelProgressBar: {
    width: '100%',
    height: hp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp('0.75%'),
    overflow: 'hidden',
    marginBottom: hp('1%'),
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: hp('0.75%'),
  },
  levelProgressText: {
    fontSize: wp('2%'),
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // 달성도 섹션
  achievementSection: {
    width: wp('30%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    minHeight: hp('30%'),
  },
  achievementTitle: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  achievementCount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  achievementBars: {
    marginBottom: hp('2%'),
  },
  achievementBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  achievementBarLabel: {
    width: wp('6%'),
    fontSize: wp('2%'),
    color: 'white',
    marginRight: wp('2%'),
  },
  achievementBarContainer: {
    flex: 1,
    height: hp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp('0.75%'),
    overflow: 'hidden',
    marginRight: wp('2%'),
  },
  achievementBarFill: {
    height: '100%',
    borderRadius: hp('0.75%'),
  },
  achievementBarText: {
    fontSize: wp('2%'),
    color: 'rgba(255, 255, 255, 0.7)',
    width: wp('8%'),
    textAlign: 'right',
  },
  totalProgressContainer: {
    alignItems: 'center',
  },
  totalProgressText: {
    fontSize: wp('2.5%'),
    color: 'white',
    marginBottom: hp('1%'),
  },
  totalProgressBar: {
    width: '100%',
    height: hp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp('1%'),
    overflow: 'hidden',
  },
  totalProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: hp('1%'),
  },
  claimRewardButton: {
    backgroundColor: '#FFD700',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA000',
  },
  claimRewardButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('2.5%'),
  },
  claimedRewardContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#45A049',
  },
  claimedRewardText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('2.5%'),
  },

  // 미션 아이템
  missionItem: {
    width: wp('25%'),
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginRight: wp('3%'),
    position: 'relative',
    minHeight: hp('30%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedMissionItem: {
    opacity: 0.6,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    justifyContent: 'center',
  },
  missionIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('2%'),
  },
  missionTitle: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  missionProgressContainer: {
    marginBottom: hp('2%'),
    width: '100%',
    alignItems: 'center',
  },
  missionProgressText: {
    fontSize: wp('2.5%'),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  missionProgressBar: {
    width: '100%',
    height: hp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp('0.75%'),
    overflow: 'hidden',
  },
  missionProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: hp('0.75%'),
  },
  missionReward: {
    alignItems: 'center',
  },
  missionRewardText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: '#FFD700',
  },
  completedOverlay: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
    backgroundColor: '#4CAF50',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
  },
  completedText: {
    color: 'white',
    fontSize: wp('1.8%'),
    fontWeight: 'bold',
  },

  // 배지 섹션
  badgeSection: {
    width: wp('25%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('3%'),
    padding: wp('2%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    minHeight: hp('25%'),
  },
  badgeTitle: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  badgeVerticalGrid: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  badgeVerticalSlot: {
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  badgeItem: {
    alignItems: 'center',
  },
  badgeIconContainer: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('0.5%'),
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  badgeIcon: {
    width: wp('6%'),
    height: wp('6%'),
  },
  badgeName: {
    fontSize: wp('1.8%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  badgeCount: {
    fontSize: wp('2.5%'),
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  viewAllBadgesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewAllBadgesButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('2.5%'),
  },

  // 개발용 도구 섹션
  devSection: {
    width: wp('20%'),
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: wp('3%'),
    padding: wp('3%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    minHeight: hp('30%'),
  },
  devTitle: {
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  devButton: {
    backgroundColor: '#FF6B6B',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  devButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('2%'),
  },
});

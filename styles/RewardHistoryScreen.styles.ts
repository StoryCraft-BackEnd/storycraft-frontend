import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const RewardHistoryScreenStyles = StyleSheet.create({
  // 배경
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 5,
    position: 'relative',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  backButtonContainer: {
    position: 'absolute',
    left: 34,
    width: 60,
    top: 42,
    alignItems: 'flex-start',
  },

  // 상단 탭
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 80,
  },

  activeTabBtn: {
    backgroundColor: '#B6AFFF',
    borderColor: '#B6AFFF',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // 콘텐츠 컨테이너
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },

  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingLeft: 40,
    paddingBottom: 20,
  },

  // 통계 카드
  statsCard: {
    width: screenWidth * 0.45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statIcon: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },

  // 히스토리 아이템
  historyItem: {
    width: screenWidth * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  historyIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  historyInfo: {
    flex: 1,
  },

  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  historyType: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },

  pointValue: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  pointValueText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  historyContent: {
    marginBottom: 10,
  },

  historyDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  badgeInfo: {
    alignItems: 'flex-start',
  },

  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  badgeCode: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },

  historyIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },

  // 빈 상태
  emptyState: {
    width: screenWidth * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
});

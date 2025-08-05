import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.74);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
    marginLeft: 18,
    gap: 12,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#23284a',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeTabBtn: {
    backgroundColor: '#6c63ff',
  },
  tabText: {
    color: '#b3b3ff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#fff',
  },
  cardList: {
    paddingLeft: 50,
    paddingRight: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#181f3a',
    borderRadius: 18,
    padding: 18,
    marginRight: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 13,
    color: '#b3b3ff',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#e0e0ff',
    marginBottom: 12,
    lineHeight: 20,
  },
  readMoreBtn: {
    backgroundColor: '#4f6cff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  importantBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  importantText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#666',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeBadge: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeStatusText: {
    color: '#fff',
  },
  categoryBadge: {
    backgroundColor: '#23284a',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    color: '#b3b3ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledBtn: {
    backgroundColor: '#666',
  },
  disabledText: {
    color: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#b3b3ff',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 200,
  },
  emptyText: {
    color: '#b3b3ff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default styles;

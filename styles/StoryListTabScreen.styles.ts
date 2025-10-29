import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_WIDTH = Math.min(300, SCREEN_WIDTH * 0.74);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#b3b3ff',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#23284a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#b3b3ff',
  },
  summary: {
    fontSize: 14,
    color: '#e0e0ff',
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#4f6cff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  iconBtn: {
    backgroundColor: 'transparent',
    padding: 6,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    color: '#b3b3ff',
    marginBottom: 16,
  },
  emptyText: {
    color: '#b3b3ff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  createButton: {
    backgroundColor: '#4f6cff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;

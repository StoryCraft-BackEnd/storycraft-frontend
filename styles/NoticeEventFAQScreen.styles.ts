import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#f5f6fa',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#2d6cff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginLeft: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f6fa',
  },
  tabContainer: {
    width: 140,
    backgroundColor: '#f5f6fa',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 16,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: '#2d6cff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 22,
    color: '#7a7a7a',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2d6cff',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  contentInnerContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 48,
  },
});

export default styles;

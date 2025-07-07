import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: 'transparent',
    position: 'relative',
    height: 56,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    zIndex: 2,
    padding: 8,
  },
  backButtonText: {
    color: '#B0B8D1',
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 4,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#6C4DF6',
  },
  tabText: {
    color: '#B0B8D1',
    fontSize: 18,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 0,
  },
  contentInnerContainer: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  tabContainerInHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default styles;

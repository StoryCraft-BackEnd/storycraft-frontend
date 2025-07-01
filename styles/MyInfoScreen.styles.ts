import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export { SCREEN_WIDTH };

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 900,
  },
  card: {
    flexBasis: SCREEN_WIDTH > 700 ? 240 : '90%',
    flexGrow: 1,
    maxWidth: 340,
    minWidth: 180,
    backgroundColor: 'rgba(20, 30, 60, 0.92)',
    borderRadius: 18,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#eee',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  profileNickname: {
    fontSize: 12,
    color: '#b3b3ff',
    marginBottom: 2,
  },
  editBtn: {
    marginLeft: 'auto',
    backgroundColor: '#2d6cff',
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoField: {
    marginBottom: 10,
  },
  label: {
    color: '#b3b3ff',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a2340',
    color: '#fff',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#2d6cff',
  },
  pwBtn: {
    marginTop: 10,
    backgroundColor: 'linear-gradient(90deg, #a18fff 0%, #3b82f6 100%)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 3,
    elevation: 3,
  },
  pwBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  eventItem: {
    backgroundColor: '#232742',
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventPeriod: {
    fontSize: 14,
    color: '#B0B8D1',
  },
});

export default styles;

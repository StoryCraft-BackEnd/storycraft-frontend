import { StyleSheet } from 'react-native';

export const findAccountScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  smallButtonMarginLeft: {
    marginLeft: 8,
  },
  mainButton: {
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

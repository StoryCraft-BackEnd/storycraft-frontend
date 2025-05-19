import { StyleSheet } from 'react-native';

export const StoryCreateScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

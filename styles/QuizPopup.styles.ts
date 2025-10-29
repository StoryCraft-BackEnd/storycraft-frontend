import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const quizPopupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 어두운 배경
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.8, // 화면 높이의 80%로 제한
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  score: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 22,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
  },
  optionDefault: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  optionCorrect: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  optionWrong: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
    minWidth: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  optionTextDefault: {
    color: '#333333',
  },
  optionTextCorrect: {
    color: '#155724',
  },
  optionTextWrong: {
    color: '#721C24',
  },
  correctIcon: {
    fontSize: 16,
    color: '#28A745',
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: '#E7F3FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#0056B3',
    lineHeight: 18,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

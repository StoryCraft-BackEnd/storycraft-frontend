import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { quizPopupStyles } from '../../styles/QuizPopup.styles';
import { QuizOption, QuizData } from '../../shared/types/quiz';

interface QuizPopupProps {
  visible: boolean;
  onClose: () => void;
  quizData: QuizData;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
}

export default function QuizPopup({
  visible,
  onClose,
  quizData,
  questionNumber,
  totalQuestions,
  onNext,
}: QuizPopupProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleAnswerSelect = (optionId: string) => {
    if (answered) return;

    setSelectedAnswer(optionId);
    setAnswered(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    onNext();
  };

  const getOptionStyle = (option: QuizOption) => {
    if (!answered) {
      return quizPopupStyles.optionDefault;
    }

    if (option.isCorrect) {
      return quizPopupStyles.optionCorrect;
    } else if (selectedAnswer === option.id) {
      return quizPopupStyles.optionWrong;
    }

    return quizPopupStyles.optionDefault;
  };

  const getOptionTextColor = (option: QuizOption) => {
    if (!answered) {
      return quizPopupStyles.optionTextDefault;
    }

    if (option.isCorrect) {
      return quizPopupStyles.optionTextCorrect;
    } else if (selectedAnswer === option.id) {
      return quizPopupStyles.optionTextWrong;
    }

    return quizPopupStyles.optionTextDefault;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={quizPopupStyles.overlay}>
        <View style={quizPopupStyles.popupContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={quizPopupStyles.scrollContent}
          >
            <View style={quizPopupStyles.header}>
              <Text style={quizPopupStyles.progressText}>
                문제 {questionNumber} / {totalQuestions}
              </Text>
              <Text style={quizPopupStyles.score}>점수: 0</Text>
            </View>

            <View style={quizPopupStyles.questionContainer}>
              <Text style={quizPopupStyles.questionText}>{quizData.question}</Text>
            </View>

            <View style={quizPopupStyles.optionsContainer}>
              {quizData.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[quizPopupStyles.optionButton, getOptionStyle(option)]}
                  onPress={() => handleAnswerSelect(option.id)}
                  disabled={answered}
                >
                  <View style={quizPopupStyles.optionContent}>
                    <Text style={quizPopupStyles.optionId}>{option.id}</Text>
                    <Text style={[quizPopupStyles.optionText, getOptionTextColor(option)]}>
                      {option.text}
                    </Text>
                    {answered && option.isCorrect && (
                      <Text style={quizPopupStyles.correctIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {answered && (
              <View style={quizPopupStyles.explanationContainer}>
                <Text style={quizPopupStyles.explanationText}>
                  정답: "{quizData.word}"은 "{quizData.correctAnswer}"을 의미합니다.
                </Text>
              </View>
            )}

            {answered && (
              <TouchableOpacity style={quizPopupStyles.nextButton} onPress={handleNext}>
                <Text style={quizPopupStyles.nextButtonText}>다음 문제 →</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

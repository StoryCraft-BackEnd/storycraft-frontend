/**
 * @description
 * StoryCraft 영어 퀴즈 모달 컴포넌트
 * 퀴즈 문제를 표시하고 답안을 제출할 수 있는 모달입니다.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/QuizModal.styles';
import { Popup } from '@/components/ui/Popup';

// 퀴즈 문제 타입 정의
interface QuizQuestion {
  id: string;
  question: string;
  example: string;
  options: string[];
  correctAnswer: number;
  category: 'vocabulary' | 'grammar' | 'story';
  difficulty: 'easy' | 'normal' | 'hard';
  source: string;
}

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  quiz: QuizQuestion;
  onComplete: (score: number) => void;
}

/**
 * 영어 퀴즈 모달 컴포넌트
 * - 퀴즈 문제 표시
 * - 답안 선택 및 제출
 * - 결과 표시
 */
export default function QuizModal({ visible, onClose, quiz, onComplete }: QuizModalProps) {
  // === 상태 관리 ===
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // === 이벤트 핸들러 ===
  /**
   * 답안 선택 함수
   * - 사용자가 선택한 답안을 저장
   */
  const handleAnswerSelect = (answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  /**
   * 답안 제출 함수
   * - 선택한 답안을 검증하고 결과 표시
   */
  const handleSubmit = () => {
    if (selectedAnswer === null) {
      Alert.alert('알림', '답안을 선택해주세요.');
      return;
    }

    const correct = selectedAnswer === quiz.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // 점수 계산 (정답: 100점, 오답: 0점)
    const score = correct ? 100 : 0;

    // 잠시 후 결과 표시
    setTimeout(() => {
      Alert.alert(
        correct ? '정답입니다! 🎉' : '틀렸습니다 😢',
        correct
          ? `정답: ${quiz.options[quiz.correctAnswer]}\n점수: ${score}점`
          : `정답: ${quiz.options[quiz.correctAnswer]}\n점수: ${score}점`,
        [
          {
            text: '확인',
            onPress: () => {
              onComplete(score);
              handleClose();
            },
          },
        ]
      );
    }, 1000);
  };

  /**
   * 모달 닫기 함수
   * - 상태 초기화 후 모달 닫기
   */
  const handleClose = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    onClose();
  };

  /**
   * 취소 함수
   * - 확인 후 모달 닫기
   */
  const handleCancel = () => {
    if (isSubmitted) {
      handleClose();
    } else {
      setShowCancelPopup(true);
    }
  };

  // === 유틸리티 함수 ===
  /**
   * 카테고리별 한글 라벨 반환 함수
   */
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return '어휘 퀴즈';
      case 'grammar':
        return '문법 퀴즈';
      case 'story':
        return '동화 퀴즈';
      default:
        return '퀴즈';
    }
  };

  /**
   * 난이도별 색상 반환 함수
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return COLORS.difficultyEasy;
      case 'normal':
        return COLORS.difficultyNormal;
      case 'hard':
        return COLORS.difficultyHard;
      default:
        return COLORS.textSecondary;
    }
  };

  /**
   * 난이도별 한글 라벨 반환 함수
   */
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'normal':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return '보통';
    }
  };

  // === 렌더링 함수 ===
  /**
   * 답안 옵션 렌더링 함수
   */
  const renderAnswerOption = (option: string, index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrectAnswer = index === quiz.correctAnswer;
    const showResult = isSubmitted && (isSelected || isCorrectAnswer);

    let backgroundColor = COLORS.filterBackground;
    let borderColor = COLORS.inputBorder;

    if (isSelected) {
      if (isSubmitted) {
        backgroundColor = isCorrect ? COLORS.textSuccess : '#F44336';
        borderColor = isCorrect ? COLORS.textSuccess : '#F44336';
      } else {
        backgroundColor = COLORS.activeFilterBackground;
        borderColor = COLORS.primaryPurple;
      }
    } else if (showResult && isCorrectAnswer) {
      backgroundColor = COLORS.textSuccess;
      borderColor = COLORS.textSuccess;
    }

    return (
      <TouchableOpacity
        key={index}
        style={[styles.answerOption, { backgroundColor, borderColor }]}
        onPress={() => handleAnswerSelect(index)}
        disabled={isSubmitted}
      >
        <Text
          style={[
            styles.answerText,
            {
              color:
                isSelected || (showResult && isCorrectAnswer)
                  ? COLORS.textPrimary
                  : COLORS.textSecondary,
            },
          ]}
        >
          {option}
        </Text>
        {isSelected && isSubmitted && (
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={COLORS.textPrimary}
            style={styles.resultIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  // === 메인 렌더링 ===
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getCategoryLabel(quiz.category)}</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* 카테고리 및 출처 태그 */}
          <View style={styles.tagContainer}>
            <View
              style={[
                styles.difficultyTag,
                { backgroundColor: getDifficultyColor(quiz.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>{getDifficultyLabel(quiz.difficulty)}</Text>
            </View>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceText}>{quiz.source}</Text>
            </View>
          </View>

          {/* 퀴즈 문제 */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{quiz.question}</Text>
            <Text style={styles.exampleText}>예문: "{quiz.example}"</Text>
          </View>

          {/* 답안 옵션들 - 1줄에 전부 배치 */}
          <View style={styles.answerContainer}>
            <View style={styles.answerRow}>
              {quiz.options.map((option, index) => renderAnswerOption(option, index))}
            </View>
          </View>

          {/* 하단 버튼들 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={selectedAnswer === null || isSubmitted}
            >
              <Text style={styles.submitButtonText}>답안 제출</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 취소 확인 팝업 */}
      <Popup
        visible={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        title="퀴즈 취소"
        message="퀴즈를 취소하시겠습니까?"
        confirmText="계속하기"
        cancelText="취소"
        onConfirm={() => setShowCancelPopup(false)}
        onCancel={handleClose}
      />
    </Modal>
  );
}

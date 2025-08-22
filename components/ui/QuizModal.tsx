/**
 * @description
 * StoryCraft 영어 퀴즈 모달 컴포넌트
 * 퀴즈 문제를 표시하고 답안을 제출할 수 있는 모달입니다.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- 내부 모듈 및 스타일 ---
import styles, { COLORS } from '@/styles/QuizModal.styles';
import { Popup } from '@/components/ui/Popup';
import { addQuizBookmark, removeQuizBookmark, isQuizBookmarked } from '@/features/quiz/quizStorage';

// 새로운 퀴즈 API 타입 사용
interface Quiz {
  quizId: number;
  storyId: number;
  question: string;
  options: { [key: string]: string };
}

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onSubmit: (selectedAnswer: string) => void;
  isLastQuiz?: boolean;
  currentQuizIndex?: number;
  totalQuizzes?: number;
}

/**
 * 영어 퀴즈 모달 컴포넌트
 * - 퀴즈 문제 표시
 * - 답안 선택 및 제출
 * - 북마크 기능
 * - 자동 진행 시스템 지원
 */
export default function QuizModal({
  visible,
  onClose,
  quiz,
  onSubmit,
  isLastQuiz,
  currentQuizIndex,
  totalQuizzes,
}: QuizModalProps) {
  // === 상태 관리 ===
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // === 북마크 상태 로드 ===
  useEffect(() => {
    if (quiz) {
      loadBookmarkStatus();
    }
  }, [quiz]);

  const loadBookmarkStatus = async () => {
    if (!quiz) return;

    try {
      const bookmarked = await isQuizBookmarked(quiz.quizId);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('북마크 상태 로드 실패:', error);
    }
  };

  // === 이벤트 핸들러 ===
  /**
   * 답안 선택 함수
   */
  const handleAnswerSelect = (answerKey: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerKey);
    }
  };

  /**
   * 답안 제출 함수
   */
  const handleSubmit = () => {
    if (selectedAnswer === null || !quiz) {
      Alert.alert('알림', '답안을 선택해주세요.');
      return;
    }

    setIsSubmitted(true);

    // 잠시 후 답안 제출
    setTimeout(() => {
      onSubmit(selectedAnswer);
      handleClose();
    }, 1000);
  };

  /**
   * 북마크 토글 함수
   */
  const handleToggleBookmark = async () => {
    if (!quiz) return;

    try {
      if (isBookmarked) {
        await removeQuizBookmark(quiz.quizId);
        setIsBookmarked(false);
        Alert.alert('북마크 제거', '북마크에서 제거되었습니다.');
      } else {
        await addQuizBookmark(quiz);
        setIsBookmarked(true);
        Alert.alert('북마크 추가', '북마크에 추가되었습니다.');
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      Alert.alert('오류', '북마크 상태를 변경할 수 없습니다.');
    }
  };

  /**
   * 모달 닫기 함수
   */
  const handleClose = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    onClose();
  };

  /**
   * 취소 함수
   */
  const handleCancel = () => {
    if (isSubmitted) {
      handleClose();
    } else {
      setShowCancelPopup(true);
    }
  };

  // === 렌더링 함수 ===
  /**
   * 답안 옵션 렌더링 함수
   */
  const renderAnswerOption = (optionKey: string, optionText: string) => {
    const isSelected = selectedAnswer === optionKey;

    let backgroundColor = COLORS.filterBackground;
    let borderColor = COLORS.inputBorder;

    if (isSelected) {
      backgroundColor = COLORS.activeFilterBackground;
      borderColor = COLORS.primaryPurple;
    }

    return (
      <TouchableOpacity
        key={optionKey}
        style={[styles.answerOption, { backgroundColor, borderColor }]}
        onPress={() => handleAnswerSelect(optionKey)}
        disabled={isSubmitted}
      >
        <Text
          style={[
            styles.answerText,
            {
              color: isSelected ? COLORS.textPrimary : COLORS.textSecondary,
            },
          ]}
        >
          {optionText}
        </Text>
      </TouchableOpacity>
    );
  };

  // 퀴즈가 없으면 렌더링하지 않음
  if (!quiz) {
    return null;
  }

  // === 메인 렌더링 ===
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {currentQuizIndex !== undefined && totalQuizzes !== undefined
                ? `${currentQuizIndex + 1}/${totalQuizzes}`
                : '동화 퀴즈'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* 북마크 버튼 */}
              <TouchableOpacity
                onPress={handleToggleBookmark}
                style={{ marginRight: 10, padding: 5 }}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isBookmarked ? COLORS.primaryPurple : COLORS.textSecondary}
                />
              </TouchableOpacity>
              {/* 닫기 버튼 */}
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 카테고리 및 출처 태그 */}
          <View style={styles.tagContainer}>
            <View style={[styles.difficultyTag, { backgroundColor: COLORS.difficultyNormal }]}>
              <Text style={styles.difficultyText}>동화 퀴즈</Text>
            </View>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceText}>동화 #{quiz.storyId}</Text>
            </View>
          </View>

          {/* 퀴즈 문제 */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{quiz.question}</Text>
          </View>

          {/* 답안 옵션들 */}
          <View style={styles.answerContainer}>
            <View style={styles.answerRow}>
              {Object.entries(quiz.options).map(([key, text]) => renderAnswerOption(key, text))}
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
              <Text style={styles.submitButtonText}>{isLastQuiz ? '완료' : '다음'}</Text>
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

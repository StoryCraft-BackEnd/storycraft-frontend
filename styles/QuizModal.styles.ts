import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// 색상 상수 정의
const COLORS = {
  // 기본 색상
  white: '#fff',
  black: '#000',

  // 테마 색상
  primaryPurple: '#B6AFFF', // 기본 보라색 (아이콘, 텍스트)
  accentGold: '#FFD700', // 강조 금색 (별표, 스파클)

  // 난이도별 색상
  difficultyAll: '#FFD700', // 전체 (금색)
  difficultyEasy: '#4CAF50', // 쉬움 (초록색)
  difficultyNormal: '#FF9800', // 보통 (주황색)
  difficultyHard: '#F44336', // 어려움 (빨간색)

  // 모달 색상
  modalBackground: 'rgba(30, 30, 60, 0.95)', // 모달 배경
  modalBorder: 'rgba(182, 175, 255, 0.3)', // 모달 테두리

  // 텍스트 색상
  textPrimary: '#fff', // 주요 텍스트 (흰색)
  textSecondary: '#B6AFFF', // 보조 텍스트 (보라색)
  textSuccess: '#4CAF50', // 성공/긍정 텍스트 (초록색)
  textError: '#F44336', // 오류 텍스트 (빨간색)

  // 버튼 색상
  buttonSuccess: '#4CAF50', // 성공 버튼 (초록색)
  buttonCancel: '#fff', // 취소 버튼 (흰색)
  buttonGradient: ['#4CAF50', '#2196F3'], // 그라데이션 버튼

  // 배경 색상
  overlayDark: 'rgba(0, 0, 0, 0.7)', // 어두운 오버레이
  filterBackground: 'rgba(255, 255, 255, 0.05)', // 필터 배경
  activeFilterBackground: 'rgba(255, 255, 255, 0.15)', // 활성 필터 배경
  inputBorder: 'rgba(182, 175, 255, 0.3)', // 입력창 테두리
};

// 색상 상수를 export하여 다른 파일에서 사용할 수 있도록 함
export { COLORS };

export default StyleSheet.create({
  // 모달 오버레이
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 모달 컨테이너
  modalContainer: {
    width: wp('100%'),
    maxHeight: hp('45%'),
    backgroundColor: COLORS.modalBackground,
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: COLORS.modalBorder,
    padding: wp('4%'),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },

  // 모달 헤더
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.filterBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 태그 컨테이너
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sourceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: COLORS.filterBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  sourceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // 문제 컨테이너
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // 답안 컨테이너
  answerContainer: {
    gap: 12,
    marginBottom: 24,
  },
  answerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  answerOption: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.filterBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  resultIcon: {
    marginLeft: 8,
  },

  // 버튼 컨테이너
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.buttonCancel,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.buttonSuccess,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.filterBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});

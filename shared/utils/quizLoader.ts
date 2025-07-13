import { QuizData, QuizDataSet } from '../types/quiz';
import quizDataJson from '../data/quiz-data.json';

/**
 * 퀴즈 데이터를 로드하는 함수
 * @returns QuizDataSet 전체 퀴즈 데이터
 */
export const loadQuizData = (): QuizDataSet => {
  return quizDataJson as QuizDataSet;
};

/**
 * 특정 단어들에 대한 퀴즈 데이터를 가져오는 함수
 * @param words 퀴즈를 가져올 단어 배열
 * @returns QuizData[] 해당 단어들의 퀴즈 데이터 배열
 */
export const getQuizByWords = (words: string[]): QuizData[] => {
  const quizData = loadQuizData();
  const result: QuizData[] = [];

  words.forEach((word) => {
    const wordQuizzes = quizData[word];
    if (wordQuizzes && wordQuizzes.length > 0) {
      // 각 단어당 첫 번째 퀴즈만 가져오기 (필요시 랜덤 선택으로 변경 가능)
      result.push(wordQuizzes[0]);
    }
  });

  return result;
};

/**
 * 특정 단어에 대한 퀴즈 데이터를 가져오는 함수
 * @param word 퀴즈를 가져올 단어
 * @returns QuizData | null 해당 단어의 퀴즈 데이터 또는 null
 */
export const getQuizByWord = (word: string): QuizData | null => {
  const quizData = loadQuizData();
  const wordQuizzes = quizData[word];

  if (wordQuizzes && wordQuizzes.length > 0) {
    return wordQuizzes[0];
  }

  return null;
};

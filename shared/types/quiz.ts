export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizData {
  question: string;
  options: QuizOption[];
  word: string;
  correctAnswer: string;
}

export interface QuizDataSet {
  [key: string]: QuizData[];
}

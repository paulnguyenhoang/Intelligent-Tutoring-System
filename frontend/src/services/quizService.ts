import type { Quiz, Question, QuizResult, LegacyQuestion, LegacyQuiz } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

export const sampleQuiz: Quiz = {
  id: "sample-1",
  title: "test",
  description: "",
  timeLimit: 30,
  passingScore: 100,
  questions: [
    {
      id: "q1",
      content: "What is 2 + 2?",
      options: { A: "3", B: "4", C: "5", D: "6" },
      correctAnswer: "B",
      hint: "Think about basic addition",
      feedback: "2 + 2 equals 4",
    },
  ],
};

export const sampleQuiz2: Quiz = {
  id: "sample-2",
  title: "Math",
  description: "abc",
  timeLimit: 30,
  passingScore: 50,
  questions: [
    {
      id: "q1",
      content: "What is 5 + 3?",
      options: { A: "6", B: "7", C: "8", D: "9" },
      correctAnswer: "C",
      hint: "Count on your fingers",
      feedback: "5 + 3 equals 8",
    },
    {
      id: "q2",
      content: "What is 10 - 4?",
      options: { A: "5", B: "6", C: "7", D: "8" },
      correctAnswer: "B",
      hint: "Subtract step by step",
      feedback: "10 - 4 equals 6",
    },
  ],
};

export function getQuizzes(): Quiz[] {
  const stored = parseJSON<Quiz[]>(localStorage.getItem(STORAGE_KEYS.QUIZZES), []);

  // If no quizzes, return sample quizzes
  if (stored.length === 0) {
    return [sampleQuiz, sampleQuiz2];
  }

  return stored;
}

export function getQuizById(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id);
}

export function createQuiz(quiz: Omit<Quiz, "id">): Quiz {
  const quizzes = getQuizzes().filter((q) => q.id !== "sample-1"); // Remove sample quiz
  const newQuiz: Quiz = { ...quiz, id: Date.now().toString() };
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify([...quizzes, newQuiz]));
  return newQuiz;
}

export function updateQuiz(id: string, data: Partial<Quiz>): void {
  const quizzes = getQuizzes();
  const updated = quizzes.map((q) => (q.id === id ? { ...q, ...data } : q));
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updated));
}

export function deleteQuiz(id: string): void {
  const quizzes = getQuizzes();
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes.filter((q) => q.id !== id)));
}

export function evaluate(quiz: Quiz, answers: Record<string, string>): QuizResult {
  let correct = 0;
  quiz.questions.forEach((q) => {
    const userAnswer = answers[q.id];
    if (userAnswer && userAnswer === q.correctAnswer) {
      correct++;
    }
  });
  return { correct, total: quiz.questions.length };
}

// Quiz completion tracking
export interface QuizCompletion {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

export function saveQuizCompletion(completion: QuizCompletion): void {
  const completions = getQuizCompletions();
  // Update or add new completion
  const filtered = completions.filter((c) => c.quizId !== completion.quizId);
  localStorage.setItem(STORAGE_KEYS.QUIZ_COMPLETIONS, JSON.stringify([...filtered, completion]));
}

export function getQuizCompletions(): QuizCompletion[] {
  return parseJSON<QuizCompletion[]>(localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETIONS), []);
}

export function getQuizCompletion(quizId: string): QuizCompletion | undefined {
  return getQuizCompletions().find((c) => c.quizId === quizId);
}

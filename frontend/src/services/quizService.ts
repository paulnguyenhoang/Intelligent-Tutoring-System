import type { Quiz, Question, QuizResult, LegacyQuestion, LegacyQuiz } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

export const sampleQuiz: Quiz = {
  id: "sample-1",
  title: "Sample Quiz: Basic Knowledge",
  description: "A sample quiz to demonstrate the new format",
  timeLimit: 30,
  passingScore: 70,
  questions: [
    {
      id: "q1",
      content: "What is 2 + 2?",
      options: { A: "3", B: "4", C: "5", D: "6" },
      correctAnswer: "B",
      hint: "Think about basic addition",
      feedback: "2 + 2 equals 4",
    },
    {
      id: "q2",
      content: "React is a...",
      options: { A: "Database", B: "Library", C: "OS", D: "Language" },
      correctAnswer: "B",
      hint: "It's used for building user interfaces",
      feedback: "React is a JavaScript library for building UIs",
    },
    {
      id: "q3",
      content: "HTML stands for?",
      options: { A: "HyperText Markup Language", B: "HyperTool", C: "Hyperlink", D: "None" },
      correctAnswer: "A",
    },
  ],
};

export function getQuizzes(): Quiz[] {
  const stored = parseJSON<Quiz[]>(localStorage.getItem(STORAGE_KEYS.QUIZZES), []);

  // If no quizzes, return sample quiz
  if (stored.length === 0) {
    return [sampleQuiz];
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

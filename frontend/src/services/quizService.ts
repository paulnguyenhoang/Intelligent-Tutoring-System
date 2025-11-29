import { Quiz, Question, QuizResult } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

export const sampleQuiz: Quiz = {
  id: "sample-1",
  title: "Sample Quiz: Basic Knowledge",
  questions: [
    { id: "q1", text: "What is 2 + 2?", options: ["3", "4", "5", "6"], answerIndex: 1 },
    {
      id: "q2",
      text: "React is a...",
      options: ["Database", "Library", "OS", "Language"],
      answerIndex: 1,
    },
    {
      id: "q3",
      text: "HTML stands for?",
      options: ["HyperText", "HyperTool", "Hyperlink"],
      answerIndex: 0,
    },
  ].map((q, i) => ({ ...q, id: q.id || `q${i}` })),
};

export function getQuizzes(): Quiz[] {
  return parseJSON<Quiz[]>(localStorage.getItem(STORAGE_KEYS.QUIZZES), []);
}

export function getQuizById(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id);
}

export function createQuiz(quiz: Omit<Quiz, "id">): Quiz {
  const quizzes = getQuizzes();
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

export function evaluate(quiz: Quiz, answers: Record<string, number>): QuizResult {
  let correct = 0;
  quiz.questions.forEach((q) => {
    const a = answers[q.id];
    if (typeof a === "number" && a === q.answerIndex) correct++;
  });
  return { correct, total: quiz.questions.length };
}

import type { Quiz } from "../types";

const API_BASE_URL = "http://localhost:3001";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export async function getQuizzes(): Promise<Quiz[]> {
  const res = await fetch(`${API_BASE_URL}/quizzes`);
  return handleResponse<Quiz[]>(res);
}

export async function getQuizById(id: string): Promise<Quiz | undefined> {
  const res = await fetch(`${API_BASE_URL}/quizzes/${id}`);
  if (res.status === 404) return undefined;
  return handleResponse<Quiz>(res);
}

export async function createQuiz(quiz: Omit<Quiz, "id">): Promise<Quiz> {
  const res = await fetch(`${API_BASE_URL}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  return handleResponse<Quiz>(res);
}

export async function updateQuiz(id: string, data: Omit<Quiz, "id">): Promise<Quiz> {
  const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Quiz>(res);
}

export async function deleteQuiz(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete quiz");
  }
}

export interface QuizSubmissionResult {
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  feedback?: string;
  attemptId?: string;
  completedAt?: string;
}

export async function evaluate(
  quiz: Quiz,
  answers: Record<string, string>,
  studentId: string
): Promise<QuizSubmissionResult> {
  const res = await fetch(`${API_BASE_URL}/quizzes/${quiz.id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, studentId }),
  });
  return handleResponse<QuizSubmissionResult>(res);
}

export interface QuizCompletion {
  quizId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  completedAt: string | null;
}

export async function getQuizCompletion(
  quizId: string,
  studentId: string
): Promise<QuizCompletion | null> {
  const res = await fetch(
    `${API_BASE_URL}/quizzes/${quizId}/completion?studentId=${encodeURIComponent(studentId)}`
  );
  if (!res.ok) {
    if (res.status === 404) return null;
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch quiz completion");
  }
  return res.json();
}

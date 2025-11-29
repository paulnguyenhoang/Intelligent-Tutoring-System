export type UserRole = "teacher" | "student";

export type User = {
  username: string;
  role: UserRole;
  password?: string;
};

export type Course = {
  id: string;
  title: string;
  description?: string;
  content?: string;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  courseId?: string;
  questions: Question[];
};

export type QuizResult = {
  correct: number;
  total: number;
};

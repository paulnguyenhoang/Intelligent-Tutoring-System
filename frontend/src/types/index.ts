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
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  hint?: string;
  feedback?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  courseId?: string;
  questions: Question[];
};

// Legacy types for backward compatibility
export type LegacyQuestion = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
};

export type LegacyQuiz = {
  id: string;
  title: string;
  courseId?: string;
  questions: LegacyQuestion[];
};

export type QuizResult = {
  correct: number;
  total: number;
};

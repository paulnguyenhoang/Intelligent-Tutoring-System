export type UserRole = "teacher" | "student";

export type User = {
  username: string;
  role: UserRole;
  password?: string;
};

export type Instructor = {
  name: string;
  avatar?: string;
};

export type Course = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  thumbnail: string;
  category: string;
  instructor?: Instructor;
  lessonsWatched?: number;
  totalLessons?: number;
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

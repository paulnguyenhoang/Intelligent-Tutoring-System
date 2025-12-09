export type UserRole = "teacher" | "student";

export type User = {
  id?: string;
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
  category: string;
  instructorID?: string;
  thumbnail?: string | Blob; // Blob object or Blob URL or image URL
  instructor?: Instructor;
  totalLessons?: number;
  lessonsWatched?: number;
};

export type Question = {
  id?: string;
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  hint?: string;
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

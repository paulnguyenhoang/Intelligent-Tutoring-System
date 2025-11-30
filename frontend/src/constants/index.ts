// LocalStorage keys
export const STORAGE_KEYS = {
  USER: "its_user",
  USERS: "its_users",
  COURSES: "its_courses",
  QUIZZES: "its_quizzes",
  QUIZ_COMPLETIONS: "its_quiz_completions",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  TEACHER: "/teacher",
  TEACHER_QUIZ: "/teacher/quiz",
  COURSES: "/courses",
  QUIZ: "/quiz",
  RESULT: "/result",
} as const;

// Role labels
export const ROLE_LABELS = {
  teacher: "Teacher (Giáo viên)",
  student: "Student (Học sinh)",
} as const;

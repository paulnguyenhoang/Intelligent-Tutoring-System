import { FrontendQuiz } from "../../service/quiz";

export interface IQuizReadService {
  list: () => Promise<FrontendQuiz[]>;
  getOne: (id: string) => Promise<FrontendQuiz | null>;
  completion: (
    quizID: string,
    username: string
  ) => Promise<{
    quizId: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    completedAt: string | null;
  } | null>;
}

export interface IQuizWriteService {
  create: (quiz: FrontendQuiz) => Promise<FrontendQuiz>;
  update: (id: string, quiz: FrontendQuiz) => Promise<FrontendQuiz | null>;
  remove: (id: string) => Promise<void>;
  submit: (
    id: string,
    username: string,
    answers: Record<string, string>
  ) => Promise<{
    correct: number;
    total: number;
    percentage: number;
    passed: boolean;
    feedback: string;
    attemptId: string;
    completedAt: string;
  } | null>;
}
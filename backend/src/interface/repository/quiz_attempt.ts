import { QuizStatsDTO } from "../../dto/quiz_stats";
import { QuizAttempt } from "../../model/entity/quiz_attempt";

export interface IQuizAttemptRepository{
    getAttempts: (student: string, quizID: string) => Promise<QuizAttempt[]>
    findAttemptByID: (id: string) => Promise<QuizAttempt>
    getQuizStats: (quizID: string) => Promise<QuizStatsDTO>
    save: (attempt: QuizAttempt) => Promise<void>
    delete: (id: string) => Promise<void>
}
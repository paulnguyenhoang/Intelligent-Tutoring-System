import { QuizAttempt } from "../../model/entity/quiz_attempt";

export interface IQuizAttemptRepository{
    getAttempts: (student: string, quizID: string) => Promise<QuizAttempt[]>
    findAttemptByID: (id: string) => Promise<QuizAttempt>
    save: (attempt: QuizAttempt) => Promise<void>
}
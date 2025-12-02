import { QuizAttempt } from "../../model/entity/quiz_attempt";

export interface IGradingStrategy{
    grade: (submission: QuizAttempt) => Promise<number>
}
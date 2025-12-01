import { QuizResultStatus } from "../model/enum/quiz_result_status";

export interface QuizResultDTO{
    quizID: string,
    timeTaken?: number,
    attempts: number,
    score: number,
    feedback: string,
    status: QuizResultStatus
}
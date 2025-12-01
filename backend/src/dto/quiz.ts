import { DifficultyLevel } from "../model/enum/difficulty_level"

export interface QuizDTO{
    id: string,
    title: string,
    description: string,
    timeLimit: number,
    minPassScore: number,
    maxAttempts: number,
    questions: [
        {
            questionTitle: string,
            options: string[],
            correctOptionId: number[],
            feedback: string,
            hint: string,
        }
    ]
    passingScore: number
}
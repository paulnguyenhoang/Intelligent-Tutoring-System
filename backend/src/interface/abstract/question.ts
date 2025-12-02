import { DifficultyLevel } from "../../model/enum/difficulty_level";

export interface Question{
    id: string
    quizID: string
    content: string
    difficulty: DifficultyLevel
    tags?: string[]
    hint?: string
    validateAnswer: (ans: string[]) => Promise<boolean>
    getScore: () => Promise<number>
}
import { Question } from "../../interface/abstract/question";
import { DifficultyLevel } from "../enum/difficulty_level";

export class EssayQuestion implements Question{
    public id: string
    public quizID: string
    public content: string
    public difficulty: DifficultyLevel
    public tags?: string[]
    public hint?: string
    public keywords: string[]
    public maxLength: number
    public rubric: {[key: string]: number}
    public constructor(
        id: string,
        quizID: string,
        content: string,
        difficulty: DifficultyLevel,
        keywords: string[],
        maxLength: number,
        rubric: {[key: string]: number},
        tags?: string[],
        hint?: string
    ){
        this.id = id
        this.quizID = quizID
        this.content = content
        this.difficulty = difficulty
        this.tags = tags
        this.hint = hint
        this.keywords = keywords
        this.maxLength = maxLength
        this.rubric = rubric
    }
    public async validateAnswer(
        ans: string[]
    ){
        return true
    }
    public async getScore(){
        return 1.0
    }
}
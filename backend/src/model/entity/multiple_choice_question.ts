import { Question } from "../../interface/abstract/question";
import { DifficultyLevel } from "../enum/difficulty_level";

export class MultipleChoiceQuestion implements Question{
    public id: string
    public quizID: string
    public content: string
    public difficulty: DifficultyLevel
    public tags?: string[]
    public hint?: string
    public correctOptionId?: number[]
    public options: string[]
    public isMultiSelect: boolean
    public constructor(
        id: string,
        quizID: string,
        content: string,
        difficulty: DifficultyLevel,
        options: string[],
        isMultiSelect: boolean,
        correctOptionId?: number[],
        tags?: string[],
        hint?: string
    ){
        this.id = id
        this.quizID = quizID
        this.content = content
        this.difficulty = difficulty
        this.tags = tags
        this.hint = hint
        this.correctOptionId = correctOptionId
        this.options = options
        this.isMultiSelect = isMultiSelect
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
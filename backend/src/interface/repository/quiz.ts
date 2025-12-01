import { Quiz } from "../../model/entity/quiz";

export interface IQuizRepository{
    findQuizByInstructor: (instructor: string) => Promise<Quiz[]>
    findQuizByID: (id: string) => Promise<Quiz>
    save: (quiz: Quiz) => Promise<void>
}
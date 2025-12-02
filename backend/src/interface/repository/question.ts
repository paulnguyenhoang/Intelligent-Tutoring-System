import { Question } from "../abstract/question";

export interface IQuestionRepository{
    getQuestion: (id: string) => Promise<Question>
    getQuestions: (quizID: string) => Promise<Question[]>
}
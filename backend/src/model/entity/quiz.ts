import { Question } from "../../interface/abstract/question"
import { QuizStatus } from "../enum/quiz_status"

export class Quiz{
    public id: string
    public instructor: string
    public title: string
    public timeLimit: number
    public minPassScore: number
    public maxAttempts: number
    public status: QuizStatus
    public questions: Question[]
    public constructor(
        id: string,
        instructor: string,
        title: string,
        timeLimit: number,
        minPassScore: number,
        maxAttempts: number,
        status: QuizStatus,
        questions: Question[]
    ){
        this.id = id
        this.instructor = instructor
        this.title = title
        this.timeLimit = timeLimit
        this.minPassScore = minPassScore
        this.maxAttempts = maxAttempts
        this.status = status
        this.questions = questions
    }
    public async addQuestion(
        q: Question
    ){
        this.questions.push(q)
    }
    public async shuffleQuestions(){
        let newQuestions = new Array(...this.questions)
        for (let i = 0; i < this.questions.length; i++){
            let randomIdx
            do{
                randomIdx = Math.floor(Math.random() * 100) % (this.questions.length + 1)
            } while(randomIdx === i)
            const temp = newQuestions[randomIdx]
            newQuestions[randomIdx] = newQuestions[i]
            newQuestions[i] = temp
        }
        this.questions = newQuestions
    }
}
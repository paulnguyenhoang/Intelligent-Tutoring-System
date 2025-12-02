export class QuizAttempt{
    public attemptID: string
    public studentID: string
    public quizID: string
    public answers: {[key: string]: number[]}
    public totalScore?: number
    public feedback?: string
    public timeTaken?: number
    public constructor(
        attemptID: string,
        studentID: string,
        quizID: string,
        answers: {[key: string]: number[]},
        totalScore?: number,
        feedback?: string,
        timeTaken?: number
    ){
        this.attemptID =  attemptID
        this.studentID =  studentID
        this.quizID =  quizID
        this.answers =  answers
        this.totalScore =  totalScore
        this.feedback =  feedback
        this.timeTaken = timeTaken
    }
    public async submit(){
        
    }
}
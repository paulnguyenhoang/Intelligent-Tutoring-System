import { IGradingStrategy } from "../../interface/grading/grading_strategy";
import { QuizAttempt } from "../entity/quiz_attempt";

export class StrictGrading implements IGradingStrategy{
    public async grade(
        submission: QuizAttempt
    ){
        return 1.0
    }
}
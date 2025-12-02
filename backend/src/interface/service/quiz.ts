import { QuizDTO } from "../../dto/quiz";
import { QuizResultDTO } from "../../dto/quiz_result";
import { QuizStatsDTO } from "../../dto/quiz_stats";
import { Quiz } from "../../model/entity/quiz";
import { QuizAttempt } from "../../model/entity/quiz_attempt";
import { IQuestionRepository } from "../repository/question";
import { IQuizRepository } from "../repository/quiz";
import { IQuizAttemptRepository } from "../repository/quiz_attempt";

export interface IQuizService{
    quizRepository: IQuizRepository
    quizAttemptRepository: IQuizAttemptRepository
    questionRepository: IQuestionRepository
    createQuiz: (quiz: QuizDTO) => Promise<Quiz>
    updateQuiz: (quiz: QuizDTO) => Promise<Quiz>
    submitQuiz: (attempt: QuizAttempt) => Promise<void>
    calculateScore: (attempt: QuizAttempt) => Promise<number>
    getQuizResult: (attemptID: string) => Promise<QuizResultDTO>
    analyzeStatistics: (quizID: string) => Promise<QuizStatsDTO>
    deleteQuiz: (id: string) => Promise<void>
}
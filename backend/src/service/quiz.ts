import { QuizDTO } from "../dto/quiz";
import { QuizResultDTO } from "../dto/quiz_result";
import { QuizStatsDTO } from "../dto/quiz_stats";
import { IGradingStrategy } from "../interface/grading/grading_strategy";
import { IQuizService } from "../interface/service/quiz";
import { Quiz } from "../model/entity/quiz";
import { QuizAttempt } from "../model/entity/quiz_attempt";
import uuid from 'uuid'
import { QuizStatus } from "../model/enum/quiz_status";
import { MultipleChoiceQuestion } from "../model/entity/multiple_choice_question";
import crypto from 'crypto'
import { IQuizRepository } from "../interface/repository/quiz";
import { IQuizAttemptRepository } from "../interface/repository/quiz_attempt";
import { IQuestionRepository } from "../interface/repository/question";
import { QuizResultStatus } from "../model/enum/quiz_result_status";

export class QuizService implements IQuizService{
    public quizRepository: IQuizRepository
    public gradingStrategy: IGradingStrategy
    public quizAttemptRepository: IQuizAttemptRepository
    public questionRepository: IQuestionRepository;
    public constructor(
        gradingStrategy: IGradingStrategy,
        quizRepository: IQuizRepository,
        quizAttemptRepository: IQuizAttemptRepository,
        questionRepository: IQuestionRepository
    ){
        this.gradingStrategy = gradingStrategy
        this.quizRepository = quizRepository
        this.quizAttemptRepository = quizAttemptRepository
        this.questionRepository = questionRepository
    }
    public async submitQuiz(
        attempt: QuizAttempt
    ){
        await this.quizAttemptRepository.save(
            attempt
        )
    
    }
    public async updateQuiz(
        quiz: QuizDTO
    ){
        await this.quizRepository.delete(
            quiz.quizID as string
        )
        const newQuiz = new Quiz(
            quiz.quizID!,
            quiz.instructorID,
            quiz.title,
            quiz.timeLimit,
            quiz.minPassScore,
            quiz.maxAttempts,
            QuizStatus.PUBLISHED,
            []
        )
        quiz.questions.forEach(
            (value) => {
                newQuiz.addQuestion(
                    new MultipleChoiceQuestion(
                        uuid.v4(),
                        quiz.quizID!,
                        value.questionTitle,
                        crypto.randomInt(0,4),
                        value.options,
                        true,
                        value.correctOptionId
                    )
                )
            }
        )
        await newQuiz.shuffleQuestions()
        await this.quizRepository.save(
            newQuiz
        )
        return newQuiz
    }
    public async calculateScore(
        attempt: QuizAttempt
    ){
        const quiz = await this.quizRepository.findQuizByID(
            attempt.quizID
        )
        const quizQuestions = await this.questionRepository.getQuestions(
            attempt.quizID
        )
        const answers = attempt.answers
        let correctAnswers = 0
        for (const key of Object.keys(answers)){
            if (
                await 
                    (await this.questionRepository.getQuestion(key))
                    .validateAnswer(answers[key]
                        .map(
                            val => val.toString()
                        )
                    )
            )
                correctAnswers++
        }
        const score = (correctAnswers/Object.keys(quizQuestions).length)*10
        attempt.feedback = score >= quiz.minPassScore ? "Excellent!" : "You must try harder next time"
        attempt.totalScore = score
        await this.quizAttemptRepository.save(
            attempt
        )
        return score
    }
    public async createQuiz(
        quiz: QuizDTO
    ){
        const quizID = uuid.v4()
        const newQuiz = new Quiz(
            quizID,
            quiz.instructorID,
            quiz.title,
            quiz.timeLimit,
            quiz.minPassScore,
            quiz.maxAttempts,
            QuizStatus.PUBLISHED,
            []
        )
        quiz.questions.forEach(
            (value) => {
                newQuiz.addQuestion(
                    new MultipleChoiceQuestion(
                        uuid.v4(),
                        quizID,
                        value.questionTitle,
                        crypto.randomInt(0,4),
                        value.options,
                        true,
                        value.correctOptionId
                    )
                )
            }
        )
        await newQuiz.shuffleQuestions()
        await this.quizRepository.save(
            newQuiz
        )
        return newQuiz
    }
    public async getQuizResult(
        attemptID: string
    ){
        const attemptResult = await this.quizAttemptRepository.findAttemptByID(
            attemptID
        )
        const attemptsResult = await this.quizAttemptRepository.getAttempts(attemptResult.studentID,attemptID);
        const quiz = await this.quizRepository.findQuizByID(attemptResult.quizID)
        let dto: QuizResultDTO = {
            quizID: attemptResult.quizID,
            timeTaken: attemptResult.timeTaken,
            attempts: attemptsResult.length,
            score: attemptResult.totalScore ? attemptResult.totalScore : 0,
            feedback: attemptResult.feedback,
            status: (attemptResult.totalScore ? attemptResult.totalScore : 0) >= quiz.minPassScore ? QuizResultStatus.PASSED : QuizResultStatus.FAILED
        }
        return dto
    }
    public async analyzeStatistics(
        quizID: string
    ){
        return await this.quizAttemptRepository.getQuizStats(quizID)
    }
    public async deleteQuiz(
        id: string
    ){
        await this.quizRepository.delete(
            id
        )
    }
}
import { db } from "../config/database";
import { QuizStatsDTO } from "../dto/quiz_stats";
import { IQuizAttemptRepository } from "../interface/repository/quiz_attempt";
import { QuizAttempt } from "../model/entity/quiz_attempt";

export class QuizAttemptRepository implements IQuizAttemptRepository{
    public async getAttempts(
        student: string,
        quizID: string
    ){
        const attemptsResult = await db.manyOrNone(
            'SELECT attemptID, answers, "totalScore", feedback FROM quiz_attempt WHERE studentID = ${studentID} AND quizID = ${quizID}',
            {
                studentID: student,
                quizID: quizID
            }
        )
        let attempts: QuizAttempt[] = []
        attemptsResult.forEach(
            value => {
                attempts.push(
                    new QuizAttempt(
                        value.attemptID,
                        student,
                        quizID,
                        JSON.parse(value.answers),
                        value.totalScore ?? undefined,
                        value.feedback ?? undefined
                    )
                )
            }
        )
        return attempts
    }
    public async findAttemptByID(
        id: string
    ){
        const attemptResult = await db.oneOrNone(
            'SELECT answers, "studentID", "quizID", "totalScore", feedback FROM quiz_attempt WHERE attemptID = ${attemptID}',
            {
                attemptID: id
            }
        )
        return new QuizAttempt(
            id,
            attemptResult.studentID,
            attemptResult.quizID,
            JSON.parse(attemptResult.answers),
            attemptResult.totalScore ?? undefined,
            attemptResult.feedback ?? undefined
        )
    }
    public async save(
        quiz: QuizAttempt
    ){
        const attemptDetail = {
            attemptID: quiz.attemptID,
            studentID: quiz.studentID,
            quizID: quiz.quizID,
            answers: quiz.answers,
            totalScore: quiz.totalScore ?? null,
            feedback: quiz.feedback ?? null
        }
        const attemptResult = await db.oneOrNone(
            'SELECT 1 FROM quiz_attempt WHERE id = ${id}',
            {
                id: quiz.attemptID
            }
        )
        if (attemptResult === null){
            await db.any(
                'INSERT INTO quiz_attempt(${column_names:name}) VALUES (${values:list})',
                {
                    column_names: Object.keys(attemptDetail),
                    values: Object.values(attemptDetail),
                }
            )
        }
        else {
            await db.any(
                'UPDATE quiz_attempt SET answers = ${answers}, "totalScore" = ${totalScore}, feedback = ${feedback} WHERE attemptID = ${attemptID}',
                {
                    ...attemptDetail
                }
            )
        }
    }
    public async getQuizStats(
        quizID: string
    ){
        const returnData = await db.oneOrNone(
            'SELECT SUM(1) as attempts, SUM(DISTINCT studentID) AS participants, AVG(COALESCE("totalScore",0)) AS average, MAX("totalScore") as highest, MIN("totalScore") as lowest FROM quiz_attempt WHERE "quizID" = ${quizID}',
            {
                quizID: quizID
            }
        )
        const totalAttempts = returnData.attempts
        const participants = returnData.participants
        const averageScore = returnData.average
        const highestScore = returnData.highest
        const lowestScore = returnData.lowest
        const passRate = (await db.oneOrNone(
            'SELECT SUM(1) as sum FROM quiz_attempt WHERE "quizID" = ${quizID} AND feedback = ${feedback}',{
                quizID: quizID,
                feedback: "Excellent!"
            }
        )) / totalAttempts
        const stats: QuizStatsDTO = {
            quizID: quizID,
            totalAttempts: totalAttempts,
            participants: participants,
            averageScore: averageScore,
            highestScore: highestScore,
            lowestScore: lowestScore,
            passRate: passRate
        }
        return stats
    }
    public async delete(
        id: string
    ){
        await db.any(
            'DELETE FROM quiz_attempt WHERE id = ${id}',
            {
                id: id
            }
        )
    }
}
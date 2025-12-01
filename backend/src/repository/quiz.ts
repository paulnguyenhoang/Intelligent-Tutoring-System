import { db } from "../config/database";
import { IQuizRepository } from "../interface/repository/quiz";
import { MultipleChoiceQuestion } from "../model/entity/multiple_choice_question";
import { Quiz } from "../model/entity/quiz";

export class QuizRepository implements IQuizRepository{
    public async findQuizByInstructor(
        instructor: string
    ){
        const quizResult = await db.many(
            'SELECT quiz.*, FROM quiz INNER JOIN instructor_quiz ON instructor_quiz.quiz = quiz.id AND instructor_quiz.instructor = ${instructorID}',
            {
                instructorID: instructor
            }
        )
        
        let quizzes = []
        for (const val of quizResult){
            let questions = []
            const questionResult = await db.many(
                'SELECT id, title, difficulty, options, "isMultiSelect" FROM question WHERE quiz = ${quiz}',
                {
                    quiz: val.id
                }
            )
            for (const question of questionResult){
                questions.push(
                    new MultipleChoiceQuestion(
                        question.id,
                        val.id,
                        question.title,
                        question.difficulty,
                        question.options,
                        question.isMultiSelect 
                    )
                )
            }
            quizzes.push(
                new Quiz(
                    val.id,
                    instructor,
                    val.title,
                    val.timeLimit,
                    val.minPassScore,
                    val.maxAttempts,
                    val.status,
                    questions
                )
            )
        }
        return quizzes
    }
    public async findQuizByID(
        id: string
    ){
        const quizResult = await db.oneOrNone(
            'SELECT quiz.*, instructor_quiz.instructor FROM quiz INNER JOIN instructor_quiz ON quiz.id = ${id}',
            {
                id: id
            }
        )
        let questions = []
        const questionResult = await db.many(
            'SELECT id, title, difficulty, options, "isMultiSelect" FROM question WHERE quiz = ${quiz}',
            {
                quiz: quizResult.id
            }
        )
        for (const question of questionResult){
            questions.push(
                new MultipleChoiceQuestion(
                    question.id,
                    quizResult.id,
                    question.title,
                    question.difficulty,
                    question.options,
                    question.isMultiSelect 
                )
            )
        }
        return new Quiz(
            quizResult.id,
            quizResult.instructor,
            quizResult.title,
            quizResult.timeLimit,
            quizResult.minPassScore,
            quizResult.maxAttempts,
            quizResult.status,
            questions
        )
    }
    public async save(
        quiz: Quiz
    ){
        const quizDetail = {
            id: quiz.id,
            title: quiz.title,
            timeLimit: quiz.timeLimit,
            minPassScore: quiz.minPassScore,
            maxAttempts: quiz.maxAttempts,
            status: quiz.status
        }
        const quizResult = await db.oneOrNone(
            'SELECT 1 FROM quiz WHERE id = ${id}',
            {
                id: quiz.id
            }
        )
        if (quizResult === null){
            await db.any(
                'INSERT INTO quiz VALUES (${values:list})',
                {
                    values: Object.values(quizDetail),
                }
            )
            await db.any(
                'INSERT INTO instructor_quiz VALUES(${values:list})',
                {
                    values: [quiz.instructor, quiz.id]
                }
            )
            for (const question of quiz.questions){
                const questionDetail = {
                    id: question.id,
                    quiz: quiz.id,
                    title: question.content,
                    difficulty: question.difficulty,
                    correctOptionId: (question as MultipleChoiceQuestion).correctOptionId,
                    options: (question as MultipleChoiceQuestion).options,
                    isMultiSelect: (question as MultipleChoiceQuestion).isMultiSelect
                }
                await db.any(
                    'INSERT INTO question VALUES (${values:list})',
                    {
                        values: Object.values(questionDetail)
                    }
                )
            }
        }
        else {
            await db.any(
                'UPDATE quiz SET id = ${id}, title = ${title}, "timeLimit" = ${timeLimit}, "minPassScore" = ${minPassScore}, "maxAttempts" = ${maxAttempts}, status = ${status}',
                {
                    ...quizDetail
                }
            )
            for (const question of quiz.questions){
                const questionDetail = {
                    id: question.id,
                    quiz: quiz.id,
                    title: question.content,
                    difficulty: question.difficulty,
                    correctOptionId: (question as MultipleChoiceQuestion).correctOptionId,
                    options: (question as MultipleChoiceQuestion).options,
                    isMultiSelect: (question as MultipleChoiceQuestion).isMultiSelect
                }
                await db.any(
                    'UPDATE question SET id = ${id}, quiz = ${quiz}, title = ${title}, difficulty = ${difficulty}, correctOptionId = ${correctOptionId}, options = ${options}, "isMultiSelect" = ${isMultiSelect}',
                    {
                        ...questionDetail
                    }
                )
            }
        }
    }
}
import { db } from "../config/database";
import { Question } from "../interface/abstract/question";
import { IQuestionRepository } from "../interface/repository/question";
import { MultipleChoiceQuestion } from "../model/entity/multiple_choice_question";

export class QuestionRepository implements IQuestionRepository{
    public async getQuestion(
        id: string
    ){
        const questionResult = await db.oneOrNone(
            'SELECT * FROM question WHERE id = ${id}',
            {
                id: id
            }
        )
        return new MultipleChoiceQuestion(
            questionResult.id,
            questionResult.quiz,
            questionResult.title,
            questionResult.difficulty,
            questionResult.options,
            questionResult.isMultiSelect,
            questionResult.correctOptionId,
            questionResult.tags,
            questionResult.hint
        )
    }
    public async getQuestions(
        quizID: string
    ){
        const questionsResult = await db.manyOrNone(
            'SELECT * FROM question WHERE quiz = ${quizID}',
            {
                quizID: quizID
            }
        )
        let questions = questionsResult.map(
            (val) => {
                return new MultipleChoiceQuestion(
                    val.id,
                    val.quiz,
                    val.title,
                    val.difficulty,
                    val.options,
                    val.isMultiSelect,
                    val.correctOptionId,
                    val.tags,
                    val.hint
                )
            }
        )
        return questions
    }
    public async save(
        question: Question
    ){
        const questionResult = await db.oneOrNone(
            'SELECT 1 FROM question WHERE id = ${id} LIMIT 1',
            {
                id: question.id
            }
        )
        let questionDetail = {
            id: question.id,
            quiz: question.quizID,
            title: question.content,
            difficulty: question.difficulty,
            correctOptionId: (question as MultipleChoiceQuestion).correctOptionId,
            options: (question as MultipleChoiceQuestion).options,
            isMultiSelect: (question as MultipleChoiceQuestion).isMultiSelect,
            tags: (question as MultipleChoiceQuestion).tags ?? null,
            hint: question.hint ?? null
        }
        if (questionResult === null){
            await db.any(
                'INSERT INTO question(${column_names:name}) VALUES (${values:list})',
                {
                    column_names: Object.keys(questionDetail),
                    values: Object.values(questionDetail)
                }
            )
        }
        else {
            await db.any(
                'UPDATE question SET quiz = ${quiz}, title = ${title}, difficulty = ${difficulty}, "correctOptionId" = ${correctOptionId}, options = ${options}, "isMultiSelect" = ${isMultiSelect}, tags = ${tags}, hint = ${hint} WHERE id = ${id}',
                {
                    ...questionDetail
                }
            )
        }
    }
    public async delete(
        id: string
    ){
        await db.any(
            'DELETE FROM question WHERE id = ${id}',
            {
                id: id
            }
        )
    }
}
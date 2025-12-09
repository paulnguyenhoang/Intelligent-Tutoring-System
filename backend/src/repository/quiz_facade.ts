import { db } from "../config/database";
import crypto from "crypto";

export type QuizRow = {
  id: string;
  title: string;
  timeLimit: number | null;
  passingScore: number | null;
};

export type QuestionRow = {
  id: string;
  quiz: string;
  title: string;
  options: string[];
  correctOptionId: number[];
  hint: string | null;
};

export type AttemptRow = {
  attemptID: string;
  studentID: string;
  quizID: string;
  answers: any;
  totalScore: number | null;
  feedback: string | null;
  completedAt: string | null;
};

export interface IQuizFacadeRepository {
  listQuizzes(): Promise<QuizRow[]>;
  listQuestionsByQuiz(): Promise<QuestionRow[]>;
  getQuiz(id: string): Promise<QuizRow | null>;
  getQuestionsByQuiz(id: string): Promise<QuestionRow[]>;
  createQuiz(quiz: QuizRow, questions: QuestionRow[]): Promise<void>;
  updateQuiz(id: string, quiz: QuizRow, questions: QuestionRow[]): Promise<void>;
  deleteQuiz(id: string): Promise<void>;
  resolveStudentId(username: string): Promise<string | null>;
  insertAttempt(attempt: AttemptRow): Promise<void>;
  latestAttempt(quizID: string, studentID: string): Promise<AttemptRow | null>;
  questionCount(quizID: string): Promise<number>;
}

export class QuizFacadeRepository implements IQuizFacadeRepository {
  public async listQuizzes(): Promise<QuizRow[]> {
    return db.manyOrNone('SELECT id, title, "timeLimit", "minPassScore" as "passingScore" FROM quiz');
  }

  public async listQuestionsByQuiz(): Promise<QuestionRow[]> {
    return db.manyOrNone('SELECT id, quiz, title, options, "correctOptionId", hint FROM question ORDER BY quiz');
  }

  public async getQuiz(id: string): Promise<QuizRow | null> {
    return db.oneOrNone(
      'SELECT id, title, "timeLimit", "minPassScore" as "passingScore" FROM quiz WHERE id = ${id}',
      { id }
    );
  }

  public async getQuestionsByQuiz(id: string): Promise<QuestionRow[]> {
    return db.manyOrNone(
      'SELECT id, quiz, title, options, "correctOptionId", hint FROM question WHERE quiz = ${quiz}',
      { quiz: id }
    );
  }

  public async createQuiz(quiz: QuizRow, questions: QuestionRow[]): Promise<void> {
    await db.tx(async (t) => {
      await t.none(
        'INSERT INTO quiz(id, title, "timeLimit", "minPassScore", "maxAttempts", status) VALUES(${id}, ${title}, ${timeLimit}, ${passingScore}, ${maxAttempts}, ${status})',
        {
          id: quiz.id,
          title: quiz.title,
          timeLimit: quiz.timeLimit ?? 30,
          passingScore: quiz.passingScore ?? 70,
          maxAttempts: 3,
          status: 1,
        }
      );
      for (const q of questions) {
        await t.none(
          'INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint) VALUES(${id}, ${quiz}, ${title}, ${difficulty}, ${correctOptionId}, ${options}, ${isMultiSelect}, ${tags}, ${hint})',
          {
            ...q,
            difficulty: 1,
            isMultiSelect: false,
            tags: null,
          }
        );
      }
    });
  }

  public async updateQuiz(id: string, quiz: QuizRow, questions: QuestionRow[]): Promise<void> {
    await db.tx(async (t) => {
      await t.none(
        'UPDATE quiz SET title = ${title}, "timeLimit" = ${timeLimit}, "minPassScore" = ${passingScore} WHERE id = ${id}',
        {
          id,
          title: quiz.title,
          timeLimit: quiz.timeLimit ?? 30,
          passingScore: quiz.passingScore ?? 70,
        }
      );
      await t.none("DELETE FROM question WHERE quiz = ${quiz}", { quiz: id });
      for (const q of questions) {
        await t.none(
          'INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint) VALUES(${id}, ${quiz}, ${title}, ${difficulty}, ${correctOptionId}, ${options}, ${isMultiSelect}, ${tags}, ${hint})',
          {
            ...q,
            difficulty: 1,
            isMultiSelect: false,
            tags: null,
          }
        );
      }
    });
  }

  public async deleteQuiz(id: string): Promise<void> {
    await db.tx(async (t) => {
      await t.none("DELETE FROM question WHERE quiz = ${quiz}", { quiz: id });
      await t.none("DELETE FROM quiz WHERE id = ${id}", { id });
    });
  }

  public async resolveStudentId(username: string): Promise<string | null> {
    const row = await db.oneOrNone(
      'SELECT s."studentID" FROM "user" u INNER JOIN student s ON u.id = s.id WHERE u.username = ${username}',
      { username }
    );
    return row?.studentID ?? null;
  }

  public async insertAttempt(attempt: AttemptRow): Promise<void> {
    await db.none(
      'INSERT INTO quiz_attempt("attemptID", "studentID", "quizID", answers, "totalScore", feedback, "completedAt") VALUES(${attemptID}, ${studentID}, ${quizID}, ${answers}, ${totalScore}, ${feedback}, ${completedAt})',
      attempt
    );
  }

  public async latestAttempt(quizID: string, studentID: string): Promise<AttemptRow | null> {
    return db.oneOrNone(
      'SELECT "attemptID", "studentID", "quizID", answers, "totalScore", feedback, "completedAt" FROM quiz_attempt WHERE "quizID" = ${quizID} AND "studentID" = ${studentID} ORDER BY "completedAt" DESC NULLS LAST, "attemptID" DESC LIMIT 1',
      { quizID, studentID }
    );
  }

  public async questionCount(quizID: string): Promise<number> {
    const row = await db.one("SELECT COUNT(1) AS count FROM question WHERE quiz = ${quizID}", { quizID });
    return Number(row.count) || 0;
  }

  public static newQuizRow(title: string, timeLimit?: number, passingScore?: number): QuizRow {
    return {
      id: crypto.randomUUID(),
      title,
      timeLimit: timeLimit ?? 30,
      passingScore: passingScore ?? 70,
    };
  }
}


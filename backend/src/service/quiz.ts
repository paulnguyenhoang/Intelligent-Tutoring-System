import crypto from "crypto";
import { db } from "../config/database";
import { IQuizReadService, IQuizWriteService } from "../interface/service/quiz";

export type FrontendQuizQuestion = {
  id?: string;
  content: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  hint?: string;
  feedback?: string;
};

export type FrontendQuiz = {
  id?: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: FrontendQuizQuestion[];
};

const letters = ["A", "B", "C", "D"] as const;

function optionsObjectToArray(options: FrontendQuizQuestion["options"]): string[] {
  return letters.map((k) => options[k]);
}

function optionsArrayToObject(options: string[]): FrontendQuizQuestion["options"] {
  const obj: any = {};
  letters.forEach((k, idx) => {
    obj[k] = options[idx] ?? "";
  });
  return obj;
}

function correctLetterToIndex(letter: "A" | "B" | "C" | "D"): number[] {
  return [letters.indexOf(letter)];
}

function indexToLetter(indices?: number[]): "A" | "B" | "C" | "D" {
  const idx = Array.isArray(indices) && indices.length > 0 ? indices[0] : 0;
  return letters[idx] as "A" | "B" | "C" | "D";
}

export class QuizService implements IQuizReadService, IQuizWriteService {
  private async resolveStudentIdFromUsername(username: string): Promise<string | null> {
    const row = await db.oneOrNone(
      'SELECT s."studentID" FROM "user" u INNER JOIN student s ON u.id = s.id WHERE u.username = ${username}',
      { username }
    );
    return row?.studentID ?? null;
  }

  public async list(): Promise<FrontendQuiz[]> {
    const quizzes = await db.manyOrNone('SELECT id, title, "timeLimit", "minPassScore" as "passingScore" FROM quiz');
    const questionsByQuiz = await db.manyOrNone(
      'SELECT id, quiz, title, options, "correctOptionId", hint FROM question ORDER BY quiz'
    );

    const grouped: Record<string, any[]> = {};
    questionsByQuiz.forEach((q) => {
      grouped[q.quiz] = grouped[q.quiz] ?? [];
      grouped[q.quiz].push({
        id: q.id,
        content: q.title,
        options: optionsArrayToObject(q.options),
        correctAnswer: indexToLetter(q.correctOptionId),
        hint: q.hint,
        feedback: "",
      });
    });

    return quizzes.map((q: any) => ({
      id: q.id,
      title: q.title,
      description: "",
      timeLimit: q.timeLimit,
      passingScore: q.passingScore,
      questions: grouped[q.id] ?? [],
    }));
  }

  public async getOne(id: string): Promise<FrontendQuiz | null> {
    const quiz = await db.oneOrNone(
      'SELECT id, title, "timeLimit", "minPassScore" as "passingScore" FROM quiz WHERE id = ${id}',
      { id }
    );
    if (!quiz) return null;
    const questions = await db.manyOrNone(
      'SELECT id, quiz, title, options, "correctOptionId", hint FROM question WHERE quiz = ${quiz}',
      { quiz: quiz.id }
    );
    return {
      id: quiz.id,
      title: quiz.title,
      description: "",
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      questions: questions.map((q) => ({
        id: q.id,
        content: q.title,
        options: optionsArrayToObject(q.options),
        correctAnswer: indexToLetter(q.correctOptionId),
        hint: q.hint,
        feedback: "",
      })),
    };
  }

  private buildInsertQuestions(quizID: string, questions: FrontendQuizQuestion[]) {
    return questions.map((q) => ({
      id: q.id ?? crypto.randomUUID(),
      quiz: quizID,
      title: q.content,
      difficulty: 1,
      correctOptionId: correctLetterToIndex(q.correctAnswer),
      options: optionsObjectToArray(q.options),
      isMultiSelect: false,
      tags: null,
      hint: q.hint ?? null,
    }));
  }

  public async create(body: FrontendQuiz): Promise<FrontendQuiz> {
    const quizID = crypto.randomUUID();
    await db.tx(async (t) => {
      await t.none(
        'INSERT INTO quiz(id, title, "timeLimit", "minPassScore", "maxAttempts", status) VALUES(${id}, ${title}, ${timeLimit}, ${minPassScore}, ${maxAttempts}, ${status})',
        {
          id: quizID,
          title: body.title,
          timeLimit: body.timeLimit ?? 30,
          minPassScore: body.passingScore ?? 70,
          maxAttempts: 3,
          status: 1,
        }
      );
      const rows = this.buildInsertQuestions(quizID, body.questions);
      for (const q of rows) {
        await t.none(
          'INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint) VALUES(${id}, ${quiz}, ${title}, ${difficulty}, ${correctOptionId}, ${options}, ${isMultiSelect}, ${tags}, ${hint})',
          q
        );
      }
    });
    const created = await this.getOne(quizID);
    return created!;
  }

  public async update(id: string, body: FrontendQuiz): Promise<FrontendQuiz | null> {
    const exists = await db.oneOrNone("SELECT 1 FROM quiz WHERE id = ${id}", { id });
    if (!exists) return null;
    await db.tx(async (t) => {
      await t.none(
        'UPDATE quiz SET title = ${title}, "timeLimit" = ${timeLimit}, "minPassScore" = ${minPassScore} WHERE id = ${id}',
        {
          id,
          title: body.title,
          timeLimit: body.timeLimit ?? 30,
          minPassScore: body.passingScore ?? 70,
        }
      );
      await t.none("DELETE FROM question WHERE quiz = ${quiz}", { quiz: id });
      const rows = this.buildInsertQuestions(id, body.questions);
      for (const q of rows) {
        await t.none(
          'INSERT INTO question(id, quiz, title, difficulty, "correctOptionId", options, "isMultiSelect", tags, hint) VALUES(${id}, ${quiz}, ${title}, ${difficulty}, ${correctOptionId}, ${options}, ${isMultiSelect}, ${tags}, ${hint})',
          q
        );
      }
    });
    return this.getOne(id);
  }

  public async remove(id: string): Promise<void> {
    await db.tx(async (t) => {
      await t.none("DELETE FROM question WHERE quiz = ${quiz}", { quiz: id });
      await t.none("DELETE FROM quiz WHERE id = ${id}", { id });
    });
  }

  public async submit(
    id: string,
    username: string,
    answers: Record<string, string>
  ): Promise<{ correct: number; total: number; percentage: number; passed: boolean; feedback: string; attemptId: string; completedAt: string } | null> {
    const studentId = await this.resolveStudentIdFromUsername(username);
    if (!studentId) return null;

    const quizRow = await db.oneOrNone(
      'SELECT id, "minPassScore", "timeLimit" FROM quiz WHERE id = ${id}',
      { id }
    );
    if (!quizRow) return null;

    const questions = await db.manyOrNone(
      'SELECT id, "correctOptionId" FROM question WHERE quiz = ${quiz}',
      { quiz: id }
    );
    if (questions.length === 0) return null;

    let correct = 0;
    for (const q of questions) {
      const letter = answers[q.id];
      if (letter && letters.indexOf(letter as any) === (q.correctOptionId?.[0] ?? -1)) {
        correct++;
      }
    }
    const total = questions.length;
    const percentage = (correct / total) * 100;
    const passed = percentage >= (quizRow.minPassScore ?? 70);
    const feedback = passed ? "Passed" : "Try again";
    const attemptID = crypto.randomUUID();
    const completedAt = new Date().toISOString();

    await db.none(
      'INSERT INTO quiz_attempt("attemptID", "studentID", "quizID", answers, "totalScore", feedback, "completedAt") VALUES(${attemptID}, ${studentID}, ${quizID}, ${answers}, ${totalScore}, ${feedback}, ${completedAt})',
      {
        attemptID,
        studentID: studentId,
        quizID: id,
        answers: JSON.stringify(answers),
        totalScore: correct,
        feedback,
        completedAt,
      }
    );

    return { correct, total, percentage, passed, feedback, attemptId: attemptID, completedAt };
  }

  public async completion(
    quizID: string,
    username: string
  ): Promise<{ quizId: string; score: number; total: number; percentage: number; passed: boolean; completedAt: string | null } | null> {
    const studentId = await this.resolveStudentIdFromUsername(username);
    if (!studentId) return null;
    const attempt = await db.oneOrNone(
      'SELECT "attemptID", "totalScore", answers, "completedAt" FROM quiz_attempt WHERE "quizID" = ${quizID} AND "studentID" = ${studentID} ORDER BY "completedAt" DESC NULLS LAST, "attemptID" DESC LIMIT 1',
      { quizID, studentID: studentId }
    );
    if (!attempt) return null;
    const questionCount = await db.one(
      "SELECT COUNT(1) AS count FROM question WHERE quiz = ${quizID}",
      { quizID }
    );
    const total = Number(questionCount.count) || 0;
    const score = attempt.totalScore ?? 0;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const quizRow = await db.oneOrNone(
      'SELECT "minPassScore" FROM quiz WHERE id = ${id}',
      { id: quizID }
    );
    const passed = percentage >= (quizRow?.minPassScore ?? 70);
    return {
      quizId: quizID,
      score,
      total,
      percentage,
      passed,
      completedAt: attempt.completedAt ? new Date(attempt.completedAt).toISOString() : null,
    };
  }
}
import { Request, Response } from "express";
import { constants } from "http2";
import uuid from "uuid";
import { db } from "../config/database";

type FrontendQuizQuestion = {
  id?: string;
  content: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  hint?: string;
  feedback?: string;
};

type FrontendQuiz = {
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

export class QuizController {
  private async resolveStudentIdFromUsername(username: string): Promise<string | null> {
    const row = await db.oneOrNone(
      'SELECT s."studentID" FROM "user" u INNER JOIN student s ON u.id = s.id WHERE u.username = ${username}',
      { username }
    );
    return row?.studentID ?? null;
  }

  public list = async (_req: Request, res: Response) => {
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
        feedback: "", // no column in schema
      });
    });

    const payload = quizzes.map((q: any) => ({
      id: q.id,
      title: q.title,
      description: "",
      timeLimit: q.timeLimit,
      passingScore: q.passingScore,
      questions: grouped[q.id] ?? [],
    }));

    res.status(constants.HTTP_STATUS_OK).json(payload);
  };

  public getOne = async (req: Request<{ id: string }>, res: Response) => {
    const quiz = await db.oneOrNone(
      'SELECT id, title, "timeLimit", "minPassScore" as "passingScore" FROM quiz WHERE id = ${id}',
      { id: req.params.id }
    );
    if (!quiz) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    const questions = await db.manyOrNone(
      'SELECT id, quiz, title, options, "correctOptionId", hint FROM question WHERE quiz = ${quiz}',
      { quiz: quiz.id }
    );
    const payload = {
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
    res.status(constants.HTTP_STATUS_OK).json(payload);
  };

  private buildInsertQuestions(quizID: string, questions: FrontendQuizQuestion[]) {
    return questions.map((q) => ({
      id: q.id ?? uuid.v4(),
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

  public create = async (req: Request, res: Response) => {
    const body = req.body as FrontendQuiz;
    if (!body?.title || !Array.isArray(body.questions) || body.questions.length === 0) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Invalid payload" });
      return;
    }
    const quizID = uuid.v4();
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
    return this.getOne({ ...req, params: { id: quizID } } as any, res);
  };

  public update = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    const body = req.body as FrontendQuiz;
    const exists = await db.oneOrNone("SELECT 1 FROM quiz WHERE id = ${id}", { id });
    if (!exists) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    if (!body?.title || !Array.isArray(body.questions) || body.questions.length === 0) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Invalid payload" });
      return;
    }
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
    return this.getOne(req, res);
  };

  public remove = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    await db.tx(async (t) => {
      await t.none("DELETE FROM question WHERE quiz = ${quiz}", { quiz: id });
      await t.none("DELETE FROM quiz WHERE id = ${id}", { id });
    });
    res.status(constants.HTTP_STATUS_NO_CONTENT).send();
  };

  public submit = async (
    req: Request<{ id: string }, {}, { answers: Record<string, string>; studentId?: string }>,
    res: Response
  ) => {
    const id = req.params.id;
    const username = req.body?.studentId; // frontend sends username; resolve to studentID
    if (!username) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Missing studentId" });
      return;
    }
    const studentId = await this.resolveStudentIdFromUsername(username);
    if (!studentId) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Student not found" });
      return;
    }
    const quizRow = await db.oneOrNone(
      'SELECT id, "minPassScore", "timeLimit" FROM quiz WHERE id = ${id}',
      { id }
    );
    if (!quizRow) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    const questions = await db.manyOrNone(
      'SELECT id, "correctOptionId" FROM question WHERE quiz = ${quiz}',
      { quiz: id }
    );
    if (questions.length === 0) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    const answers = req.body?.answers ?? {};
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
    const attemptID = uuid.v4();

    await db.none(
      'INSERT INTO quiz_attempt("attemptID", "studentID", "quizID", answers, "totalScore", feedback) VALUES(${attemptID}, ${studentID}, ${quizID}, ${answers}, ${totalScore}, ${feedback})',
      {
        attemptID,
        studentID: studentId,
        quizID: id,
        answers: JSON.stringify(answers),
        totalScore: correct, // store number of correct answers
        feedback,
      }
    );

    res
      .status(constants.HTTP_STATUS_OK)
      .json({ correct, total, percentage, passed, feedback, attemptId: attemptID, completedAt: new Date().toISOString() });
  };

  public completion = async (
    req: Request<{ id: string }, {}, {}, { studentId?: string }>,
    res: Response
  ) => {
    const quizID = req.params.id;
    const username = req.query.studentId;
    if (!username) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Missing studentId" });
      return;
    }
    const studentId = await this.resolveStudentIdFromUsername(username);
    if (!studentId) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Student not found" });
      return;
    }
    const attempt = await db.oneOrNone(
      'SELECT "attemptID", "totalScore", answers FROM quiz_attempt WHERE "quizID" = ${quizID} AND "studentID" = ${studentID} ORDER BY "attemptID" DESC LIMIT 1',
      { quizID, studentID: studentId }
    );
    if (!attempt) {
      res.status(constants.HTTP_STATUS_OK).json(null);
      return;
    }
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
    res.status(constants.HTTP_STATUS_OK).json({
      quizId: quizID,
      score,
      total,
      percentage,
      passed,
      completedAt: null,
    });
  };
}


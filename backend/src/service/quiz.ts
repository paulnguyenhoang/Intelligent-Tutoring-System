import crypto from "crypto";
import { IQuizReadService, IQuizWriteService } from "../interface/service/quiz";
import {
  AttemptRow,
  IQuizFacadeRepository,
  QuestionRow,
  QuizFacadeRepository,
  QuizRow,
} from "../repository/quiz_facade";

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
  public constructor(private repo: IQuizFacadeRepository = new QuizFacadeRepository()) {}

  public async list(): Promise<FrontendQuiz[]> {
    const quizzes = await this.repo.listQuizzes();
    const questionsByQuiz = await this.repo.listQuestionsByQuiz();

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
    const quiz = await this.repo.getQuiz(id);
    if (!quiz) return null;
    const questions = await this.repo.getQuestionsByQuiz(quiz.id);
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
    const quizRow: QuizRow = {
      id: quizID,
      title: body.title,
      timeLimit: body.timeLimit ?? 30,
      passingScore: body.passingScore ?? 70,
    };
    const rows = this.buildInsertQuestions(quizID, body.questions);
    await this.repo.createQuiz(quizRow, rows);
    const created = await this.getOne(quizID);
    return created!;
  }

  public async update(id: string, body: FrontendQuiz): Promise<FrontendQuiz | null> {
    const exists = await this.repo.getQuiz(id);
    if (!exists) return null;
    const quizRow: QuizRow = {
      id,
      title: body.title,
      timeLimit: body.timeLimit ?? 30,
      passingScore: body.passingScore ?? 70,
    };
    const rows = this.buildInsertQuestions(id, body.questions);
    await this.repo.updateQuiz(id, quizRow, rows);
    return this.getOne(id);
  }

  public async remove(id: string): Promise<void> {
    await this.repo.deleteQuiz(id);
  }

  public async submit(
    id: string,
    username: string,
    answers: Record<string, string>
  ): Promise<{ correct: number; total: number; percentage: number; passed: boolean; feedback: string; attemptId: string; completedAt: string } | null> {
    const studentId = await this.repo.resolveStudentId(username);
    if (!studentId) return null;

    const quizRow = await this.repo.getQuiz(id);
    if (!quizRow) return null;

    const questions = await this.repo.getQuestionsByQuiz(id);
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
    const passed = percentage >= (quizRow.passingScore ?? 70);
    const feedback = passed ? "Passed" : "Try again";
    const attemptID = crypto.randomUUID();
    const completedAt = new Date().toISOString();

    const attemptRow: AttemptRow = {
      attemptID,
      studentID: studentId,
      quizID: id,
      answers: JSON.stringify(answers),
      totalScore: correct,
      feedback,
      completedAt,
    };
    await this.repo.insertAttempt(attemptRow);

    return { correct, total, percentage, passed, feedback, attemptId: attemptID, completedAt };
  }

  public async completion(
    quizID: string,
    username: string
  ): Promise<{ quizId: string; score: number; total: number; percentage: number; passed: boolean; completedAt: string | null } | null> {
    const studentId = await this.repo.resolveStudentId(username);
    if (!studentId) return null;
    const attempt = await this.repo.latestAttempt(quizID, studentId);
    if (!attempt) return null;
    const total = await this.repo.questionCount(quizID);
    const score = attempt.totalScore ?? 0;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const quizRow = await this.repo.getQuiz(quizID);
    const passed = percentage >= (quizRow?.passingScore ?? 70);
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
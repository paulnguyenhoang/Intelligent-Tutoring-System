import { Request, Response } from "express";
import { constants } from "http2";
import { FrontendQuiz, QuizService } from "../service/quiz";
import { IQuizReadService, IQuizWriteService } from "../interface/service/quiz";

export class QuizController {
  public constructor(private quizService: IQuizReadService & IQuizWriteService) {}

  public list = async (_req: Request, res: Response) => {
    const quizzes = await this.quizService.list();
    res.status(constants.HTTP_STATUS_OK).json(quizzes);
  };

  public getOne = async (req: Request<{ id: string }>, res: Response) => {
    const quiz = await this.quizService.getOne(req.params.id);
    if (!quiz) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    res.status(constants.HTTP_STATUS_OK).json(quiz);
  };

  public create = async (req: Request, res: Response) => {
    const body = req.body as FrontendQuiz;
    if (!body?.title || !Array.isArray(body.questions) || body.questions.length === 0) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Invalid payload" });
      return;
    }
    const created = await this.quizService.create(body);
    res.status(constants.HTTP_STATUS_CREATED).json(created);
  };

  public update = async (req: Request<{ id: string }>, res: Response) => {
    const body = req.body as FrontendQuiz;
    if (!body?.title || !Array.isArray(body.questions) || body.questions.length === 0) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Invalid payload" });
      return;
    }
    const updated = await this.quizService.update(req.params.id, body);
    if (!updated) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    res.status(constants.HTTP_STATUS_OK).json(updated);
  };

  public remove = async (req: Request<{ id: string }>, res: Response) => {
    await this.quizService.remove(req.params.id);
    res.status(constants.HTTP_STATUS_NO_CONTENT).send();
  };

  public submit = async (
    req: Request<{ id: string }, {}, { answers: Record<string, string>; studentId?: string }>,
    res: Response
  ) => {
    const username = req.body?.studentId;
    if (!username) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Missing studentId" });
      return;
    }
    const result = await this.quizService.submit(req.params.id, username, req.body?.answers ?? {});
    if (!result) {
      res.status(constants.HTTP_STATUS_NOT_FOUND).json({ message: "Quiz not found" });
      return;
    }
    res.status(constants.HTTP_STATUS_OK).json(result);
  };

  public completion = async (
    req: Request<{ id: string }, {}, {}, { studentId?: string }>,
    res: Response
  ) => {
    const username = req.query.studentId;
    if (!username) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ message: "Missing studentId" });
      return;
    }
    const completion = await this.quizService.completion(req.params.id, username);
    res.status(constants.HTTP_STATUS_OK).json(completion);
  };
}


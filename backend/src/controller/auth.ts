import { Request, Response } from "express";
import { IAuthService } from "../interface/service/auth";
import { UserDTO } from "../dto/user";
import { constants } from "http2";
import { UserVerifyDTO } from "../dto/user_verify";
import { IJWTService } from "../interface/service/jwt";

export class AuthController {
  public authService: IAuthService;
  public jwtService: IJWTService;
  public constructor(authService: IAuthService, jwtService: IJWTService) {
    this.authService = authService;
    this.jwtService = jwtService;
  }
  public LoginController = async (
    req: Request<
      {},
      {},
      {
        username: string;
        password: string;
        role: "student" | "instructor";
      }
    >,
    res: Response
  ) => {
    const result = await this.authService.authenticate(
      req.body.username,
      req.body.password,
      req.body.role
    );
    if (result !== null) {
      res.status(constants.HTTP_STATUS_OK).json({
        token: this.jwtService.createToken(result),
      });
      return;
    }
    res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({ error: "Invalid credentials" });
    return;
  };
  public RegisterController = async (req: Request<{}, {}, UserDTO>, res: Response) => {
    await this.authService.register(req.body);
    res.status(constants.HTTP_STATUS_OK).json("ok");
    return;
  };

  public VerifyUserController = async (req: Request<{}, {}, {}, UserVerifyDTO>, res: Response) => {
    if (req.query.id === undefined || req.query.token === undefined) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({ error: "invalid_link" });
      return;
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      status: await this.authService.verifyToken(req.query.id, req.query.token),
    });
  };
}

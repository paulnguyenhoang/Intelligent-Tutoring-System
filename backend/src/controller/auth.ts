import { Request, Response } from "express";
import { IAuthService } from "../interface/service/auth";
import { UserDTO } from "../dto/user";
import {constants} from 'http2'
import { UserVerifyDTO } from "../dto/user_verify";

export class AuthController{
    public authService: IAuthService
    public constructor(
        authService: IAuthService
    ){
        this.authService = authService
    }
    public RegisterController = async (req: Request<{},{},UserDTO>,res: Response) => {
        await this.authService.register(req.body)
        res.status(
            constants.HTTP_STATUS_OK
        ).json({
            message: 'ok'
        })
        return
    }

    public VerifyUserController = async (req: Request<{},{},{},UserVerifyDTO>, res: Response) => {
        if (
            req.query.id === undefined || req.query.token === undefined
        ){
            res.status(constants.HTTP_STATUS_BAD_REQUEST).json({error: 'invalid_link'})
            return
        }
        return res.status(
            constants.HTTP_STATUS_OK
        ).json({
            status: await this.authService.verifyToken(
                req.query.id,
                req.query.token
            )
        })
    }
}
import { Role } from "../../model/enum/role";
import { Request, Response, NextFunction } from "express";
import {constants} from 'http2'
import { JWTService } from "../../service/jwt";
import { JwtPayload } from "jsonwebtoken";
import { IJWTService } from "../../interface/service/jwt";

const jwtService: IJWTService = new JWTService()

export const allowRole = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (
            req.headers.authorization === undefined ||
            req.headers.authorization.substring(0,6) !== 'Bearer'
        ){
            res
            .status(constants.HTTP_STATUS_UNAUTHORIZED)
            .json({
                error: 'invalid_or_missing_jwt'
            })
            return
        }
        try {
            const payload = jwtService.verifyToken(req.headers.authorization.substring(7))
            if ((payload as JwtPayload)['role'] !== role){
                res
                .status(constants.HTTP_STATUS_UNAUTHORIZED)
                .json({
                    error: 'invalid_or_missing_jwt'
                })
                return
            }
            else next()
        } catch (_) {
            res
            .status(constants.HTTP_STATUS_UNAUTHORIZED)
            .json({
                error: 'invalid_or_missing_jwt'
            })
            return
        }
    }
}
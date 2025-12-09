import { JwtPayload } from "jsonwebtoken"
import { User } from "../abstract/user"

export interface IJWTService{
    createToken: (user: User) => string
    verifyToken: (token: string) => string | JwtPayload | null
}
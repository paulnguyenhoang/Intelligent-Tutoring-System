import { IJWTService } from "../interface/service/jwt";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from "../interface/abstract/user";
import { roleToString } from "../extra/role";


export class JWTService implements IJWTService{
    private secret = crypto.randomBytes(32).toString('hex')
    public createToken(
        user: User
    ){
        return jwt.sign(
            {
                id: user.id,
                role: roleToString(user.role),
                email: user.email
            },
            this.secret,
            {
                expiresIn: '7 days'
            }
        )
    }
    public verifyToken(
        token: string
    ){
        try{
            const result = jwt.verify(
                token, this.secret
            )
            return result
        }
        catch(_){
            return null
        }
    }
}
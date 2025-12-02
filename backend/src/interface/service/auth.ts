import { UserDTO } from "../../dto/user"
import { User } from "../abstract/user"

export interface IAuthService{
    authenticate: (username: string, password: string, role: string) => Promise<boolean>
    register: (user: UserDTO) => Promise<User>
    resetPassword: (email: string) => Promise<void>
    verifyToken: (id: string, token: string) => Promise<boolean>
}
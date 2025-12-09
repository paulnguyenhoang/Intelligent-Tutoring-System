import { UserDTO } from "../../dto/user"
import { User } from "../abstract/user"

export interface IAuthService{
    authenticate: (username: string, password: string, role: string) => Promise<User | null>
    register: (user: UserDTO) => Promise<User>
    resetPassword: (email: string) => Promise<void>
    verifyToken: (id: string, token: string) => Promise<boolean>
}
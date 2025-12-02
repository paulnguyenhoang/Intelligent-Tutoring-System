import { Role } from "../../model/enum/role";

export type UserMap = {
    id: string,
    username: string,
    passwordHash: string,
    email: string,
    role: Role,
    isActive: boolean,
    lastLogin: Date
}

export interface User{
    id: string,
    username: string,
    passwordHash: string,
    email: string,
    role: Role,
    isActive: boolean,
    lastLogin?: Date,
    verifyToken?: string
    updateProfile: (data: UserMap) => Promise<void>
    changePassword: (oldPass: string, newPass: string) => Promise<void>
}
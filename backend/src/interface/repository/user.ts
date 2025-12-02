import { User } from "../abstract/user";

export interface IUserRepository{
    findByID: (id: string) => Promise<User>
    findByUsername: (username: string) => Promise<User>
    save: (user: User) => Promise<User>
}
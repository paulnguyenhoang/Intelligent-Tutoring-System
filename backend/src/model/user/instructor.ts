import { User, UserMap } from "../../interface/abstract/user";
import { Role } from "../enum/role";
import crypto from 'crypto'

export class Instructor implements User{
    public id: string
    public username: string
    public passwordHash: string
    public email: string
    public role: Role
    public isActive: boolean
    public lastLogin?: Date
    public employeeID: string
    public department?: string
    public expertise?: string[]
    public verifyToken?: string;
    public constructor(
        id: string,
        username: string,
        passwordHash: string,
        email: string,
        role: Role,
        isActive: boolean,
        employeeID?: string,
        lastLogin?: Date,
        department?: string,
        expertise?: string[],
        verifyToken?: string
    ){
        this.id = id 
        this.username = username 
        this.passwordHash = passwordHash 
        this.email = email 
        this.role = role 
        this.isActive = isActive 
        this.lastLogin = lastLogin
        this.employeeID = employeeID ? employeeID : String(crypto.randomInt(1000000000,10000000000))
        this.department = department
        this.expertise = expertise
        this.verifyToken = verifyToken
    }
    public async updateProfile(data: UserMap){

    }
    public async changePassword(oldPass: string, newPass: string){

    }
    public async createContent(){

    }
    public async viewStudentReports(){

    }
}
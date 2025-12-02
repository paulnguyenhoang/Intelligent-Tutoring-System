import { User, UserMap } from "../../interface/abstract/user";
import { LearningStyle } from "../enum/learning_style";
import { Role } from "../enum/role";
import crypto from 'crypto'

export class Student implements User{
    public id: string
    public username: string
    public passwordHash: string
    public email: string
    public role: Role
    public isActive: boolean
    public lastLogin?: Date
    public studentID: string
    public learningStyle?: LearningStyle
    public enrollmentDate?: Date
    public gpa?: number
    public verifyToken?: string;
    public constructor(
        id: string,
        username: string,
        passwordHash: string,
        email: string,
        role: Role,
        isActive: boolean,
        studentID?: string,
        lastLogin?: Date,
        learningStyle?: LearningStyle,
        enrollmentDate?: Date,
        gpa?: number,
        verifyToken?: string
    ){
        this.id = id 
        this.username = username 
        this.passwordHash = passwordHash 
        this.email = email 
        this.role = role 
        this.isActive = isActive 
        this.studentID = studentID ? studentID: String(crypto.randomInt(1000000000,10000000000))
        this.lastLogin = lastLogin
        this.learningStyle = learningStyle 
        this.enrollmentDate = enrollmentDate 
        this.gpa = gpa 
        this.verifyToken = verifyToken
    }
    public async updateProfile(data: UserMap){

    }
    public async changePassword(oldPass: string, newPass: string){

    }
    public async viewProfile(){

    }
    public async viewTranscript(){
        
    }
}
import { UserDTO } from "../dto/user";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { IUserRepository } from "../interface/repository/user";
import { IAuthService } from "../interface/service/auth";
import { IEmailService } from "../interface/service/email";
import { Student } from "../model/user/student";
import { Role } from "../model/enum/role";
import { Instructor } from "../model/user/instructor";
import { stringToRole } from "../extra/role";

export class AuthService implements IAuthService{
    public userRepository: IUserRepository
    public emailService: IEmailService
    public constructor(
        userRepository: IUserRepository,
        emailService: IEmailService
    ){
        this.userRepository = userRepository
        this.emailService = emailService
    }
    public async authenticate(
        username: string,
        password: string,
        role: string
    ){
        try{
            let result = await this.userRepository.findByUsername(
                username
            )
            if (result.role === stringToRole(role) && result.isActive && bcrypt.compareSync(password,result.passwordHash)){
                result.lastLogin = new Date()
                await this.userRepository.save(
                    result
                ) 
                return result
            }
            else return null
        }
        catch(_){
            return null
        }
    }
    public async register(
        user: UserDTO
    ){
        let obj
        const verifyToken = crypto.randomBytes(36).toString('hex')
        if (user.role === 'student')
            obj = new Student(
                crypto.randomUUID(),
                user.username,
                bcrypt.hashSync(user.password,10),
                user.email,
                Role.STUDENT,
                false,
            )
        else
            obj = new Instructor(
                crypto.randomUUID(),
                user.username,
                bcrypt.hashSync(user.password,10),
                user.email,
                Role.INSTRUCTOR,
                false
            )
        obj.verifyToken = verifyToken        
        const result = await this.userRepository.save(
            obj
        )
        await this.emailService.sendVerificationEmail(
            result.id,
            user.email,
            verifyToken
        )
        return obj
    }
    public async resetPassword(
        email: string
    ){

    }
    public async verifyToken(
        id: string,
        token: string
    ){
        try {
            let result = await this.userRepository.findByID(id)
            if (result.verifyToken === token){
                result.isActive = true
                result.verifyToken = undefined
                await this.userRepository.save(
                    result
                )
                return true
            }
            return false
        } catch (error) {
            return false            
        }
    }
}
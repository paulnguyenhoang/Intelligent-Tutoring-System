import { EmailAuthPass } from "../config/config";
import { IEmailService } from "../interface/service/email";
import nodemailer from 'nodemailer'

export class EmailService implements IEmailService{
    private transporter
    public constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            service: 'Gmail',
            auth: {
                user: 'maiquocthang0304@gmail.com',
                pass: EmailAuthPass
            }
        })
    }
    public async sendVerificationEmail(
        id: string,
        email: string,
        token: string
    ){
        await this.transporter.sendMail({
            from: '"ITS" <maiquocthang0304@gmail.com>',
            to: email,
            subject: 'ITS Email Verification',
            html: `<a href="http://localhost:3001/verify?id=${id}&token=${token}">Click on this link to verify</a>`
        })
    }
    public async sendPasswordReset(
        id: string,
        email: string,
        token: string
    ){
        await this.transporter.sendMail({
            from: '"ITS" <maiquocthang0304@gmail.com>',
            to: email,
            subject: 'ITS Password Reset',
            html: '<a href="">Click on this link to reset</a>'
        })
    }
}
import { EmailAuthPass } from "../config/config";
import { IEmailService } from "../interface/service/email";
import nodemailer from "nodemailer";

export class EmailService implements IEmailService {
  private transporter;
  public constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "Gmail",
      auth: {
        user: "maiquocthang0304@gmail.com",
        pass: EmailAuthPass,
      },
    });
  }
  public async sendVerificationEmail(id: string, email: string, token: string) {
    await this.transporter.sendMail({
      from: '"ITS" <maiquocthang0304@gmail.com>',
      to: email,
      subject: "ITS Email Verification",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #667eea;">Welcome to Intelligent Tutoring System!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for registering. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3001/verify?id=${id}&token=${token}" 
                           style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 14px; color: #667eea; word-break: break-all;">http://localhost:3001/verify?id=${id}&token=${token}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
                </div>
            `,
    });
  }
  public async sendPasswordReset(id: string, email: string, token: string) {
    await this.transporter.sendMail({
      from: '"ITS" <maiquocthang0304@gmail.com>',
      to: email,
      subject: "ITS Password Reset",
      html: '<a href="">Click on this link to reset</a>',
    });
  }
}

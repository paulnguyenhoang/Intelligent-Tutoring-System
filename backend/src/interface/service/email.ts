export interface IEmailService{
    sendVerificationEmail: (id: string, email: string, token: string) => Promise<void>
    sendPasswordReset: (id: string, email: string, token: string) => Promise<void>
}
export interface UserDTO{
    username: string,
    password: string,
    email: string,
    role: 'student' | 'teacher'
}
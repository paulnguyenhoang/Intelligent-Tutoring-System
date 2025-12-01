import express, {json, Request, Response} from 'express'
import { UserDTO } from './dto/user'
import { AuthController } from './controller/auth'
import { AuthService } from './service/auth'
import { UserRepository } from './repository/user'
import { EmailService } from './service/email'
import { db } from './config/database'

const ex = express()

ex.use(json())

const authController = new AuthController(
    new AuthService(
        new UserRepository(
            db
        ),
        new EmailService()
    )
)

ex.post('/register', authController.RegisterController)

ex.get('/verify', authController.VerifyUserController)
ex.listen(3001,() => {
    console.log('Listening on port 3001');
    
})
// ex.post('/login',(req: Request<{},{},UserDTO>, res) => {
//     const authService
//     req.body
// })
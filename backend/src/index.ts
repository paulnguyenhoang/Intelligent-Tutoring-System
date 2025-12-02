import express, {json, Request, Response} from 'express'
import { UserDTO } from './dto/user'
import { AuthController } from './controller/auth'
import { AuthService } from './service/auth'
import { UserRepository } from './repository/user'
import { EmailService } from './service/email'
import { db } from './config/database'
import multer from 'multer'
import { InstructorController } from './controller/instructor'
import { CourseService } from './service/course'
import { CourseRepository } from './repository/course'
import { LessonService } from './service/lesson'
import { LessonRepository } from './repository/lesson'
import { CommonController } from './controller/common'
import { StudentController } from './controller/student'

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

const instructorController = new InstructorController(
    new CourseService(
        new CourseRepository()
    ),
    new LessonService(
        new LessonRepository()
    )
)

const commonController = new CommonController(
    new CourseService(
        new CourseRepository()
    ),
    new LessonService(
        new LessonRepository()
    )
)

const studentController = new StudentController(
    new CourseService(
        new CourseRepository()
    ),
    new LessonService(
        new LessonRepository()
    )
)

ex.post('/register', authController.RegisterController)

ex.get('/verify', authController.VerifyUserController)

ex.post('/instructor/course', multer().single ,instructorController.createCourse)

ex.post('/instructor/lesson', multer().single ,instructorController.createLesson)

ex.delete('/instructor/lesson', instructorController.deleteLesson)

ex.delete('/instructor/course', instructorController.deleteCourse)

ex.get('/instructor/courses/:id', instructorController.getCourses)

ex.get('/student/courses', studentController.getCourses)

ex.get('/instructor/lessons/:id', commonController.getLessons)

ex.get('/student/lessons/:id', commonController.getLessons)

ex.post('/login', authController.LoginController)

ex.listen(3001,() => {
    console.log('Listening on port 3001');
    
})
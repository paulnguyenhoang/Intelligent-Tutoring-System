import express, { json, Request, Response } from "express";
import cors from "cors";
import { UserDTO } from "./dto/user";
import { AuthController } from "./controller/auth";
import { AuthService } from "./service/auth";
import { UserRepository } from "./repository/user";
import { EmailService } from "./service/email";
import { db } from "./config/database";
import multer from "multer";
import { InstructorController } from "./controller/instructor";
import { CourseService } from "./service/course";
import { CourseRepository } from "./repository/course";
import { LessonService } from "./service/lesson";
import { LessonRepository } from "./repository/lesson";
import { CommonController } from "./controller/common";
import { StudentController } from "./controller/student";
import { JWTService } from "./service/jwt";
import { allowRole } from "./extra/middleware/role";
import { Role } from "./model/enum/role";
import { QuizController } from "./controller/quiz";

const ex = express();

// Enable CORS for frontend
ex.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  })
);

ex.use(json());

const authController = new AuthController(
    new AuthService(new UserRepository(db), new EmailService()),
    new JWTService()
);

const instructorController = new InstructorController(
  new CourseService(new CourseRepository()),
  new LessonService(new LessonRepository())
);

const commonController = new CommonController(
  new CourseService(new CourseRepository()),
  new LessonService(new LessonRepository())
);

const studentController = new StudentController(
  new CourseService(new CourseRepository()),
  new LessonService(new LessonRepository())
);

const quizController = new QuizController();

ex.post("/register", authController.RegisterController);

ex.get("/verify", authController.VerifyUserController);

ex.post('/instructor/course', [multer().single, allowRole(Role.INSTRUCTOR)] ,instructorController.createCourse)

ex.post('/instructor/lesson',[multer().single, allowRole(Role.INSTRUCTOR)] ,instructorController.createLesson)

ex.delete('/instructor/lesson',[allowRole(Role.INSTRUCTOR)],  instructorController.deleteLesson)

ex.delete('/instructor/course',[allowRole(Role.INSTRUCTOR)], instructorController.deleteCourse)

ex.get('/instructor/courses/:id',[allowRole(Role.INSTRUCTOR)], instructorController.getCourses)

ex.get('/student/courses',[allowRole(Role.STUDENT)], studentController.getCourses)

ex.get('/instructor/lessons/:id',[allowRole(Role.STUDENT)], commonController.getLessons)

ex.get('/student/lessons/:id',[allowRole(Role.STUDENT)], commonController.getLessons)



ex.post("/login", authController.LoginController);

ex.get("/quizzes", quizController.list);
ex.get("/quizzes/:id", quizController.getOne);
ex.post("/quizzes", quizController.create);
ex.put("/quizzes/:id", quizController.update);
ex.delete("/quizzes/:id", quizController.remove);
ex.post("/quizzes/:id/submit", quizController.submit);
ex.get("/quizzes/:id/completion", quizController.completion);

ex.listen(3001, () => {
  console.log("Listening on port 3001");
});

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherQuizManagement from "./pages/TeacherQuizManagement";
import StudentCourses from "./pages/StudentCourses";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResult from "./pages/QuizResult";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<App />}>
          <Route index element={<Navigate to={ROUTES.SIGN_IN} replace />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="teacher/quiz"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherQuizManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="quiz"
            element={
              <ProtectedRoute allowedRole="student">
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="result"
            element={
              <ProtectedRoute allowedRole="student">
                <QuizResult />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

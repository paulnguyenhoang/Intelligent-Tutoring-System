import { useState, useEffect } from "react";
import { Input, Typography, Empty } from "antd";
import { FireOutlined, SearchOutlined } from "@ant-design/icons";
import { getQuizzes, evaluate, saveQuizCompletion } from "../services/quizService";
import type { Quiz } from "../types";
import QuizListView from "../components/QuizListView";
import QuizTakingView from "../components/QuizTakingView";
import QuizResultView from "../components/QuizResultView";
import styles from "./TakeQuiz.module.less";

const { Title } = Typography;

type QuizResult = {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  feedback: string;
};

type QuizSessionState = {
  activeQuizId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  quizResult: QuizResult | null;
  quizDeadline: number | null; // Thời điểm kết thúc quiz (timestamp)
};

const QUIZ_SESSION_KEY = "quiz_session_state";

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizDeadline, setQuizDeadline] = useState<number | null>(null);

  // Load quizzes and restore session from localStorage
  useEffect(() => {
    const allQuizzes = getQuizzes();
    setQuizzes(allQuizzes);

    // Restore session state
    try {
      const savedSession = localStorage.getItem(QUIZ_SESSION_KEY);
      if (savedSession) {
        const session: QuizSessionState = JSON.parse(savedSession);

        // Validate that the quiz still exists before restoring
        if (session.activeQuizId) {
          const quizExists = allQuizzes.find((q) => q.id === session.activeQuizId);
          if (!quizExists) {
            // Quiz no longer exists, clear the session
            localStorage.removeItem(QUIZ_SESSION_KEY);
            return;
          }
        }

        setActiveQuizId(session.activeQuizId);
        setCurrentQuestionIndex(session.currentQuestionIndex);
        setAnswers(session.answers);
        setQuizResult(session.quizResult);
        setQuizDeadline(session.quizDeadline);
      }
    } catch (error) {
      console.error("Error restoring quiz session:", error);
      // Clear corrupted session data
      localStorage.removeItem(QUIZ_SESSION_KEY);
    }
  }, []);

  // Save session state to localStorage whenever it changes
  useEffect(() => {
    const sessionState: QuizSessionState = {
      activeQuizId,
      currentQuestionIndex,
      answers,
      quizResult,
      quizDeadline,
    };

    if (activeQuizId || quizResult) {
      localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(sessionState));
    } else {
      localStorage.removeItem(QUIZ_SESSION_KEY);
    }
  }, [activeQuizId, currentQuestionIndex, answers, quizResult, quizDeadline]);

  const startQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      const duration = (quiz.timeLimit || 30) * 60 * 1000; // Convert to milliseconds
      setQuizDeadline(Date.now() + duration);
    }
    setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizResult(null);
  };

  const quitQuiz = () => {
    setActiveQuizId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizResult(null);
    setQuizDeadline(null);
    localStorage.removeItem(QUIZ_SESSION_KEY);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    if (!quiz) return;

    const result = evaluate(quiz, answers);
    const percentage = (result.correct / result.total) * 100;
    const passed = percentage >= (quiz.passingScore || 70);

    let feedback = "";
    if (percentage >= 90) {
      feedback =
        "Excellent! AI Analysis: You have mastered this topic. Ready for advanced challenges!";
    } else if (percentage >= 70) {
      feedback =
        "Good job! AI recommends reviewing questions you missed to strengthen your understanding.";
    } else if (percentage >= 50) {
      feedback =
        "AI suggests revisiting the course materials, especially the sections related to questions you got wrong.";
    } else {
      feedback =
        "AI recommends taking the course again and practicing more before retaking this assessment.";
    }

    const quizResult = {
      score: result.correct,
      total: result.total,
      percentage,
      passed,
      feedback,
    };

    // Save completion to localStorage
    saveQuizCompletion({
      quizId: quiz.id,
      score: result.correct,
      total: result.total,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
    });

    setQuizResult(quizResult);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Screen: Taking Quiz
  if (activeQuizId && !quizResult) {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    if (!quiz) {
      // Quiz not found, clear session and return to list
      quitQuiz();
      return null;
    }

    return (
      <QuizTakingView
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        timeRemaining={quizDeadline || Date.now()}
        onQuit={quitQuiz}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
      />
    );
  }

  // Screen: Quiz Result
  if (quizResult) {
    const quiz = quizzes.find((q) => q.id === activeQuizId);
    return (
      <QuizResultView
        score={quizResult.score}
        total={quizResult.total}
        percentage={quizResult.percentage}
        passed={quizResult.passed}
        passingScore={quiz?.passingScore || 70}
        feedback={quizResult.feedback}
        onBackToList={quitQuiz}
        onRetry={() => startQuiz(activeQuizId!)}
      />
    );
  }

  // Screen: Quiz List Dashboard
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          <FireOutlined /> Available Assessments
        </Title>
        <Input
          size="large"
          placeholder="Search quizzes by title or description..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty description="No quizzes available yet. Please check back later!" />
        </div>
      ) : (
        <QuizListView quizzes={filteredQuizzes} onStartQuiz={startQuiz} />
      )}
    </div>
  );
};

export default TakeQuiz;

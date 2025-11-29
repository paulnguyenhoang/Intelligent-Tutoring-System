import { useState, useEffect } from "react";
import { Card, Radio, Button, message, Select, Empty } from "antd";
import { getQuizzes, evaluate } from "../services/quizService";
import type { Quiz } from "../types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import styles from "./TakeQuiz.module.less";

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const allQuizzes = getQuizzes();
    setQuizzes(allQuizzes);
    if (allQuizzes.length > 0) {
      setSelectedQuiz(allQuizzes[0]);
    }
  }, []);

  const setAnswer = (qid: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: answer }));
  };

  const onSubmit = () => {
    if (!selectedQuiz) return;

    // Validate all questions answered
    const unanswered = selectedQuiz.questions.filter((q) => answers[q.id] === undefined);

    if (unanswered.length > 0) {
      message.warning(`Please answer all questions! ${unanswered.length} question(s) remaining.`);
      return;
    }

    const res = evaluate(selectedQuiz, answers);
    navigate(ROUTES.RESULT, { state: res });
  };

  const handleQuizChange = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setAnswers({});
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className={styles.quizContainer}>
        <Card>
          <Empty description="No quizzes available yet. Please check back later!" />
        </Card>
      </div>
    );
  }

  if (!selectedQuiz) return null;

  return (
    <div className={styles.quizContainer}>
      <Card
        title={
          <div>
            <div style={{ marginBottom: 8 }}>
              <Select
                style={{ width: 300 }}
                value={selectedQuiz.id}
                onChange={handleQuizChange}
                placeholder="Select a quiz"
              >
                {quizzes.map((q) => (
                  <Select.Option key={q.id} value={q.id}>
                    {q.title}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div style={{ fontSize: 14, fontWeight: "normal", color: "#666", marginTop: 4 }}>
              Progress: {Object.keys(answers).length} / {selectedQuiz.questions.length}
            </div>
          </div>
        }
        className={styles.quizCard}
      >
        {selectedQuiz.questions.map((q, i) => (
          <div key={q.id} className={styles.questionItem}>
            <div className={styles.questionText}>
              {i + 1}. {q.content}
            </div>
            <Radio.Group onChange={(e) => setAnswer(q.id, e.target.value)} value={answers[q.id]}>
              {Object.entries(q.options).map(([key, value]) => (
                <div key={key}>
                  <Radio value={key}>
                    {key}. {value}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        ))}
        <div className={styles.submitButton}>
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TakeQuiz;

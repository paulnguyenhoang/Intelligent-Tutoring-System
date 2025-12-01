import { Card, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import type { QuizResult as QuizResultType } from "../types";
import { formatPercentage } from "../utils";
import { ROUTES } from "../constants";
import styles from "./QuizResult.module.less";

const QuizResult = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const result = (loc.state as QuizResultType) || { correct: 0, total: 0 };

  return (
    <div className={styles.resultContainer}>
      <Card title="Quiz Result" className={styles.resultCard}>
        <h2 className={styles.scoreTitle}>
          {result.correct} / {result.total}
        </h2>
        <p className={styles.scoreText}>
          Your score: {formatPercentage(result.correct, result.total)}%
        </p>
        <Button onClick={() => navigate(ROUTES.QUIZ)}>Take Another Quiz</Button>
      </Card>
    </div>
  );
};

export default QuizResult;

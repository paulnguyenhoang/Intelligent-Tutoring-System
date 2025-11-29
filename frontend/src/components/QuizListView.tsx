import { Card, Row, Col, Button, Tag, Typography, Badge } from "antd";
import {
  ClockCircleOutlined,
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { Quiz } from "../types";
import { getQuizCompletion } from "../services/quizService";
import styles from "./QuizListView.module.less";

const { Title, Paragraph, Text } = Typography;

interface QuizListViewProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: string) => void;
}

const getDifficultyColor = (score?: number) => {
  if (!score) return "blue";
  if (score >= 80) return "red";
  if (score >= 50) return "orange";
  return "green";
};

const getDifficultyText = (score?: number) => {
  if (!score) return "Medium";
  if (score >= 80) return "Hard";
  if (score >= 50) return "Medium";
  return "Easy";
};

export default function QuizListView({ quizzes, onStartQuiz }: QuizListViewProps) {
  return (
    <div className={styles.overviewSection}>
      <div className={styles.sectionHeader}>
        <Title level={4} className={styles.sectionTitle}>
          Overview of Quizzes
        </Title>
      </div>

      <div className={styles.quizGrid}>
        <Row gutter={[24, 24]}>
          {quizzes.map((quiz) => {
            const completion = getQuizCompletion(quiz.id);
            const isCompleted = !!completion;
            const isPassed = completion?.passed || false;

            return (
              <Col xs={24} sm={12} md={12} lg={8} key={quiz.id}>
                <Badge.Ribbon
                  text={
                    isCompleted ? (
                      <span>
                        <CheckCircleOutlined /> {completion.percentage.toFixed(0)}%
                      </span>
                    ) : (
                      "New"
                    )
                  }
                  color={isCompleted ? (isPassed ? "green" : "orange") : "blue"}
                >
                  <Card
                    className={`${styles.quizCard} ${isCompleted ? styles.completed : ""}`}
                    hoverable
                  >
                    <div className={styles.cardContent}>
                      <Title level={5} className={styles.quizTitle} ellipsis={{ rows: 2 }}>
                        {quiz.title}
                      </Title>

                      <div className={styles.descriptionWrapper}>
                        {quiz.description ? (
                          <Paragraph
                            type="secondary"
                            ellipsis={{ rows: 2 }}
                            className={styles.quizDescription}
                          >
                            {quiz.description}
                          </Paragraph>
                        ) : (
                          <div className={styles.descriptionPlaceholder}></div>
                        )}
                      </div>

                      <div className={styles.tagsGrid}>
                        <Tag
                          color={getDifficultyColor(quiz.passingScore)}
                          icon={<TrophyOutlined />}
                        >
                          {getDifficultyText(quiz.passingScore)}
                        </Tag>
                        <Tag color="blue" icon={<ClockCircleOutlined />}>
                          {quiz.timeLimit || 30} mins
                        </Tag>
                        <Tag color="purple">{quiz.questions.length} Questions</Tag>
                        <Tag color="green">Pass: {quiz.passingScore || 70}%</Tag>
                      </div>

                      {isCompleted && (
                        <div className={styles.completionInfo}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Last attempt: {completion.score}/{completion.total} •{" "}
                            {new Date(completion.completedAt).toLocaleDateString()}
                          </Text>
                        </div>
                      )}

                      <Button
                        type="primary"
                        size="large"
                        block
                        icon={<RocketOutlined />}
                        onClick={() => onStartQuiz(quiz.id)}
                        className={styles.startButton}
                      >
                        {isCompleted ? "Retry Quiz" : "Start Quiz"}
                      </Button>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

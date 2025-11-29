import { Card, Row, Col, Button, Space, Typography, Progress, Statistic, Alert, Radio } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { Quiz } from "../types";
import styles from "./QuizTakingView.module.less";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

interface QuizTakingViewProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  onQuit: () => void;
  onAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function QuizTakingView({
  quiz,
  currentQuestionIndex,
  answers,
  timeRemaining,
  onQuit,
  onAnswer,
  onNext,
  onPrevious,
  onSubmit,
}: QuizTakingViewProps) {
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className={styles.takingQuizContainer}>
      {/* Header */}
      <Card className={styles.quizHeader}>
        <Row justify="space-between" align="middle" gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Button icon={<ArrowLeftOutlined />} onClick={onQuit} size="large">
              Quit Quiz
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} style={{ textAlign: "center" }}>
            <Title level={4} className={styles.headerTitle}>
              {quiz.title}
            </Title>
          </Col>
          <Col xs={24} sm={24} md={8} style={{ textAlign: "right" }}>
            <Space>
              <ClockCircleOutlined style={{ fontSize: 20, color: "white" }} />
              <Countdown
                value={timeRemaining}
                format="mm:ss"
                valueStyle={{ fontSize: 20, color: "white", fontWeight: 600 }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Progress */}
      <Card className={styles.progressCard}>
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          <Row justify="space-between">
            <Col>
              <Text strong style={{ fontSize: 16 }}>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Text>
            </Col>
            <Col>
              <Text type="secondary">
                Answered: {answeredCount} / {quiz.questions.length}
              </Text>
            </Col>
          </Row>
          <Progress percent={Math.round(progress)} status="active" strokeColor="#1890ff" />
        </Space>
      </Card>

      {/* Question Card */}
      <Card className={styles.questionCard}>
        <Space direction="vertical" style={{ width: "100%" }} size={20}>
          <div>
            <Title level={3} className={styles.questionTitle}>
              {currentQuestion.content}
            </Title>
            {currentQuestion.hint && (
              <Alert
                message="💡 Hint"
                description={currentQuestion.hint}
                type="info"
                showIcon
                closable
                className={styles.hintAlert}
              />
            )}
          </div>

          <Radio.Group
            value={answers[currentQuestion.id]}
            onChange={(e) => onAnswer(currentQuestion.id, e.target.value)}
            className={styles.optionsGroup}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <Card
                  key={key}
                  className={`${styles.optionCard} ${
                    answers[currentQuestion.id] === key ? styles.selected : ""
                  }`}
                  hoverable
                  onClick={() => onAnswer(currentQuestion.id, key)}
                >
                  <Radio value={key} className={styles.optionRadio}>
                    <span className={styles.optionKey}>{key}.</span>
                    <span className={styles.optionValue}>{value}</span>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Space>
      </Card>

      {/* Navigation Footer */}
      <Card className={styles.navigationFooter}>
        <Row justify="space-between" gutter={16}>
          <Col>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
          </Col>
          <Col>
            {isLastQuestion ? (
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={onSubmit}
                disabled={answeredCount < quiz.questions.length}
                className={styles.submitButton}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={onNext}>
                Next Question
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
}

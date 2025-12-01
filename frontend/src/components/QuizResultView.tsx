import { Card, Button, Result, Alert, Typography, Space } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import styles from "./QuizResultView.module.less";

const { Title, Text } = Typography;

interface QuizResultViewProps {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  feedback: string;
  onBackToList: () => void;
  onRetry: () => void;
}

export default function QuizResultView({
  score,
  total,
  percentage,
  passed,
  passingScore,
  feedback,
  onBackToList,
  onRetry,
}: QuizResultViewProps) {
  return (
    <div className={styles.resultContainer}>
      <Card className={styles.resultCard}>
        <Result
          status={passed ? "success" : "warning"}
          title={
            <Title level={2} className={styles.resultTitle}>
              {passed ? "🎉 Congratulations! You Passed!" : "📚 Quiz Completed - Keep Learning!"}
            </Title>
          }
          subTitle={
            <Space direction="vertical" size={12} className={styles.scoreInfo}>
              <div className={styles.scoreDisplay}>
                <span className={styles.scoreNumber}>
                  {score} / {total}
                </span>
                <span className={styles.scorePercentage}>({percentage.toFixed(1)}%)</span>
              </div>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Passing Score: {passingScore}%
              </Text>
            </Space>
          }
          extra={[
            <Button
              type="primary"
              size="large"
              key="back"
              onClick={onBackToList}
              className={styles.primaryButton}
            >
              Back to Quiz List
            </Button>,
            <Button size="large" key="retry" onClick={onRetry} className={styles.retryButton}>
              Retry Quiz
            </Button>,
          ]}
        />

        <Alert
          message={
            <Space>
              <RocketOutlined />
              <Text strong style={{ fontSize: 16 }}>
                AI Learning Feedback
              </Text>
            </Space>
          }
          description={<Text style={{ fontSize: 15 }}>{feedback}</Text>}
          type={passed ? "success" : "info"}
          showIcon={false}
          className={styles.feedbackAlert}
        />
      </Card>
    </div>
  );
}

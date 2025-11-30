import { useState, useEffect } from "react";
import { Button, Card, List, message, Modal, Space, Tag, Typography } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { Quiz } from "../types";
import { getQuizzes, createQuiz, deleteQuiz, updateQuiz } from "../services/quizService";
import CreateQuizModal from "../components/CreateQuizModal";
import EditQuizModal from "../components/EditQuizModal";
import styles from "./TeacherQuizManagement.module.less";

const { Text } = Typography;

export default function TeacherQuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const loadQuizzes = () => {
    setQuizzes(getQuizzes());
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleCreate = (values: Omit<Quiz, "id">) => {
    createQuiz(values);
    message.success("Quiz created successfully!");
    setOpenCreate(false);
    loadQuizzes();
  };

  const handleEdit = (id: string, values: Omit<Quiz, "id">) => {
    updateQuiz(id, values);
    message.success("Quiz updated successfully!");
    setOpenEdit(false);
    setSelectedQuiz(null);
    loadQuizzes();
  };

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    message.success("Quiz deleted!");
    loadQuizzes();
  };

  const confirmDelete = (quiz: Quiz) => {
    Modal.confirm({
      title: "Delete this quiz?",
      content: `Are you sure you want to delete "${quiz.title}"?`,
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      centered: true,
      className: styles.deleteConfirmModal,
      onOk() {
        handleDelete(quiz.id);
      },
      okButtonProps: {
        style: { minWidth: 80 },
      },
      cancelButtonProps: {
        style: { minWidth: 80 },
      },
    });
  };

  const openEditModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setOpenEdit(true);
  };

  const openViewModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setOpenView(true);
  };

  return (
    <div className={styles.container}>
      <Card
        title="Quiz Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
            Create Quiz
          </Button>
        }
      >
        {quizzes.length === 0 ? (
          <div className={styles.emptyState}>
            <Text type="secondary">No quizzes yet. Create one to get started!</Text>
          </div>
        ) : (
          <List
            dataSource={quizzes}
            renderItem={(quiz) => (
              <List.Item
                actions={[
                  <Button key="view" icon={<EyeOutlined />} onClick={() => openViewModal(quiz)}>
                    View
                  </Button>,
                  <Button key="edit" icon={<EditOutlined />} onClick={() => openEditModal(quiz)}>
                    Edit
                  </Button>,
                  <Button
                    key="delete"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => confirmDelete(quiz)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Text strong style={{ fontSize: 16 }}>
                      {quiz.title}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      {quiz.description && <Text type="secondary">{quiz.description}</Text>}
                      <Space size={16}>
                        <Tag icon={<ClockCircleOutlined />} color="blue">
                          {quiz.timeLimit || 30} mins
                        </Tag>
                        <Tag icon={<TrophyOutlined />} color="green">
                          Pass: {quiz.passingScore || 70}%
                        </Tag>
                        <Tag color="purple">{quiz.questions.length} Questions</Tag>
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />

      {/* View Quiz Modal */}
      <Modal
        title={selectedQuiz?.title}
        open={openView}
        onCancel={() => {
          setOpenView(false);
          setSelectedQuiz(null);
        }}
        footer={null}
        width={800}
      >
        {selectedQuiz && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            {selectedQuiz.description && (
              <div>
                <Text strong>Description: </Text>
                <Text>{selectedQuiz.description}</Text>
              </div>
            )}

            <Space>
              <Tag icon={<ClockCircleOutlined />} color="blue">
                Time Limit: {selectedQuiz.timeLimit || 30} minutes
              </Tag>
              <Tag icon={<TrophyOutlined />} color="green">
                Passing Score: {selectedQuiz.passingScore || 70}%
              </Tag>
            </Space>

            {selectedQuiz.questions.map((q, idx) => (
              <Card
                key={q.id}
                size="small"
                title={`Question ${idx + 1}`}
                className={styles.viewQuestionCard}
              >
                <p>
                  <strong>{q.content}</strong>
                </p>

                <div style={{ marginTop: 12 }}>
                  <Text strong>Options:</Text>
                  <ul style={{ marginTop: 8 }}>
                    {Object.entries(q.options).map(([key, value]) => (
                      <li
                        key={key}
                        style={{ color: key === q.correctAnswer ? "green" : "inherit" }}
                      >
                        <strong>{key}:</strong> {value}{" "}
                        {key === q.correctAnswer && <Tag color="success">Correct</Tag>}
                      </li>
                    ))}
                  </ul>
                </div>

                {q.hint && (
                  <div style={{ marginTop: 12 }}>
                    <Text strong>Hint: </Text>
                    <Text type="secondary">{q.hint}</Text>
                  </div>
                )}

                {q.feedback && (
                  <div style={{ marginTop: 8 }}>
                    <Text strong>Feedback: </Text>
                    <Text type="secondary">{q.feedback}</Text>
                  </div>
                )}
              </Card>
            ))}
          </Space>
        )}
      </Modal>

      {/* Edit Quiz Modal */}
      <EditQuizModal
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedQuiz(null);
        }}
        onSubmit={handleEdit}
        quiz={selectedQuiz}
      />
    </div>
  );
}

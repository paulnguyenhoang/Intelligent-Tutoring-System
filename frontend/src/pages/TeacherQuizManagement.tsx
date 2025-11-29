import { useState, useEffect } from "react";
import { Button, Card, List, Popconfirm, message, Modal, Form, Input, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { Quiz, Question } from "../types";
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../services/quizService";
import styles from "./TeacherQuizManagement.module.less";

export default function TeacherQuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [form] = Form.useForm();

  const loadQuizzes = () => {
    setQuizzes(getQuizzes());
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const questions: Question[] = values.questions.map((q: any, idx: number) => ({
        id: `q${idx + 1}`,
        text: q.text,
        options: q.options
          .split("\n")
          .map((o: string) => o.trim())
          .filter(Boolean),
        answerIndex: parseInt(q.answerIndex),
      }));

      createQuiz({
        title: values.title,
        questions,
      });

      message.success("Quiz created successfully!");
      form.resetFields();
      setOpenCreate(false);
      loadQuizzes();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleEdit = async () => {
    if (!selectedQuiz) return;
    try {
      const values = await form.validateFields();
      const questions: Question[] = values.questions.map((q: any, idx: number) => ({
        id: `q${idx + 1}`,
        text: q.text,
        options: q.options
          .split("\n")
          .map((o: string) => o.trim())
          .filter(Boolean),
        answerIndex: parseInt(q.answerIndex),
      }));

      updateQuiz(selectedQuiz.id, {
        title: values.title,
        questions,
      });

      message.success("Quiz updated successfully!");
      form.resetFields();
      setOpenEdit(false);
      setSelectedQuiz(null);
      loadQuizzes();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    message.success("Quiz deleted!");
    loadQuizzes();
  };

  const openEditModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    form.setFieldsValue({
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        text: q.text,
        options: q.options.join("\n"),
        answerIndex: q.answerIndex.toString(),
      })),
    });
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
          <p className={styles.empty}>No quizzes yet. Create one to get started!</p>
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
                  <Popconfirm
                    key="delete"
                    title="Delete this quiz?"
                    onConfirm={() => handleDelete(quiz.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={quiz.title}
                  description={`${quiz.questions.length} questions`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Create Quiz Modal */}
      <Modal
        title="Create New Quiz"
        open={openCreate}
        onOk={handleCreate}
        onCancel={() => {
          setOpenCreate(false);
          form.resetFields();
        }}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Quiz Title" rules={[{ required: true }]}>
            <Input placeholder="Enter quiz title" />
          </Form.Item>

          <Form.List name="questions" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Question ${index + 1}`}
                    className={styles.questionCard}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "text"]}
                      label="Question"
                      rules={[{ required: true, message: "Please enter question text" }]}
                    >
                      <Input.TextArea rows={2} placeholder="Enter question" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "options"]}
                      label="Options (one per line)"
                      rules={[{ required: true, message: "Please enter options" }]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "answerIndex"]}
                      label="Correct Answer Index (0-based)"
                      rules={[{ required: true, message: "Please enter answer index" }]}
                    >
                      <Input placeholder="e.g., 0 for first option, 1 for second" />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Remove Question
                      </Button>
                    )}
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Question
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Edit Quiz Modal */}
      <Modal
        title="Edit Quiz"
        open={openEdit}
        onOk={handleEdit}
        onCancel={() => {
          setOpenEdit(false);
          setSelectedQuiz(null);
          form.resetFields();
        }}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Quiz Title" rules={[{ required: true }]}>
            <Input placeholder="Enter quiz title" />
          </Form.Item>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Question ${index + 1}`}
                    className={styles.questionCard}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "text"]}
                      label="Question"
                      rules={[{ required: true, message: "Please enter question text" }]}
                    >
                      <Input.TextArea rows={2} placeholder="Enter question" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "options"]}
                      label="Options (one per line)"
                      rules={[{ required: true, message: "Please enter options" }]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "answerIndex"]}
                      label="Correct Answer Index (0-based)"
                      rules={[{ required: true, message: "Please enter answer index" }]}
                    >
                      <Input placeholder="e.g., 0 for first option, 1 for second" />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Remove Question
                      </Button>
                    )}
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Question
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* View Quiz Modal */}
      <Modal
        title={selectedQuiz?.title}
        open={openView}
        onCancel={() => {
          setOpenView(false);
          setSelectedQuiz(null);
        }}
        footer={null}
        width={700}
      >
        {selectedQuiz && (
          <Space direction="vertical" style={{ width: "100%" }}>
            {selectedQuiz.questions.map((q, idx) => (
              <Card key={q.id} size="small" title={`Question ${idx + 1}`}>
                <p>
                  <strong>{q.text}</strong>
                </p>
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ color: i === q.answerIndex ? "green" : "inherit" }}>
                      {opt} {i === q.answerIndex && <strong>(Correct)</strong>}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </Space>
        )}
      </Modal>
    </div>
  );
}

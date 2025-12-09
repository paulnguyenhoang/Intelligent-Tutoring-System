import { Modal, Form, Input, InputNumber, Button, Row, Col, Typography, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Quiz } from "../types";
import QuestionFormItem from "./QuestionFormItem.tsx";
import styles from "./CreateQuizModal.module.less";
import { useEffect } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface EditQuizModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (id: string, values: Omit<Quiz, "id">) => void;
  quiz: Quiz | null;
}

interface FormValues {
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: Array<{
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: "A" | "B" | "C" | "D";
    hint?: string;
  }>;
}

export default function EditQuizModal({ open, onCancel, onSubmit, quiz }: EditQuizModalProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (quiz && open) {
      // Transform quiz data to form values
      form.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        questions: quiz.questions.map((q) => ({
          content: q.content,
          optionA: q.options.A,
          optionB: q.options.B,
          optionC: q.options.C,
          optionD: q.options.D,
          correctAnswer: q.correctAnswer,
          hint: q.hint,
        })),
      });
    }
  }, [quiz, open, form]);

  const handleOk = async () => {
    if (!quiz) return;

    try {
      const values = await form.validateFields();

      // Transform form values to Quiz format
      const quizData: Omit<Quiz, "id"> = {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        passingScore: values.passingScore,
        questions: values.questions.map((q, idx) => ({
          // Keep existing question ID when editing
          id: quiz.questions[idx]?.id,
          content: q.content,
          options: {
            A: q.optionA,
            B: q.optionB,
            C: q.optionC,
            D: q.optionD,
          },
          correctAnswer: q.correctAnswer,
          hint: q.hint,
        })),
      };

      console.log("Edit Quiz Data:", quizData);
      onSubmit(quiz.id, quizData);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          Edit Quiz
        </Title>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      destroyOnClose
      okText="Update Quiz"
      cancelText="Cancel"
      className={styles.createQuizModal}
      centered
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {/* Quiz Info Section */}
        <div className={styles.quizInfoSection}>
          <Form.Item
            name="title"
            label={<Text strong>Quiz Title</Text>}
            rules={[{ required: true, message: "Please enter quiz title" }]}
          >
            <Input size="large" placeholder="Enter an engaging quiz title..." />
          </Form.Item>

          <Form.Item name="description" label={<Text strong>Description</Text>}>
            <TextArea rows={2} placeholder="Brief description of what this quiz covers..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="timeLimit" label={<Text strong>Time Limit (minutes)</Text>}>
                <InputNumber min={1} max={180} style={{ width: "100%" }} placeholder="30" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="passingScore" label={<Text strong>Passing Score (%)</Text>}>
                <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="70" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider>
          <Text strong style={{ fontSize: 16 }}>
            Questions
          </Text>
        </Divider>

        {/* Questions Section */}
        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <QuestionFormItem
                  key={field.key}
                  field={field}
                  index={index}
                  onRemove={() => remove(field.name)}
                  canRemove={fields.length > 1}
                />
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                size="large"
                className={styles.addQuestionBtn}
              >
                Add Question
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

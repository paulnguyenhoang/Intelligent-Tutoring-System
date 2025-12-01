import { Modal, Form, Input, InputNumber, Button, Row, Col, Typography, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Quiz } from "../types";
import QuestionFormItem from "./QuestionFormItem.tsx";
import styles from "./CreateQuizModal.module.less";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CreateQuizModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Quiz, "id">) => void;
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
    feedback?: string;
  }>;
}

export default function CreateQuizModal({ open, onCancel, onSubmit }: CreateQuizModalProps) {
  const [form] = Form.useForm<FormValues>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Transform form values to Quiz format
      const quizData: Omit<Quiz, "id"> = {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        passingScore: values.passingScore,
        questions: values.questions.map((q, idx) => ({
          id: `q${idx + 1}`,
          content: q.content,
          options: {
            A: q.optionA,
            B: q.optionB,
            C: q.optionC,
            D: q.optionD,
          },
          correctAnswer: q.correctAnswer,
          hint: q.hint,
          feedback: q.feedback,
        })),
      };

      console.log("Quiz Data:", quizData);
      onSubmit(quizData);
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
          Create New Quiz
        </Title>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      destroyOnClose
      okText="Create Quiz"
      cancelText="Cancel"
      className={styles.createQuizModal}
      centered
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          questions: [{}],
          passingScore: 70,
          timeLimit: 30,
        }}
      >
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

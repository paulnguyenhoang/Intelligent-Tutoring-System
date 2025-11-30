import { Card, Form, Input, Radio, Row, Col, Button, Space, Typography, Collapse } from "antd";
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";
import type { FormListFieldData } from "antd";
import styles from "./QuestionFormItem.module.less";

const { TextArea } = Input;
const { Text } = Typography;

interface QuestionFormItemProps {
  field: FormListFieldData;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export default function QuestionFormItem({
  field,
  index,
  onRemove,
  canRemove,
}: QuestionFormItemProps) {
  return (
    <Card
      type="inner"
      className={styles.questionCard}
      title={
        <Space>
          <QuestionCircleOutlined />
          <Text strong>Question {index + 1}</Text>
        </Space>
      }
      extra={
        canRemove && (
          <Button type="text" danger icon={<DeleteOutlined />} onClick={onRemove}>
            Remove
          </Button>
        )
      }
    >
      {/* Question Content */}
      <Form.Item
        {...field}
        name={[field.name, "content"]}
        label={<Text strong>Question Text</Text>}
        rules={[{ required: true, message: "Please enter the question" }]}
      >
        <TextArea
          rows={3}
          placeholder="Enter your question here..."
          className={styles.questionTextArea}
        />
      </Form.Item>

      {/* Options Grid (2x2) */}
      <div className={styles.optionsSection}>
        <Text strong style={{ display: "block", marginBottom: 12 }}>
          Answer Options
        </Text>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              {...field}
              name={[field.name, "optionA"]}
              label="Option A"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter option A..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...field}
              name={[field.name, "optionB"]}
              label="Option B"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter option B..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...field}
              name={[field.name, "optionC"]}
              label="Option C"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter option C..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...field}
              name={[field.name, "optionD"]}
              label="Option D"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Enter option D..." />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* Correct Answer */}
      <Form.Item
        {...field}
        name={[field.name, "correctAnswer"]}
        label={<Text strong>Correct Answer</Text>}
        rules={[{ required: true, message: "Please select the correct answer" }]}
      >
        <Radio.Group className={styles.radioGroup}>
          <Radio.Button value="A">A</Radio.Button>
          <Radio.Button value="B">B</Radio.Button>
          <Radio.Button value="C">C</Radio.Button>
          <Radio.Button value="D">D</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* ITS Features - Hint & Feedback */}
      <Collapse
        ghost
        className={styles.advancedSettings}
        items={[
          {
            key: "1",
            label: (
              <Space>
                <SettingOutlined />
                <Text strong>Advanced Settings (Hint & Feedback)</Text>
              </Space>
            ),
            children: (
              <div className={styles.advancedContent}>
                <Form.Item
                  {...field}
                  name={[field.name, "hint"]}
                  label="Hint (Optional)"
                  tooltip="A helpful hint for students who get this question wrong"
                >
                  <TextArea rows={2} placeholder="Provide a hint to help students..." />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, "feedback"]}
                  label="Feedback (Optional)"
                  tooltip="Feedback shown after answering"
                >
                  <TextArea rows={2} placeholder="Explain why this is the correct answer..." />
                </Form.Item>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

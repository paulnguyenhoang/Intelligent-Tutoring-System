import { Modal, Form, Input } from "antd";
import { Course } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<Course, "id">) => void;
};

const CreateCourseForm = ({ open, onClose, onCreate }: Props) => {
  const [form] = Form.useForm();

  const onOk = async () => {
    const vals = await form.validateFields();
    onCreate(vals);
    form.resetFields();
    onClose();
  };

  return (
    <Modal title="Create Course" open={open} onOk={onOk} onCancel={onClose} destroyOnClose>
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Content (text or YouTube link)">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourseForm;

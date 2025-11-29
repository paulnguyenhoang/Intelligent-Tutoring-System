import { Modal, Form, Input } from "antd";
import { Course } from "../types";

type Props = {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Course>) => void;
};

const EditCourseModal = ({ open, course, onClose, onUpdate }: Props) => {
  const [form] = Form.useForm();

  const onOk = async () => {
    if (!course) return;
    const vals = await form.validateFields();
    onUpdate(course.id, vals);
    onClose();
  };

  return (
    <Modal title="Edit Course" open={open} onOk={onOk} onCancel={onClose} destroyOnClose>
      <Form form={form} layout="vertical" initialValues={course || {}}>
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

export default EditCourseModal;

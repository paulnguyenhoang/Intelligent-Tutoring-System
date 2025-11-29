import { Modal, Form, Input, Select } from "antd";
import type { Course } from "../types";

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
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
          <Select options={[
            { label: "Web Development", value: "Web Development" },
            { label: "UI/UX Design", value: "UI/UX Design" },
            { label: "Data Science", value: "Data Science" },
            { label: "Marketing", value: "Marketing" },
            { label: "Programming", value: "Programming" },
          ]} />
        </Form.Item>

        <Form.Item name="thumbnail" label="Thumbnail URL" rules={[{ required: true, type: 'url', message: "Please enter a valid URL for the thumbnail" }]}>
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

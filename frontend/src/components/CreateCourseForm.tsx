import { useState } from "react";
import { Modal, Form, Input, Select, Upload, message } from "antd";
import { InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import type { Course } from "../types";
import type { RcFile } from "antd/es/upload/interface";

const { Dragger } = Upload; // Sử dụng Dragger để chiếm trọn chiều ngang

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<Course, "id">) => void;
};

const CreateCourseForm = ({ open, onClose, onCreate }: Props) => {
  const [form] = Form.useForm();
  // State để lưu ảnh preview và kiểm soát hiển thị text
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const convertFileToBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (file: RcFile) => {
    const base64 = await convertFileToBase64(file);
    // Lưu vào form để submit
    form.setFieldValue("thumbnail", base64);
    // Lưu vào state để hiển thị preview
    setPreviewImage(base64);
    message.success("Thumbnail uploaded successfully!");
    return false; // Prevent default upload behavior (không gửi request lên server ngay)
  };

  const onOk = async () => {
    try {
      const vals = await form.validateFields();
      onCreate(vals);
      handleCancel(); // Gọi hàm reset chung
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  // Reset form và state ảnh khi đóng
  const handleCancel = () => {
    form.resetFields();
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal
      title="Create Course"
      open={open}
      onOk={onOk}
      onCancel={handleCancel}
      destroyOnClose
      width={600} // Tăng chiều rộng modal một chút cho đẹp
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter course title" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder="Select a category"
            options={[
              { label: "Web Development", value: "Web Development" },
              { label: "UI/UX Design", value: "UI/UX Design" },
              { label: "Data Science", value: "Data Science" },
              { label: "Marketing", value: "Marketing" },
              { label: "Programming", value: "Programming" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="Thumbnail"
          rules={[{ required: true, message: "Please upload a thumbnail image" }]}
        >
          {/* Dùng Dragger thay vì Upload thường */}
          <Dragger
            accept="image/*"
            beforeUpload={handleUpload}
            maxCount={1}
            showUploadList={false} // Tắt list mặc định để tự custom giao diện bên trong
            style={{ padding: 20, background: '#fafafa' }}
          >
            {previewImage ? (
              // Giao diện KHI ĐÃ CÓ ẢNH
              <div className="flex flex-col items-center justify-center">
                <img
                  src={previewImage}
                  alt="thumbnail preview"
                  style={{
                    maxHeight: 200,
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
                <div style={{ color: "#1677ff", fontWeight: 500 }}>
                  <CloudUploadOutlined style={{ marginRight: 8 }} />
                  Change File
                </div>
              </div>
            ) : (
              // Giao diện KHI CHƯA CÓ ẢNH
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single upload. Strictly prohibited from uploading
                  company data or other banned files.
                </p>
              </>
            )}
          </Dragger>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourseForm;
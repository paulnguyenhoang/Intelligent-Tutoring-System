import { useState } from "react";
import { Modal, Form, Input, Select, Upload, message } from "antd";
import { InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { createCourse } from "../services/apiService";

const { Dragger } = Upload;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const CreateCourseForm = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<RcFile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: RcFile) => {
    try {
      // 1. Store the actual File object for upload
      setUploadedFile(file);
      
      // 2. Create a preview URL from the file
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // 3. Store file object in form (as placeholder, actual file will be sent separately)
      form.setFieldValue("thumbnail", file.name);
      
      message.success("Thumbnail selected successfully!");
    } catch {
      message.error("Failed to select image");
    }
    return false; // Chặn upload mặc định
  };

  const onOk = async () => {
    try {
      setLoading(true);
      const vals = await form.validateFields();

      // Tạo course data object
      const courseData = {
        title: vals.title,
        category: vals.category,
        description: vals.description || "",
      };

      // Gọi apiService.createCourse() trực tiếp
      await createCourse(courseData, uploadedFile || undefined);

      message.success("Course created successfully!");
      onSuccess?.(); // Gọi callback để parent refresh danh sách
      handleCancel();
    } catch (error) {
      console.error("Failed to create course:", error);
      message.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage(null);
    setUploadedFile(null);
    onClose();
  };

  return (
    <Modal
      title="Create Course"
      open={open}
      onOk={onOk}
      onCancel={handleCancel}
      destroyOnClose
      width={600}
      okButtonProps={{ loading }}
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

        {/* --- KHU VỰC UPLOAD ẢNH --- */}
        
        {/* Field ẩn chứa chuỗi Base64 để gửi đi */}
        <Form.Item 
          name="thumbnail" 
          hidden 
          rules={[{ required: true, message: "Please upload a thumbnail" }]}
        >
          <Input /> 
        </Form.Item>

        <Form.Item label="Thumbnail" required>
          <Dragger
            accept="image/*"
            beforeUpload={handleUpload} // Hàm này giờ trả về Base64
            maxCount={1}
            showUploadList={false}
            style={{ padding: 20, background: '#fafafa' }}
          >
            {previewImage ? (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={previewImage}
                  alt="thumbnail preview"
                  style={{
                    height: 180,
                    width: "100%",
                    objectFit: "cover",
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
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports: PNG, JPG, JPEG, WEBP
                </p>
              </>
            )}
          </Dragger>
        </Form.Item>
        {/* --- HẾT KHU VỰC UPLOAD --- */}

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourseForm;
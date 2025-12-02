import { useState } from "react";
import { Modal, Form, Input, Select, Upload, message } from "antd";
import { InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import type { Course } from "../types";
import type { RcFile } from "antd/es/upload/interface";

const { Dragger } = Upload;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<Course, "id">) => void;
};

const CreateCourseForm = ({ open, onClose, onCreate }: Props) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Hàm chuyển đổi File sang Base64
  const convertFileToBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (file: RcFile) => {
    try {
      // 1. Chuyển file sang chuỗi Base64
      const base64String = await convertFileToBase64(file);
      
      // 2. Gán chuỗi Base64 này vào form field 'thumbnail'
      form.setFieldValue("thumbnail", base64String);
      
      // 3. Hiển thị ảnh preview bằng chính chuỗi Base64 đó
      setPreviewImage(base64String);
      
      message.success("Thumbnail selected successfully!");
    } catch (err) {
      message.error("Failed to select image");
    }
    return false; // Chặn upload mặc định
  };

  const onOk = async () => {
    try {
      const vals = await form.validateFields();
      
      // Nếu chưa có ảnh thì dùng ảnh mặc định
      if (!vals.thumbnail) {
        vals.thumbnail = "https://placehold.co/600x400?text=No+Image";
      }

      // Lúc này vals.thumbnail là chuỗi Base64 rất dài
      onCreate(vals);
      handleCancel();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

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
      width={600}
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
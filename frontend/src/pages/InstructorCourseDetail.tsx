import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Select,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  InboxOutlined, // 1. Import thêm icon Inbox
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";

import { getCourses } from "../services/courseService";
import { Course } from "../types";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload; // 2. Sử dụng Dragger

interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT";
  content: string;
  duration: string;
}

const mockLessons: Lesson[] = [
  {
    id: "l1",
    title: "Introduction to React",
    type: "VIDEO",
    content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:30",
  },
];

export default function InstructorCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [openModal, setOpenModal] = useState(false);
  
  // 3. State để lưu tên file video sau khi upload (để hiển thị UI)
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  
  const [form] = Form.useForm();

  useEffect(() => {
    const allCourses = getCourses();
    const foundCourse = allCourses.find((c) => c.id === id);
    setCourse(foundCourse);
  }, [id]);

  const handleAddLesson = async () => {
    try {
      const vals = await form.validateFields();
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...vals,
      };
      setLessons([...lessons, newLesson]);
      handleCloseModal(); // Reset form khi đóng
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setVideoFileName(null); // Reset tên file video
    setOpenModal(false);
  };

  const convertFileToBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleVideoUpload = async (file: RcFile) => {
    try {
      const base64 = await convertFileToBase64(file);
      form.setFieldValue("content", base64);
      setVideoFileName(file.name); // Lưu tên file để hiển thị
      message.success("Video uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload video");
    }
    return false; 
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter((l) => l.id !== lessonId));
  };

  const renderLessonIcon = (type: "VIDEO" | "TEXT") => {
    if (type === "VIDEO") {
      return <PlayCircleOutlined className="text-blue-500 text-lg" />;
    }
    return <FileTextOutlined className="text-green-500 text-lg" />;
  };

  const truncateUrl = (url: string, length: number = 50) => {
    return url.length > length ? url.substring(0, length) + "..." : url;
  };

  if (!course) {
    return (
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/teacher")} // Sửa link cho đúng route của bạn
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        <Card>
          <Empty description={`Course with ID ${id} not found`} />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/teacher")}
        className="mb-6"
      >
        Back to Dashboard
      </Button>

      {/* Course Header */}
      <Card className="rounded-lg shadow mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <Title level={3} className="m-0 mb-2">
              {course.title}
            </Title>
            <div className="flex items-center gap-3 mb-4">
              {course.category && <Tag color="blue">{course.category}</Tag>}
            </div>
            <Paragraph className="text-gray-700 mb-0">
              {course.description}
            </Paragraph>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
          >
            Add New Lesson
          </Button>
        </div>
      </Card>

      {/* Lesson List */}
      <Card className="rounded-lg shadow">
        <Title level={4} className="mb-4">
          Curriculum ({lessons.length} lessons)
        </Title>

        {lessons.length === 0 ? (
          <Empty description="No lessons yet. Click 'Add New Lesson' to get started!" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={(lesson, index) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => console.log("Edit lesson:", lesson.id)}
                  >
                    Edit
                  </Button>,
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    Delete
                  </Button>,
                ]}
                className="py-4"
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center justify-center w-10 h-10">
                      {renderLessonIcon(lesson.type)}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">
                        {index + 1}. {lesson.title}
                      </span>
                      <Tag color={lesson.type === "VIDEO" ? "cyan" : "green"}>
                        {lesson.type === "VIDEO" ? "Video" : "Text/Article"}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="text-sm text-gray-600 mt-2">
                      {lesson.type === "VIDEO" ? (
                        <>
                          <div className="mb-1">
                            <Text code>{truncateUrl(lesson.content)}</Text>
                          </div>
                          <div>Duration: {lesson.duration}</div>
                        </>
                      ) : (
                        <>
                          <div className="mb-1 line-clamp-2">
                            {lesson.content}
                          </div>
                          <div>Read time: {lesson.duration}</div>
                        </>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Add Lesson Modal */}
      <Modal
        title="Add New Lesson"
        open={openModal}
        onOk={handleAddLesson}
        onCancel={handleCloseModal} // Sử dụng hàm handleCloseModal để reset state
        destroyOnClose
        width={600} // Tăng độ rộng modal
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Lesson Title"
            rules={[{ required: true, message: "Please enter a lesson title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Lesson Type"
            rules={[{ required: true, message: "Please select a lesson type" }]}
          >
            <Select
              options={[
                { label: "Video", value: "VIDEO" },
                { label: "Text/Article", value: "TEXT" },
              ]}
            />
          </Form.Item>

          {/* Conditional: Video URL Input */}
          <Form.Item noWrapperCol={{ span: 24 }} shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("type") === "VIDEO" ? (
                <>
                  <Form.Item
                    name="content"
                    label="Video URL (Optional)"
                    rules={[
                      { type: "url", message: "Please enter a valid URL" },
                    ]}
                  >
                    <Input placeholder="https://www.youtube.com/watch?v=..." />
                  </Form.Item>

                  <Form.Item label="Or Upload Video File">
                    {/* 4. Dragger Component cho Video */}
                    <Dragger
                      accept="video/*"
                      beforeUpload={handleVideoUpload}
                      maxCount={1}
                      showUploadList={false}
                      style={{ padding: 20, background: '#fafafa' }}
                    >
                      {videoFileName ? (
                        // Giao diện khi đã có file
                        <div className="flex flex-col items-center justify-center">
                          <PlayCircleOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 10 }} />
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{videoFileName}</div>
                          <div style={{ color: "#1677ff", fontSize: 13 }}>
                            <CloudUploadOutlined style={{ marginRight: 6 }} />
                            Change Video
                          </div>
                        </div>
                      ) : (
                        // Giao diện khi chưa có file
                        <>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag video file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Supported formats: MP4, MOV, AVI...
                          </p>
                        </>
                      )}
                    </Dragger>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          {/* Conditional: Text Content */}
          <Form.Item noWrapperCol={{ span: 24 }} shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("type") === "TEXT" ? (
                <Form.Item
                  name="content"
                  label="Lesson Content"
                  rules={[
                    { required: true, message: "Please enter lesson content" },
                  ]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Write your lesson content here..."
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (Optional)"
            placeholder="e.g., 15:30 or 10 mins read"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
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
  InboxOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";

import { getCourses } from "../services/courseService";
import { Course } from "../types";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

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
    content: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Link YouTube mẫu
    duration: "15:30",
  },
];

export default function InstructorCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [openModal, setOpenModal] = useState(false);
  
  // --- 1. State mới cho Video Player Modal ---
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  // -------------------------------------------

  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const allCourses = getCourses();
    const foundCourse = allCourses.find((c) => c.id === id);
    setCourse(foundCourse);
  }, [id]);

  // Hàm xử lý khi bấm vào bài học Video
  const handlePlayVideo = (lesson: Lesson) => {
    if (lesson.type === "VIDEO") {
      setCurrentVideoUrl(lesson.content);
      setVideoModalOpen(true);
    } else {
      message.info("This is a text lesson.");
    }
  };

  const handleAddLesson = async () => {
    try {
      const vals = await form.validateFields();
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...vals,
      };
      setLessons([...lessons, newLesson]);
      handleCloseModal();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setVideoFileName(null);
    setOpenModal(false);
  };

  const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const handleVideoUpload = async (file: RcFile) => {
  try {
    const previewUrl = URL.createObjectURL(file);
    
    // --- BẮT ĐẦU LOGIC DETECT DURATION ---
    // Tạo một element video ảo trong bộ nhớ (không hiển thị ra UI)
    const videoElement = document.createElement("video");
    videoElement.src = previewUrl;
    
    // Lắng nghe sự kiện khi video load xong thông tin
    videoElement.onloadedmetadata = () => {
      // Lấy thời lượng (tính bằng giây)
      const durationSec = videoElement.duration;
      if (durationSec && !isNaN(durationSec)) {
        // Format thành chuỗi "MM:SS" (ví dụ: "05:30")
        const formattedTime = formatDuration(durationSec);
        // Tự động điền vào ô Duration trong form
        form.setFieldValue("duration", formattedTime);
        message.success(`Video duration detected: ${formattedTime}`);
      }
    };
    // --- KẾT THÚC LOGIC DETECT ---

    form.setFieldValue("content", previewUrl);
    setVideoFileName(file.name);
    message.success("Video selected successfully!");
  } catch (error) {
    message.error("Failed to select video");
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
          onClick={() => navigate("/instructor/dashboard")}
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
        onClick={() => navigate("/instructor/dashboard")}
        className="mb-6"
      >
        Back to Dashboard
      </Button>

      <Card className="rounded-lg shadow mb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <Title level={3} className="m-0 mb-2">{course.title}</Title>
            <div className="flex items-center gap-3 mb-4">
              {course.category && <Tag color="blue">{course.category}</Tag>}
            </div>
            <Paragraph className="text-gray-700 mb-0">{course.description}</Paragraph>
          </div>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
            Add New Lesson
          </Button>
        </div>
      </Card>

      <Card className="rounded-lg shadow">
        <Title level={4} className="mb-4">Curriculum ({lessons.length} lessons)</Title>
        {lessons.length === 0 ? (
          <Empty description="No lessons yet. Click 'Add New Lesson' to get started!" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={(lesson, index) => (
              <List.Item
                actions={[
                  <Button type="text" icon={<EditOutlined />} size="small">Edit</Button>,
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteLesson(lesson.id)}>Delete</Button>,
                ]}
                className="py-4"
              >
                <List.Item.Meta
                  avatar={
                    // --- 2. Bấm vào icon cũng Play video ---
                    <div 
                      className="flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-gray-100 rounded-full transition"
                      onClick={() => handlePlayVideo(lesson)}
                    >
                      {renderLessonIcon(lesson.type)}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-3">
                      {/* --- 3. Bấm vào tiêu đề cũng Play video --- */}
                      <span 
                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition"
                        onClick={() => handlePlayVideo(lesson)}
                      >
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
                          <div className="mb-1 cursor-pointer hover:underline" onClick={() => handlePlayVideo(lesson)}>
                            <Text code>{truncateUrl(lesson.content)}</Text>
                          </div>
                          <div>Duration: {lesson.duration}</div>
                        </>
                      ) : (
                        <>
                          <div className="mb-1 line-clamp-2">{lesson.content}</div>
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

      {/* --- 4. VIDEO PLAYER MODAL --- */}
      <Modal
        title="Lesson Preview"
        open={videoModalOpen}
        onCancel={() => {
            setVideoModalOpen(false);
            setCurrentVideoUrl(null); // Reset URL để dừng video khi đóng modal
        }}
        footer={null} // Không cần nút OK/Cancel
        width={800}
        destroyOnClose // Quan trọng: Đóng modal là tắt hẳn video
        centered
      >
        {currentVideoUrl && (
            <div style={{ width: '100%', height: '450px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Logic: Nếu là link YouTube thì dùng Iframe, nếu là file upload (blob:) thì dùng thẻ Video */}
                {currentVideoUrl.includes("youtube.com") || currentVideoUrl.includes("youtu.be") ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={currentVideoUrl}
                        title="Video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <video 
                        src={currentVideoUrl} 
                        controls 
                        autoPlay 
                        style={{ maxWidth: '100%', maxHeight: '100%' }} 
                    />
                )}
            </div>
        )}
      </Modal>

      {/* Add Lesson Modal (Giữ nguyên) */}
      <Modal
        title="Add New Lesson"
        open={openModal}
        onOk={handleAddLesson}
        onCancel={handleCloseModal}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Lesson Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Lesson Type" rules={[{ required: true }]}>
            <Select options={[{ label: "Video", value: "VIDEO" }, { label: "Text/Article", value: "TEXT" }]} />
          </Form.Item>
          <Form.Item noWrapperCol={{ span: 24 }} shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("type") === "VIDEO" ? (
                <>
                  <Form.Item name="content" label="Video URL (Optional)">
                    <Input placeholder="https://www.youtube.com/watch?v=..." />
                  </Form.Item>
                  <Form.Item label="Or Upload Video File">
                    <Dragger accept="video/*" beforeUpload={handleVideoUpload} maxCount={1} showUploadList={false} style={{ padding: 20, background: '#fafafa' }}>
                      {videoFileName ? (
                        <div className="flex flex-col items-center justify-center">
                          <PlayCircleOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 10 }} />
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{videoFileName}</div>
                          <div style={{ color: "#1677ff", fontSize: 13 }}><CloudUploadOutlined style={{ marginRight: 6 }} />Change Video</div>
                        </div>
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                          <p className="ant-upload-text">Click or drag video file to this area to upload</p>
                        </>
                      )}
                    </Dragger>
                  </Form.Item>
                </>
              ) : getFieldValue("type") === "TEXT" ? (
                <Form.Item name="content" label="Lesson Content" rules={[{ required: true }]}>
                  <Input.TextArea rows={6} placeholder="Write your lesson content here..." />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item name="duration" label="Duration (Optional)"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
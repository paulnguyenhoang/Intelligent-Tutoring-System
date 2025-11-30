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
  FilePdfOutlined,   // Icon cho PDF
  FileWordOutlined,  // Icon cho Word
  PlayCircleOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  InboxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";

import { getCourses } from "../services/courseService";
import { Course } from "../types";

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "PDF" | "WORD"; // Cập nhật loại bài học
  content: string; // URL (Blob URL hoặc Link)
  duration: string;
  fileName?: string; // Lưu tên file gốc để hiển thị
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
  
  // State cho Video Player Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  // State để hiển thị tên file đang upload trong Form (Dùng chung cho Video, PDF, Word)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const [form] = Form.useForm();

  useEffect(() => {
    const allCourses = getCourses();
    const foundCourse = allCourses.find((c) => c.id === id);
    setCourse(foundCourse);
  }, [id]);

  // --- XỬ LÝ KHI BẤM VÀO BÀI HỌC ---
  const handleOpenLesson = (lesson: Lesson) => {
    if (lesson.type === "VIDEO") {
      setCurrentVideoUrl(lesson.content);
      setVideoModalOpen(true);
    } else {
      // Nếu là PDF hoặc Word -> Mở trong tab mới (Trình duyệt tự xử lý view/download)
      window.open(lesson.content, "_blank");
    }
  };

  const handleAddLesson = async () => {
    try {
      const vals = await form.validateFields();
      
      // Nếu user chọn upload file, content đã được set bởi handleFileUpload
      // Nếu user nhập link video, content lấy từ input
      
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...vals,
        fileName: uploadedFileName || undefined, // Lưu tên file nếu có
      };
      
      setLessons([...lessons, newLesson]);
      handleCloseModal();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setUploadedFileName(null);
    setOpenModal(false);
  };

  // Hàm detect thời lượng video (giữ nguyên logic cũ)
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- XỬ LÝ UPLOAD CHUNG (VIDEO, PDF, WORD) ---
  const handleFileUpload = async (file: RcFile, type: "VIDEO" | "PDF" | "WORD") => {
    try {
      const previewUrl = URL.createObjectURL(file);
      
      // Logic riêng cho Video để lấy thời lượng
      if (type === "VIDEO") {
        const videoElement = document.createElement("video");
        videoElement.src = previewUrl;
        videoElement.onloadedmetadata = () => {
          const durationSec = videoElement.duration;
          if (durationSec && !isNaN(durationSec)) {
            const formattedTime = formatDuration(durationSec);
            form.setFieldValue("duration", formattedTime);
            message.success(`Video duration: ${formattedTime}`);
          }
        };
      } else {
        // Với PDF/Word, có thể lấy kích thước file làm duration giả (vd: 2MB)
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
        form.setFieldValue("duration", `${sizeInMb} MB`);
      }

      form.setFieldValue("content", previewUrl);
      setUploadedFileName(file.name);
      message.success(`${type} selected successfully!`);
    } catch (error) {
      message.error("Failed to select file");
    }
    return false; // Chặn upload mặc định
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter((l) => l.id !== lessonId));
  };

  // Render Icon theo loại
  const renderLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircleOutlined className="text-blue-500 text-lg" />;
      case "PDF":
        return <FilePdfOutlined className="text-red-500 text-lg" />;
      case "WORD":
        return <FileWordOutlined className="text-blue-700 text-lg" />;
      default:
        return <FileTextOutlined className="text-gray-500 text-lg" />;
    }
  };

  const truncateUrl = (url: string, length: number = 50) => {
    if (url.startsWith("blob:")) return "Uploaded File"; // Hiển thị đẹp hơn cho file upload
    return url.length > length ? url.substring(0, length) + "..." : url;
  };

  if (!course) {
    return (
      <div className="p-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/instructor/dashboard")} className="mb-4">
          Back to Dashboard
        </Button>
        <Card><Empty description={`Course not found`} /></Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/instructor/dashboard")} className="mb-6">
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
          <Empty description="No lessons yet." />
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
                    <div 
                      className="flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-gray-100 rounded-full transition"
                      onClick={() => handleOpenLesson(lesson)}
                    >
                      {renderLessonIcon(lesson.type)}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-3">
                      <span 
                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition"
                        onClick={() => handleOpenLesson(lesson)}
                      >
                        {index + 1}. {lesson.title}
                      </span>
                      <Tag color={lesson.type === "VIDEO" ? "cyan" : lesson.type === "PDF" ? "red" : "blue"}>
                        {lesson.type}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="text-sm text-gray-600 mt-2">
                        {/* Hiển thị tên file nếu có, không thì hiện URL */}
                        <div className="mb-1 cursor-pointer hover:underline" onClick={() => handleOpenLesson(lesson)}>
                            {lesson.type === "VIDEO" ? (
                                <Text code>{lesson.fileName || truncateUrl(lesson.content)}</Text>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Text strong>{lesson.fileName || "Document"}</Text>
                                </div>
                            )}
                        </div>
                        <div>
                            {lesson.type === "VIDEO" ? "Duration: " : "Size: "} 
                            {lesson.duration}
                        </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Video Preview Modal */}
      <Modal
        title="Lesson Preview"
        open={videoModalOpen}
        onCancel={() => { setVideoModalOpen(false); setCurrentVideoUrl(null); }}
        footer={null}
        width={800}
        destroyOnClose
        centered
      >
        {currentVideoUrl && (
            <div style={{ width: '100%', height: '450px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentVideoUrl.includes("youtube.com") || currentVideoUrl.includes("youtu.be") ? (
                    <iframe width="100%" height="100%" src={currentVideoUrl} frameBorder="0" allowFullScreen></iframe>
                ) : (
                    <video src={currentVideoUrl} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%' }} />
                )}
            </div>
        )}
      </Modal>

      {/* Add Lesson Modal */}
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
            <Select 
                options={[
                    { label: "Video", value: "VIDEO" },
                    { label: "PDF Document", value: "PDF" },
                    { label: "Word Document", value: "WORD" }
                ]} 
                onChange={() => {
                    // Reset file name khi đổi loại để tránh nhầm lẫn
                    setUploadedFileName(null);
                    form.setFieldValue("content", null);
                }}
            />
          </Form.Item>

          <Form.Item noWrapperCol={{ span: 24 }} shouldUpdate>
            {({ getFieldValue }) => {
                const type = getFieldValue("type");
                
                // === TRƯỜNG HỢP VIDEO ===
                if (type === "VIDEO") {
                    return (
                        <>
                            <Form.Item name="content" label="Video URL (Optional)">
                                <Input placeholder="https://www.youtube.com/..." />
                            </Form.Item>
                            <Form.Item label="Or Upload Video File">
                                <Dragger accept="video/*" beforeUpload={(f) => handleFileUpload(f, "VIDEO")} maxCount={1} showUploadList={false}>
                                    {uploadedFileName ? (
                                        <div className="flex flex-col items-center"><PlayCircleOutlined className="text-2xl text-blue-500 mb-2" /><div>{uploadedFileName}</div></div>
                                    ) : (
                                        <div className="p-4 text-center"><InboxOutlined className="text-2xl" /><p>Click or drag video to upload</p></div>
                                    )}
                                </Dragger>
                            </Form.Item>
                        </>
                    );
                }
                
                // === TRƯỜNG HỢP PDF HOẶC WORD ===
                if (type === "PDF" || type === "WORD") {
                    const acceptType = type === "PDF" ? ".pdf" : ".doc,.docx";
                    const icon = type === "PDF" ? <FilePdfOutlined className="text-2xl text-red-500" /> : <FileWordOutlined className="text-2xl text-blue-700" />;
                    
                    return (
                        <Form.Item 
                            label={`Upload ${type === "PDF" ? "PDF" : "Word"} Document`} 
                            required // Bắt buộc upload file cho tài liệu
                            rules={[{
                                validator: () => uploadedFileName ? Promise.resolve() : Promise.reject("Please upload a file")
                            }]}
                        >
                            <Dragger accept={acceptType} beforeUpload={(f) => handleFileUpload(f, type)} maxCount={1} showUploadList={false}>
                                {uploadedFileName ? (
                                    <div className="flex flex-col items-center">
                                        {icon}
                                        <div className="mt-2 font-medium">{uploadedFileName}</div>
                                        <div className="text-blue-500 text-xs mt-1">Click to change</div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <InboxOutlined className="text-2xl" />
                                        <p>Click or drag {type} file here</p>
                                    </div>
                                )}
                            </Dragger>
                            {/* Input ẩn để lưu URL Blob vào Form */}
                            <Form.Item name="content" hidden><Input /></Form.Item>
                        </Form.Item>
                    );
                }
                return null;
            }}
          </Form.Item>

          <Form.Item name="duration" label={form.getFieldValue("type") === "VIDEO" ? "Duration" : "Size/Info"}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, Button, Card, Empty, List, Modal, Tag, Typography } from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getCourses } from "../services/courseService";
import { getLessonsByCourse, type Lesson } from "../services/lessonService";
import type { Course } from "../types";

const { Title, Paragraph, Text } = Typography;

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Load course from localStorage
      const allCourses = getCourses();
      const foundCourse = allCourses.find((c) => c.id === id);
      setCourse(foundCourse);

      // Load lessons for this course
      const courseLessons = getLessonsByCourse(id);
      setLessons(courseLessons);
    }
  }, [id]);

  const handleOpenLesson = (lesson: Lesson) => {
    if (lesson.type === "VIDEO") {
      setCurrentVideoUrl(lesson.content);
      setVideoModalOpen(true);
    } else {
      // For PDF or Word, open in new tab
      window.open(lesson.content, "_blank");
    }
  };

  const renderLessonIcon = (type: Lesson["type"]) => {
    const size = 28;
    switch (type) {
      case "VIDEO":
        return <PlayCircleOutlined style={{ fontSize: size, color: "#1890ff" }} />;
      case "PDF":
        return <FilePdfOutlined style={{ fontSize: size, color: "#f5222d" }} />;
      case "WORD":
        return <FileWordOutlined style={{ fontSize: size, color: "#1890ff" }} />;
      default:
        return <FileTextOutlined style={{ fontSize: size, color: "#6b7280" }} />;
    }
  };

  const getTypeLabel = (type: Lesson["type"]) => {
    switch (type) {
      case "VIDEO":
        return "Video";
      case "PDF":
        return "PDF";
      case "WORD":
        return "Document";
      default:
        return type;
    }
  };

  if (!course) {
    return (
      <div className="p-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="mb-4">
          Back to Courses
        </Button>
        <Card>
          <Empty description="Course not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="mb-4">
        Back to Courses
      </Button>

      {/* Course Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Title level={3} className="m-0">
              {course.title}
            </Title>
            <div className="flex items-center gap-3 mt-2">
              {course.instructor && (
                <>
                  <Avatar src={course.instructor.avatar} />
                  <div>
                    <Text strong>{course.instructor.name}</Text>
                    <div className="text-sm text-gray-500">Instructor</div>
                  </div>
                </>
              )}
            </div>
            {course.description && (
              <Paragraph className="mt-4 text-gray-700">{course.description}</Paragraph>
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <Card className="rounded-lg shadow">
        <Title level={4} className="mb-4">
          Curriculum ({lessons.length} lessons)
        </Title>

        {lessons.length === 0 ? (
          <Empty description="No lessons uploaded yet." />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={lessons}
            renderItem={(lesson: Lesson, index: number) => (
              <List.Item
                onClick={() => handleOpenLesson(lesson)}
                className="py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center justify-center w-10 h-10">
                      {renderLessonIcon(lesson.type)}
                    </div>
                  }
                  title={
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">
                        {index + 1}. {lesson.title}
                      </span>
                      <Tag color={lesson.type === "VIDEO" ? "blue" : "default"}>
                        {getTypeLabel(lesson.type)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="text-sm text-gray-500">
                      Duration: {lesson.duration}
                      {lesson.fileName && ` • ${lesson.fileName}`}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Video Player Modal */}
      <Modal
        title="Video Lesson"
        open={videoModalOpen}
        onCancel={() => {
          setVideoModalOpen(false);
          setCurrentVideoUrl(null);
        }}
        footer={null}
        width={800}
      >
        {currentVideoUrl && (
          <div className="aspect-video">
            <video src={currentVideoUrl} controls className="w-full h-full" />
          </div>
        )}
      </Modal>
    </div>
  );
}

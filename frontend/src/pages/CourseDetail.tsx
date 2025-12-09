import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, Button, Card, Empty, List, Tag, Typography } from "antd";
import { getCourses, getLessons } from "../services/apiService";
import { PlayCircleOutlined, FileTextOutlined } from "@ant-design/icons";
/* eslint-disable @typescript-eslint/no-explicit-any */
const { Title, Paragraph, Text } = Typography;

type MaterialType = "VIDEO" | "TEXT";

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  uploadedDate: string; // YYYY-MM-DD
  url: string;
}

interface Instructor {
  name: string;
  avatar?: string;
}

interface CourseMock {
  id: string;
  title: string;
  description?: string;
  instructor: Instructor;
  materials: Material[];
}

// We'll fetch course metadata and lessons from backend

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseMock | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const courses = await getCourses();
        const found = courses.find((c: any) => c.id === id);
        if (found) {
          setCourse({
            id: found.id,
            title: found.title,
            description: found.description,
            instructor: { name: typeof found.instructor === "string" ? found.instructor : "Instructor", avatar: undefined },
            materials: [],
          });

          const lessons = await getLessons(id as string);
          const mapped: Material[] = lessons.map((l: any) => ({
            id: l.id,
            title: l.title,
            type: l.materials?.type === "VIDEO" || l.type === "VIDEO" ? "VIDEO" : "TEXT",
            uploadedDate: l.createdDate || l.uploadedDate || "",
            url: l.materials?.content || l.content || "",
          }));
          setMaterials(mapped);
        }
      } catch (err) {
        console.error("Failed to load course details", err);
      }
    };

    load();
  }, [id]);

  if (!course) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate(-1)} className="mb-4">
          &larr; Back to Courses
        </Button>
        <Card>
          <Empty description={<span>Course not found</span>} />
        </Card>
      </div>
    );
  }

  const renderIcon = (type: MaterialType) => {
    const size = 28;
    switch (type) {
      case "VIDEO":
        return <PlayCircleOutlined style={{ fontSize: size, color: "#1890ff" }} />; // blue
      case "TEXT":
      default:
        return <FileTextOutlined style={{ fontSize: size, color: "#6b7280" }} />; // gray
    }
  };

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        &larr; Back to Courses
      </Button>

      {/* Course Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Title level={3} className="m-0">
              {course.title}
            </Title>
            <div className="flex items-center gap-3 mt-2">
              <Avatar src={course.instructor.avatar} />
              <div>
                <Text strong>{course.instructor.name}</Text>
                <div className="text-sm text-gray-500">Instructor</div>
              </div>
            </div>
            {course.description && (
              <Paragraph className="mt-4 text-gray-700">{course.description}</Paragraph>
            )}
          </div>
        </div>
      </div>

      {/* Materials List */}
      <Card className="rounded-lg shadow">
        <Title level={4} className="mb-4">
          Materials
        </Title>

        {materials.length === 0 ? (
          <Empty description={<span>No materials uploaded yet.</span>} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={materials}
            renderItem={(item: Material) => (
              <List.Item
                actions={[
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Uploaded: {item.uploadedDate}</div>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => window.open(item.url, "_blank")}
                      className="mt-2"
                    >
                      View Material
                    </Button>
                  </div>,
                ]}
                className="py-4"
              >
                <List.Item.Meta
                  avatar={<div className="flex items-center justify-center w-10 h-10">{renderIcon(item.type)}</div>}
                  title={
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">{item.title}</span>
                      <Tag color={item.type === "VIDEO" ? "blue" : "default"}>
                        {item.type === "VIDEO" ? "Video" : "Text"}
                      </Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
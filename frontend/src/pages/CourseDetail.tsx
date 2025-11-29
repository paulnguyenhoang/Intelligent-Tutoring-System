import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Empty, List, Tag, Typography } from "antd";
import { PlayCircleOutlined, FileTextOutlined } from "@ant-design/icons";
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

// Mock data (example content repository)
const mockCourses: CourseMock[] = [
  {
    id: "1",
    title: "React Fundamentals - Build Modern Web Apps",
    description:
      "Learn React from scratch with practical projects and a clear content repository of materials.",
    instructor: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    materials: [
      {
        id: "m1",
        title: "Introduction to React (Video)",
        type: "VIDEO",
        uploadedDate: "2023-10-01",
        url: "https://example.com/materials/react-intro",
      },
      {
        id: "m2",
        title: "JSX & Components (Text)",
        type: "TEXT",
        uploadedDate: "2023-10-05",
        url: "https://example.com/materials/jsx-components",
      },
    ],
  },
  {
    id: "2",
    title: "TypeScript Advanced Patterns",
    description: "A curated set of materials exploring advanced typing patterns.",
    instructor: { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=2" },
    materials: [
      {
        id: "m4",
        title: "Generics Deep Dive (Video)",
        type: "VIDEO",
        uploadedDate: "2023-09-20",
        url: "https://example.com/materials/ts-generics",
      },
      {
        id: "m5",
        title: "Utility Types Reference (Text)",
        type: "TEXT",
        uploadedDate: "2023-09-22",
        url: "https://example.com/materials/utility-types",
      },
    ],
  },
  {
    id: "3",
    title: "Tailwind CSS Mastery",
    description: "Hands-on materials for building beautiful interfaces with Tailwind.",
    instructor: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=3" },
    materials: [],
  },
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulate finding the course from mock data
  const course = mockCourses.find((c) => c.id === id);

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

        {course.materials.length === 0 ? (
          <Empty description={<span>No materials uploaded yet.</span>} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={course.materials}
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
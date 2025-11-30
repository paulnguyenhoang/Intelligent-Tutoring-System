import { useEffect, useState } from "react";
import { Layout, Typography, theme } from "antd"; // Import theme để lấy màu chuẩn
import { useNavigate } from "react-router-dom";
import CreateCourseForm from "../components/CreateCourseForm";
import EditCourseModal from "../components/EditCourseModal";
import CoursesList from "../components/CoursesList";
import { getCourses, createCourse, deleteCourse, updateCourse } from "../services/courseService";
import { Course } from "../types";

const { Header, Content } = Layout;

const TeacherDashboard = () => {
  const navigate = useNavigate();
  // Lấy token màu sắc từ Antd để background đồng bộ
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleCreate = (payload: Omit<Course, "id">) => {
    createCourse(payload);
    setCourses(getCourses());
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
    setCourses(getCourses());
  };

  const handleEdit = (c: Course) => {
    setSelectedCourse(c);
    setOpenEdit(true);
  };

  const handleUpdate = (id: string, data: Partial<Course>) => {
    updateCourse(id, data);
    setCourses(getCourses());
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 1. Header đổi sang màu trắng, xóa nút Create */}
      <Header style={{ padding: '0 24px', background: colorBgContainer, borderBottom: '1px solid #f0f0f0' }}>
        <Typography.Title level={4} style={{ margin: '14px 0' }}>
          Teacher Dashboard
        </Typography.Title>
      </Header>

      <Content style={{ margin: '24px 24px 0' }}>
        <CreateCourseForm
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreate={handleCreate}
        />
        <EditCourseModal
          open={openEdit}
          course={selectedCourse}
          onClose={() => setOpenEdit(false)}
          onUpdate={handleUpdate}
        />
        
        {/* 2. Truyền hàm mở form xuống CoursesList */}
        <CoursesList
          courses={courses}
          onCreate={() => setOpenCreate(true)} // <-- Truyền xuống đây
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Content>
    </Layout>
  );
};

export default TeacherDashboard;
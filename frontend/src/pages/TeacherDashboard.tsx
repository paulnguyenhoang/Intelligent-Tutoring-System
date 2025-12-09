import { useCallback, useEffect, useState } from "react";
import { Layout, Typography, theme, message } from "antd";
import CreateCourseForm from "../components/CreateCourseForm";
import EditCourseModal from "../components/EditCourseModal";
import CoursesList from "../components/CoursesList";
import { getInstructorCourses, deleteCourse as apiDeleteCourse } from "../services/apiService";
import type { Course } from "../types";
import styles from "./TeacherDashboard.module.less";

const { Header, Content } = Layout;

const TeacherDashboard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const getInstructorId = useCallback((): string => {
    const userStr = localStorage.getItem("its_user");
    if (!userStr) return "";
    try {
      const user = JSON.parse(userStr);
      return user.username || "";
    } catch {
      return "";
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const instructorId = localStorage.getItem("its_user_id");
      if (!instructorId) {
        message.error("Please log in first");
        return;
      }
      const fetchedCourses = await getInstructorCourses(instructorId);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to load courses");
    }
  }, [getInstructorId]);

  useEffect(() => {
    const loadCourses = async () => {
      await fetchCourses();
    };
    loadCourses();
  }, [fetchCourses]);

  const handleCreate = useCallback(async () => {
    // CreateCourseForm now handles the API call directly
    // This function will be called via onSuccess callback to refresh the list
    await fetchCourses();
    setOpenCreate(false);
  }, [fetchCourses]);

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteCourse(id);
      message.success("Course deleted successfully");
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course");
    }
  };

  const handleEdit = (c: Course) => {
    setSelectedCourse(c);
    setOpenEdit(true);
  };

  const handleUpdate = () => {
    message.info("Update feature coming soon");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: "0 24px",
          background: colorBgContainer,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography.Title level={4} style={{ margin: "14px 0" }}>
          Teacher Dashboard
        </Typography.Title>
      </Header>

      <Content style={{ margin: "24px 24px 0" }}>
        <div className={styles.container}>
          <CreateCourseForm
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSuccess={handleCreate}
          />
          <EditCourseModal
            open={openEdit}
            course={selectedCourse}
            onClose={() => setOpenEdit(false)}
            onUpdate={handleUpdate}
          />

          <CoursesList
            courses={courses}
            onCreate={() => setOpenCreate(true)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default TeacherDashboard;

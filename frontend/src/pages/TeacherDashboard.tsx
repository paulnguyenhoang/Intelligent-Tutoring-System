import { useEffect, useState } from "react";
import { Button, Layout, Space, Typography } from "antd";
import CreateCourseForm from "../components/CreateCourseForm";
import EditCourseModal from "../components/EditCourseModal";
import CourseDetailModal from "../components/CourseDetailModal";
import CoursesList from "../components/CoursesList";
import { getCourses, createCourse, deleteCourse, updateCourse } from "../services/courseService";
import type { Course } from "../types";
import styles from "./TeacherDashboard.module.less";

const { Header, Content } = Layout;

const TeacherDashboard = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
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

  const handleView = (c: Course) => {
    setSelectedCourse(c);
    setOpenView(true);
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
    <Layout>
      <Header className={styles.dashboardHeader}>
        <Typography.Title level={4} className={styles.dashboardTitle}>
          Teacher Dashboard
        </Typography.Title>
        <Space>
          <Button type="primary" onClick={() => setOpenCreate(true)}>
            Create Course
          </Button>
        </Space>
      </Header>
      <Content className={styles.dashboardContent}>
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
        <CourseDetailModal
          open={openView}
          course={selectedCourse}
          onClose={() => setOpenView(false)}
        />
        <CoursesList
          courses={courses}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Content>
    </Layout>
  );
};

export default TeacherDashboard;

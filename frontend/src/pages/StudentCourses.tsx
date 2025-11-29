import { useState, useEffect } from "react";
import { Card, List, Button, Empty } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { Course } from "../types";
import { getCourses } from "../services/courseService";
import CourseDetailModal from "../components/CourseDetailModal";
import styles from "./StudentCourses.module.less";

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openView, setOpenView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleView = (course: Course) => {
    setSelectedCourse(course);
    setOpenView(true);
  };

  return (
    <div className={styles.container}>
      <Card title="Available Courses">
        {courses.length === 0 ? (
          <Empty description="No courses available yet. Check back later!" />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
            dataSource={courses}
            renderItem={(course) => (
              <List.Item>
                <Card
                  className={styles.courseCard}
                  actions={[
                    <Button
                      key="view"
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(course)}
                    >
                      View Course
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={course.title}
                    description={course.description || "No description"}
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      {selectedCourse && (
        <CourseDetailModal
          open={openView}
          course={selectedCourse}
          onClose={() => {
            setOpenView(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}

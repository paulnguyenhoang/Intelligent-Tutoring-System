import { useState, useEffect } from "react";
import { Card, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import type { Course } from "../types";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/apiService";
import styles from "./StudentCourses.module.less";
export default function StudentCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleView = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Card title="Available Courses">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Card title="Available Courses">
          <Empty description={error} />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card title="Available Courses">
        {courses.length === 0 ? (
          <Empty description="No courses available yet. Check back later!" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleView(course)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

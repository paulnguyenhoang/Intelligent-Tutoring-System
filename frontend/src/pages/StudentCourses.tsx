import { useState } from "react";
import { Card, Empty } from "antd";
import { useNavigate } from "react-router-dom"; // 1. Import hook này
import type { Course } from "../types";
import CourseCard from "../components/CourseCard";
import styles from "./StudentCourses.module.less";

// 2. Xóa import CourseDetailModal vì không dùng nữa

export default function StudentCourses() {
  const navigate = useNavigate(); // 3. Khởi tạo navigate

  // Mock data (giữ nguyên như cũ)
  const mockCourses: Course[] = [
    {
      id: "1",
      title: "React Fundamentals - Build Modern Web Apps",
      description: "Learn React from scratch with practical projects and real-world examples",
      thumbnail: "https://www.creativeitinstitute.com/images/course/course_1663052056.jpg",
      category: "Web Development",
      instructor: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      lessonsWatched: 5,
      totalLessons: 12,
    },
    {
        id: "2",
        title: "TypeScript Advanced Patterns",
        description: "Master advanced TypeScript concepts for scalable applications",
        thumbnail: "https://topdev.vn/blog/wp-content/uploads/2024/07/cac-kieu-du-lieu-trong-typescript-ma-ban-nen-biet.png",
        category: "Programming",
        instructor: {
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2"
        },
        lessonsWatched: 8,
        totalLessons: 15,
      },
      
      {
        id: "3",
        title: "Tailwind CSS Mastery",
        description: "Create stunning UIs with utility-first CSS framework",
        thumbnail: "https://blog.nashtechglobal.com/wp-content/uploads/2025/08/O-que-e-Tailwind-CSS-e-por-que-ele-virou-tendencia-no-front-end_-Programadores-Depre-Programacao-e-Tecnologia.jpeg",
        category: "UI/UX Design",
        instructor: {
          name: "Emma Wilson",
          avatar: "https://i.pravatar.cc/150?img=3"
        },
        lessonsWatched: 2,
        totalLessons: 8,
      },
       {

      id: "4",

      title: "Vue.js 3 Composition API",

      description: "Master Vue.js with modern composition API patterns and best practices",

      thumbnail: "data:image/png;base64,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",

      category: "Frontend",

      instructor: {

        name: "David Lee",

        avatar: "https://i.pravatar.cc/150?img=4"

      },

      lessonsWatched: 3,

      totalLessons: 10,

    },

    {

      id: "5",

      title: "Node.js & Express Backend Development",

      description: "Build scalable backend applications with Node.js and Express framework",

      thumbnail: "data:image/png;base64,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",

      category: "Backend",

      instructor: {

        name: "Alex Martinez",

        avatar: "https://i.pravatar.cc/150?img=5"

      },

      lessonsWatched: 6,

      totalLessons: 14,

    },
  ];

  const [courses, setCourses] = useState<Course[]>(mockCourses);
  // 4. Xóa các state openView, selectedCourse

  const handleView = (course: Course) => {
    // 5. Điều hướng sang trang chi tiết với ID của khóa học
    navigate(`/courses/${course.id}`);
  };

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
      {/* 6. Xóa phần hiển thị CourseDetailModal */}
    </div>
  );
}
import { Button, Popconfirm, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons"; // Import thêm icon cho đẹp
import type { Course } from "../types";
import CourseCard from "./CourseCard";
import styles from "./CoursesList.module.less";

type Props = {
  courses: Course[];
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
  onCreate: () => void; // 1. Thêm prop này để nhận lệnh mở form
};

const CoursesList = ({ courses, onEdit, onDelete, onCreate }: Props) => {
  const navigate = useNavigate();

  const handleNavigateToDetail = (courseId: string) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  return (
    <Card 
      title={<span className="text-xl font-bold">Your Courses</span>} // Style lại title chút cho to
      className={styles.coursesCard}
      // 2. Đưa nút Create Course vào đây (Góc phải Title)
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Create Course
        </Button>
      }
    >
      {courses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No courses yet.</p>
          <Button type="dashed" onClick={onCreate}>Create your first course</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((item) => (
            <div key={item.id} className="flex flex-col group">
              <CourseCard 
                course={item} 
                onClick={() => handleNavigateToDetail(item.id)} 
              />
              
              {/* Phần action buttons giữ nguyên */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="text-sm text-gray-500">
                  {item.totalLessons ?? 0} Materials
                </div>
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                   {/* ... (Giữ nguyên các nút View/Edit/Delete cũ của bạn) ... */}
                   <Button size="small" onClick={() => handleNavigateToDetail(item.id)}>View</Button>
                   <Button size="small" onClick={() => onEdit(item)}>Edit</Button>
                   <Popconfirm title="Delete?" onConfirm={() => onDelete(item.id)}>
                      <Button size="small" danger>Delete</Button>
                   </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CoursesList;
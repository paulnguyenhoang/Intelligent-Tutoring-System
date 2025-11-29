import { Button, Popconfirm, Card } from "antd";
import type { Course } from "../types";
import CourseCard from "./CourseCard";
import styles from "./CoursesList.module.less";

type Props = {
  courses: Course[];
  onView: (c: Course) => void;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
};

const CoursesList = ({ courses, onView, onEdit, onDelete }: Props) => {
  return (
    <Card title="Your Courses" className={styles.coursesCard}>
      {courses.length === 0 ? (
        <div className="text-sm text-gray-500">No courses yet. Click 'Create Course' to get started!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((item) => (
            <div key={item.id} className="flex flex-col">
              <CourseCard course={item} onClick={() => onView(item)} />

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">Materials: {item.totalLessons ?? 0}</div>
                <div className="flex items-center gap-2">
                  <Button size="small" onClick={() => onView(item)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                  <Popconfirm title="Delete course?" onConfirm={() => onDelete(item.id)}>
                    <Button size="small" danger>
                      Delete
                    </Button>
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

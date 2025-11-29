import { List, Button, Popconfirm, Card } from "antd";
import type { Course } from "../types";
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
      <List
        dataSource={courses}
        locale={{ emptyText: "No courses yet. Click 'Create Course' to get started!" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button key="view" type="link" onClick={() => onView(item)}>
                View
              </Button>,
              <Button key="edit" type="link" onClick={() => onEdit(item)}>
                Edit
              </Button>,
              <Popconfirm key="del" title="Delete course?" onConfirm={() => onDelete(item.id)}>
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CoursesList;

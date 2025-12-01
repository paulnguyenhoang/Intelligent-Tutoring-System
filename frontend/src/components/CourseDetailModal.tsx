import { Modal, Descriptions, Typography } from "antd";
import type { Course } from "../types";

type Props = {
  open: boolean;
  course: Course | null;
  onClose: () => void;
};

const { Paragraph, Link } = Typography;

const CourseDetailModal = ({ open, course, onClose }: Props) => {
  if (!course) return null;

  const isYouTubeLink = course.content?.startsWith("http");

  return (
    <Modal title={course.title} open={open} onCancel={onClose} footer={null} width={700}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Description">
          {course.description || "No description"}
        </Descriptions.Item>
        <Descriptions.Item label="Content">
          {isYouTubeLink ? (
            <Link href={course.content} target="_blank">
              {course.content}
            </Link>
          ) : (
            <Paragraph>{course.content || "No content"}</Paragraph>
          )}
        </Descriptions.Item>
      </Descriptions>

      {isYouTubeLink && (
        <div style={{ marginTop: 16 }}>
          <iframe
            width="100%"
            height="400"
            src={course.content?.replace("watch?v=", "embed/")}
            title={course.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </Modal>
  );
};

export default CourseDetailModal;

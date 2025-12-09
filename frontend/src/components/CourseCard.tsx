import React from 'react';
import { Card, Tag, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Định nghĩa lại Interface cho khớp với dữ liệu của bạn
interface Instructor {
  name: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  instructor?: Instructor;
  lessonsWatched?: number;
  totalLessons?: number;
}

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  // Convert Blob to URL if needed
  const getThumbnailUrl = (): string => {
    if (!course.thumbnail) {
      return "https://placehold.co/600x400?text=No+Image";
    }
    
    if (typeof course.thumbnail === "string") {
      return course.thumbnail;
    }
    
    // If it's a Blob object, create a URL
    if (course.thumbnail && typeof course.thumbnail === "object") {
      return URL.createObjectURL(course.thumbnail as Blob);
    }
    
    return "https://placehold.co/600x400?text=No+Image";
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      // Phần body style để đẩy footer xuống dưới cùng nếu nội dung ngắn
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      
      // 1. Ảnh Thumbnail (Cover Image)
      cover={
        <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
          <img
            alt={course.title}
            src={getThumbnailUrl()}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {/* Badge Category (Tag) đè lên góc ảnh */}
          {course.category && (
            <Tag 
              color="blue" 
              style={{ position: 'absolute', top: 10, right: 10, margin: 0, fontWeight: 600 }}
            >
              {course.category}
            </Tag>
          )}
        </div>
      }
    >
      <div style={{ flex: 1 }}>
        {/* 2. Tiêu đề khóa học */}
        <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8, height: 48 }}>
          {course.title}
        </Title>

        {/* 3. Mô tả ngắn */}
        <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 16, height: 44 }}>
          {course.description || "No description available."}
        </Paragraph>
      </div>

      {/* 4. Footer: Thông tin giảng viên */}
      {course.instructor && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          <Avatar 
            src={course.instructor.avatar} 
            icon={!course.instructor.avatar && <UserOutlined />} 
            size="small"
            style={{ marginRight: 8, backgroundColor: '#1890ff' }}
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {course.instructor.name}
          </Typography.Text>
        </div>
      )}
    </Card>
  );
};

export default CourseCard;
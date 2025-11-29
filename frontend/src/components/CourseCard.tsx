import React from 'react';

interface Instructor {
  name: string;
  avatar?: string;
}

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    thumbnail?: string;
    category?: string;
    instructor?: Instructor;
    lessonsWatched?: number;
    totalLessons?: number;
  };
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Thumbnail Container with Category Badge */}
      <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {course.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Course Title */}
        <div>
          <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {course.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {course.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Instructor Info */}
      {course.instructor && (
        <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
          {course.instructor.avatar ? (
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {course.instructor.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 truncate">
            {course.instructor.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseCard;

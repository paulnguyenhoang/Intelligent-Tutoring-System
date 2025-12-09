import type { Course, User } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseJSON } from "../utils";

const API_BASE_URL = "http://localhost:3001";

/**
 * Get the current user ID from localStorage
 */
function getUserId(): string | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  const user = parseJSON<User>(userStr, null as unknown as User);
  return user?.username || null;
}

/**
 * Parse FormData response containing courses and thumbnail files
 * Backend returns: FormData with 'courses' field (JSON array) and 'content#0', 'content#1', etc. for thumbnails
 */
async function parseCoursesFormData(formData: FormData): Promise<Course[]> {
  const coursesJson = formData.get("courses");
  
  if (!coursesJson || typeof coursesJson !== "string") {
    return [];
  }

  const courses = JSON.parse(coursesJson) as Array<{
    id: string;
    title: string;
    description: string;
    instructorID: string;
    category: string;
  }>;

  // Match each course with its thumbnail file
  const coursesWithThumbnails: Course[] = courses.map((course, idx) => {
    const thumbnailKey = `content#${idx}`;
    const thumbnailFile = formData.get(thumbnailKey) as Blob | null;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: thumbnailFile || undefined, // Return Blob object instead of URL
      category: course.category,
      instructor: {
        name: "Instructor", // Can be extended later with instructor info
      },
      totalLessons: 0, // Will be fetched separately via getLessons
      lessonsWatched: 0,
    };
  });

  return coursesWithThumbnails;
}

/**
 * Get all courses (visible to students)
 * GET /student/courses
 */
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/student/courses`, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const formData = await response.formData();
    return parseCoursesFormData(formData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

/**
 * Get courses for a specific instructor
 * GET /instructor/courses/:instructorId
 */
export async function getInstructorCourses(
  instructorId: string
): Promise<Course[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instructor/courses/${instructorId}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch instructor courses: ${response.statusText}`
      );
    }

    const formData = await response.formData();
    return parseCoursesFormData(formData);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return [];
  }
}

/**
 * Create a new course
 * POST /instructor/course
 * Expects FormData with 'data' field (CourseWithNoFileDTO as JSON) and 'thumbnail' file
 */
export async function createCourse(
  courseData: Omit<Course, "id" | "instructor">,
  thumbnailFile?: File
): Promise<void> {
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const coursePayload = {
    title: courseData.title,
    description: courseData.description,
    instructorID: userId,
    category: courseData.category,
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(coursePayload));
  
  if (thumbnailFile) {
    formData.append("thumbnail", thumbnailFile);
  } else {
    // Create a blank thumbnail if none provided
    formData.append("thumbnail", new Blob([""], { type: "image/png" }));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/instructor/course`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create course: ${response.statusText}`);
    }

    // Backend responds with 'ok'
    await response.json();
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

/**
 * Delete a course
 * DELETE /instructor/course?id=courseId
 */
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instructor/course?id=${courseId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete course: ${response.statusText}`);
    }

    // Backend responds with 'ok'
    await response.json();
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

/**
 * Lesson type from backend
 */
export interface LearningMaterial {
  id: string;
  type: "VIDEO" | "TEXT";
  render: () => Promise<void>;
  validateFormat: () => Promise<boolean>;
}

export interface Lesson {
  id: string;
  course: string;
  title: string;
  materials: LearningMaterial;
}

/**
 * Get lessons for a course
 * GET /student/lessons/:courseId or /instructor/lessons/:courseId
 * Backend returns JSON array of lessons
 */
export async function getLessons(courseId: string): Promise<Lesson[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/student/lessons/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }

    const lessons = await response.json() as Lesson[];
    return Array.isArray(lessons) ? lessons : [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

/**
 * Create a new lesson
 * POST /instructor/lesson
 * Expects FormData with 'data' field (LessonWithNoFileDTO as JSON) and 'content' file
 */
export async function createLesson(
  lessonData: {
    course: string;
    title: string;
    type: "VIDEO" | "TEXT";
    duration?: number;
  },
  contentFile?: File
): Promise<void> {
  const lessonPayload = {
    course: lessonData.course,
    title: lessonData.title,
    type: lessonData.type,
    duration: lessonData.duration || 0,
  };

  const formData = new FormData();
  formData.append("data", JSON.stringify(lessonPayload));
  
  if (contentFile) {
    formData.append("content", contentFile);
  } else {
    // Create a blank content if none provided
    formData.append("content", new Blob([""], { type: "text/plain" }));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/instructor/lesson`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create lesson: ${response.statusText}`);
    }

    // Backend responds with 'ok'
    await response.json();
  } catch (error) {
    console.error("Error creating lesson:", error);
    throw error;
  }
}

/**
 * Delete a lesson
 * DELETE /instructor/lesson?id=lessonId
 */
export async function deleteLesson(lessonId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/instructor/lesson?id=${lessonId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete lesson: ${response.statusText}`);
    }

    // Backend responds with 'ok'
    await response.json();
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}

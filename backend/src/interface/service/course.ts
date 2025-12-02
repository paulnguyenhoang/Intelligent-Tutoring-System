import { CourseDTO } from "../../dto/course";
import { Course } from "../../model/entity/course";
import { CourseStatus } from "../../model/enum/course_status";

export interface CourseContentMap{
  title: string,
  description: string,
  status: CourseStatus, 
  tags: string[],
  modules: [
    {
        id?: string,
        title: string,
        orderIndex: number
        lessons: [
            {
                id: string,
                title: string,
                estimatedTime: number
            }
        ]
    },
  ]
}

export interface ICourseService{
    createCourse: (dto: CourseDTO) => Promise<Course>
    getCourseDetail: (id: string) => Promise<Course>
    updateCourseContent: (id: string, content: CourseContentMap) => Promise<void>
    publishCourse: (id: string) => Promise<boolean> 
}
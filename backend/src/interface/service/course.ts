import { CourseContentMap, CourseWithFilesDTO } from "../../dto/course";
import { Course } from "../../model/entity/course";

export interface ICourseService{
    createCourse: (dto: CourseWithFilesDTO) => Promise<Course>
    // getCourseDetail: (id: string) => Promise<Course>
    publishCourse: (id: string) => Promise<boolean> 
    deleteCourse: (id: string) => Promise<void>
    updateCourse: (map: CourseContentMap) => Promise<void>
    getCourses: (id?: string) => Promise<CourseWithFilesDTO[]>
}
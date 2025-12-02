import { CourseContentMap } from "../../dto/course"
import { Course } from "../../model/entity/course"

export interface ICourseRepository{
    save: (course: Course) => Promise<void>
    findByID: (id: string) => Promise<Course>
    findByInstructor: (instructor: string) => Promise<Course[]>
    findAll: () => Promise<Course[]>
    delete: (id: string) => Promise<void>
    updateCourse: (map: CourseContentMap) => Promise<void>
}
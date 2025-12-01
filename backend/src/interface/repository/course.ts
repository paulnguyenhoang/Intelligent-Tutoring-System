import { Course } from "../../model/entity/course"
import { Instructor } from "../../model/user/instructor"

export interface ICourseRepository{
    save: (course: Course) => Promise<void>
    findById: (id: string) => Promise<Course>
    findByInstructor: (instructor: Instructor) => Promise<Course[]>
}
import { CourseContentMap, CourseWithFilesDTO } from "../dto/course";
import { ICourseRepository } from "../interface/repository/course";
import { ICourseService } from "../interface/service/course";
import { Course } from "../model/entity/course";
import { CourseStatus } from "../model/enum/course_status";

export class CourseService implements ICourseService{
    private __courseRepo: ICourseRepository
    public constructor(
        courseRepo: ICourseRepository
    ){
        this.__courseRepo = courseRepo
    }
    public async createCourse(
        dto: CourseWithFilesDTO
    ){
        const course = new Course(
            dto.title,
            dto.description,
            dto.instructorID,
            CourseStatus.DRAFT,
            new Date(),
            [],
            [],
            dto.category,
            dto.thumbnail
        )
        await this.__courseRepo.save(
            course            
        )
        return course
    }
    public async publishCourse(
        id: string
    ){
        let course = await this.__courseRepo.findByID(
            id
        )
        course.status = CourseStatus.PUBLISHED
        await this.__courseRepo.save(
            course
        )
        return true
    }
    public async deleteCourse(
        id: string
    ){
        await this.__courseRepo.delete(
            id
        )
    }
    public async updateCourse(
        map: CourseContentMap
    ){
        await this.__courseRepo.updateCourse(
            map
        )
    }
    public async getCourses(
        id?: string
    ){
        let courses: CourseWithFilesDTO[] = []
        let coursesResult
        if (id === undefined) {
            coursesResult = await this.__courseRepo.findAll()
        }        
        else {
            coursesResult = await this.__courseRepo.findByInstructor(id)
        }    
        for (const val of coursesResult){
            const course: CourseWithFilesDTO = {
                id: val.id,
                title: val.title,
                description: val.description,
                category: val.category,
                instructorID: val.instructorID,
                thumbnail: val.thumbnail as Blob
            }
            courses.push(
                course
            )
        }
        return courses
    }
}
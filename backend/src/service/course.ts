import { CourseDTO } from "../dto/course";
import { ICourseRepository } from "../interface/repository/course";
import { CourseContentMap, ICourseService } from "../interface/service/course";
import { Course } from "../model/entity/course";

export class CourseService implements ICourseService{
    private __courseRepo: ICourseRepository
    public constructor(
        courseRepo: ICourseRepository
    ){
        this.__courseRepo = courseRepo
    }
    public async createCourse(
        dto: CourseDTO
    ){
        return new Course()
    }
    public async getCourseDetail(
        id: string
    ){
        return new Course()
    }
    public async publishCourse(
        id: string
    ){
        return true
    }
    public async updateCourseContent(
        id: string,
        content: CourseContentMap
    ){
        return
    }
}
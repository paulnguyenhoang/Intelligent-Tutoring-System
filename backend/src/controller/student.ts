import { CourseWithNoFileDTO } from "../dto/course"
import { ICourseService } from "../interface/service/course"
import { ILessonService } from "../interface/service/lesson"
import { Request, Response } from "express"
import FormData from "form-data"
import uuid from 'uuid'

export class StudentController{
    public courseService: ICourseService
    public lessonService: ILessonService
    public constructor(
        courseService: ICourseService,
        lessonService: ILessonService
    ){
        this.courseService = courseService
        this.lessonService = lessonService
    }
    public getCourses = async (req: Request, res: Response) => {
        const coursesResult = await this.courseService.getCourses(
        )
        const coursesWithNoFile: CourseWithNoFileDTO[] = coursesResult.map(
            val => {
                const ret: CourseWithNoFileDTO = {
                    id: val.id,
                    title: val.title,
                    description: val.description,
                    instructorID: val.instructorID,
                    category: val.category
                }
                return ret
            }
        )
        const form = new FormData()
        form.append('courses', JSON.stringify(coursesWithNoFile))
        coursesResult.forEach(
            (val,idx) => {
                form.append(`content#${idx}`, val.thumbnail, uuid.v4() + '.png')
            }
        )
        form.pipe(res)
    }
}
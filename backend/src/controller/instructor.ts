import {Request, Response} from 'express'
import { CourseWithFilesDTO, CourseWithNoFileDTO } from '../dto/course'
import { ICourseService } from '../interface/service/course'
import { LessonWithFilesDTO, LessonWithNoFileDTO } from '../dto/lesson'
import {constants} from 'http2'
import { ILessonService } from '../interface/service/lesson'
import uuid from 'uuid'
import FormData from 'form-data'

export class InstructorController{
    public courseService: ICourseService
    public lessonService: ILessonService
    public constructor(
        courseService: ICourseService,
        lessonService: ILessonService
    ){
        this.courseService = courseService
        this.lessonService = lessonService
    }
    public createCourse = async (req: Request, res: Response) => {
        const thumbnail = req.file
        const data = (JSON.parse(req.body.data) as CourseWithNoFileDTO)
        let dto: CourseWithFilesDTO = {
            ...data,
            thumbnail: new Blob([new Uint8Array(thumbnail?.buffer!)], {
                type: thumbnail?.mimetype
            })
            
        }
        await this.courseService.createCourse(
            dto
        )
        res
        .status(constants.HTTP_STATUS_OK)
        .json('ok')
    }
    public createLesson = async (req: Request, res: Response) => {
        const content = req.file
        const data = JSON.parse(req.body.data) as LessonWithNoFileDTO
        let dto: LessonWithFilesDTO = {
            ...data,
            content: new Blob([new Uint8Array(content?.buffer!)], {
                type: content?.mimetype
            })
        }
        await this.lessonService.createLesson(
            dto
        )
        res
        .status(constants.HTTP_STATUS_OK)
        .json('ok')
    }
    public deleteLesson = async (req: Request<{},{},{},{id: string}>, res: Response) => {
        await this.lessonService.delete(
            req.query.id
        )
        res
        .status(constants.HTTP_STATUS_OK)
        .json('ok')
    }
    public deleteCourse = async (req: Request<{},{},{},{id: string}>, res: Response) => {
        await this.courseService.deleteCourse(
            req.query.id
        )
        res
        .status(constants.HTTP_STATUS_OK)
        .json('ok')
    }
    public getCourses = async (req: Request, res: Response) => {
        const coursesResult = await this.courseService.getCourses(
            req.params.id as string
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
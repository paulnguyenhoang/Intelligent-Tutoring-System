import { ICourseService } from "../interface/service/course"
import { ILessonService } from "../interface/service/lesson"
import { Request, Response } from "express"
import FormData from "form-data"
import uuid from 'uuid'
import {constants} from 'http2'

export class CommonController{
    public courseService: ICourseService
    public lessonService: ILessonService
    public constructor(
        courseService: ICourseService,
        lessonService: ILessonService
    ){
        this.courseService = courseService
        this.lessonService = lessonService
    }
    public getLessons = async (req: Request, res: Response) => {
        const lessons = await this.lessonService.findLessons(
            req.params.id
        )
        res
        .status(constants.HTTP_STATUS_OK)
        .json(
            lessons
        )
    }
}
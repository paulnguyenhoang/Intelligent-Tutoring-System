import { CourseStatus } from "../enum/course_status"
import { Lesson } from "./lesson"
import crypto from 'crypto'
import uuid from 'uuid'

export class Course{
    public id: string 
    public title: string
    public description: string
    public instructorID: string
    public status: CourseStatus
    public createdDate: Date
    public tags: string[]
    public lessons: Lesson[]
    public category: string
    public thumbnail?: Buffer<ArrayBuffer>
    public constructor(
        title: string,
        description: string,
        instructorID: string,
        status: CourseStatus,
        createdDate: Date,
        tags: string[],
        lessons: Lesson[],
        category: string,
        thumbnail?: Buffer<ArrayBuffer>,
        id?: string
    ){
        this.id = id ? id : uuid.v4()
        this.title = title
        this.description = description
        this.instructorID = instructorID
        this.status = status
        this.createdDate = createdDate
        this.tags = tags
        this.lessons = lessons
        this.category = category
        this.thumbnail = thumbnail
    }
    public async addLesson(lesson: Lesson){
        this.lessons.push(lesson)
    }
    public async removeModule(lessonID: string){
        const idx = this.lessons.findIndex(
            (value: Lesson) => {
                return value.id === lessonID
            }
        )
        this.lessons.splice(idx,1)
    }
}
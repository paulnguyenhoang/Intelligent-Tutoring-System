import { CourseStatus } from "../enum/course_status"
import { Lesson } from "./lesson"
import crypto from 'crypto'

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
    public thumbnail?: Blob
    public constructor(
        title: string,
        description: string,
        instructorID: string,
        status: CourseStatus,
        createdDate: Date,
        tags: string[],
        lessons: Lesson[],
        category: string,
        thumbnail?: Blob,
        id?: string
    ){
        this.id = id ? id : String(crypto.randomInt(1000000000,10000000000))
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
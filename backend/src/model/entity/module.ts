import { Lesson } from "./lesson"

export class Module{
    public id: string
    public title: string
    public orderIndex: number
    public description: string
    public isLocked: boolean
    public lessons: Lesson[]
    public constructor(
        id: string,
        title: string,
        orderIndex: number,
        description: string,
        isLocked: boolean,
        lessons: Lesson[]
    ){
        this.id = id
        this.title = title
        this.orderIndex = orderIndex
        this.description = description
        this.isLocked = isLocked
        this.lessons = lessons
    }
    public async addLesson(lesson: Lesson){
        this.lessons.push(lesson)
    }
    public async removeLesson(lessonID: string){
        const idx = this.lessons.findIndex(
            (value: Lesson) => {
                return value.id === lessonID
            }
        )
        this.lessons.splice(idx,1)
    }
}
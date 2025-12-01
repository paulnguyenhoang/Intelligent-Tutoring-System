import { CourseStatus } from "../enum/course_status"
import { Module } from "./module"

export class Course{
    public id: string 
    public title: string
    public description: string
    public instructorID: string
    public status: CourseStatus
    public createdDate: Date
    public tags: string[]
    public modules: Module[]
    public constructor(
        id: string,
        title: string,
        description: string,
        instructorID: string,
        status: CourseStatus,
        createdDate: Date,
        tags: string[],
        modules: Module[]
    ){
        this.id = id
        this.title = title
        this.description = description
        this.instructorID = instructorID
        this.status = status
        this.createdDate = createdDate
        this.tags = tags
        this.modules = modules
    }
    public async addModule(module: Module){
        this.modules.push(module)
    }
    public async removeModule(moduleID: string){
        const idx = this.modules.findIndex(
            (value: Module) => {
                return value.id === moduleID
            }
        )
        this.modules.splice(idx,1)
    }
}
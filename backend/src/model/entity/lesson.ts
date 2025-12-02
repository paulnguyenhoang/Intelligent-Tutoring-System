import crypto from 'crypto'
import { LearningMaterial } from "../../interface/abstract/learning_material"

export class Lesson{
    public id: string
    public course: string
    public title: string
    public materials: LearningMaterial
    public constructor(
        title: string,
        materials: LearningMaterial,
        course: string,
        id?: string
    ){
        this.id = id ? id : String(crypto.randomInt(1000000000,10000000000))
        this.title = title
        this.course = course
        this.materials = materials
    }
}
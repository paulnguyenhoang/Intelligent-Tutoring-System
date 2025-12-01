import { LearningMaterial } from "../../interface/abstract/learning_material"

export class Lesson{
    public id: string
    public title: string
    public estimatedTime: number
    public contentBody: string
    public materials: LearningMaterial[]
    public constructor(
        id: string,
        title: string,
        estimatedTime: number,
        contentBody: string,
        materials: LearningMaterial[]
    ){
        this.id = id
        this.title = title
        this.estimatedTime = estimatedTime
        this.contentBody = contentBody
        this.materials = materials
    }
    public async addMaterial(material: LearningMaterial){
        this.materials.push(material)
    }
    public async removeMaterial(materialID: string){
        const idx = this.materials.findIndex(
            (value: LearningMaterial) => {
                return value.id === materialID
            }
        )
        this.materials.splice(idx,1)
    }
}
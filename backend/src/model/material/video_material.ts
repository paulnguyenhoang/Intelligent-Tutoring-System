import { LearningMaterial } from "../../interface/abstract/learning_material";
import { MaterialType } from "../enum/material_type";
import uuid from 'uuid'

export class VideoMaterial implements LearningMaterial{
    public id: string
    public url: string
    public type: MaterialType
    public duration: string
    public constructor(
        url: string,
        type: MaterialType,
        duration: string,
        id?: string
    ){
        this.id = id ? id : uuid.v4()
        this.url = url
        this.type = type
        this.duration = duration
    }
    public async render(){

    }
    public async validateFormat(){
        return true
    }
}
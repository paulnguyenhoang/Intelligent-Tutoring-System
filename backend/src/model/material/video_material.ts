import { LearningMaterial } from "../../interface/abstract/learning_material";
import { MaterialType } from "../enum/material_type";

export class VideoMaterial implements LearningMaterial{
    public id: string
    public url: string
    public type: MaterialType
    public duration: number
    public resolution: string
    public subtitles: string[]
    public constructor(
        id: string,
        url: string,
        type: MaterialType,
        duration: number,
        resolution: string,
        subtitles: string[]
    ){
        this.id = id
        this.url = url
        this.type = type
        this.duration = duration
        this.resolution = resolution
        this.subtitles = subtitles
    }
    public async render(){

    }
    public async validateFormat(){
        return true
    }
}
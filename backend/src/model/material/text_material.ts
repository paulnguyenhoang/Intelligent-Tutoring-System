import { LearningMaterial } from "../../interface/abstract/learning_material";
import { FileFormat } from "../enum/file_format";
import { MaterialType } from "../enum/material_type";

export class TextMaterial implements LearningMaterial{
    public id: string
    public url: string
    public type: MaterialType
    public content: string
    public wordCount: number
    public format: FileFormat
    public constructor(
        id: string,
        url: string,
        type: MaterialType,
        content: string,
        wordCount: number,
        format: FileFormat
    ){
        this.id = id
        this.url = url
        this.type = type
        this.content = content
        this.wordCount = wordCount
        this.format = format
    }
    public async render(){

    }
    public async validateFormat(){
        return true
    }
}
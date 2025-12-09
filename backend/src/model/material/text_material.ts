import { LearningMaterial } from "../../interface/abstract/learning_material";
import { FileFormat } from "../enum/file_format";
import { MaterialType } from "../enum/material_type";
import crypto from 'crypto'

export class TextMaterial implements LearningMaterial{
    public id: string
    public type: MaterialType
    public content: Blob
    public format: FileFormat
    public size: string
    public constructor(
        type: MaterialType,
        content: Blob,
        format: FileFormat,
        size: string,
        id?: string
    ){
        this.id = id ? id : crypto.randomUUID()
        this.type = type
        this.content = content
        this.size = size
        this.format = format
    }
    public async render(){

    }
    public async validateFormat(){
        return true
    }
}
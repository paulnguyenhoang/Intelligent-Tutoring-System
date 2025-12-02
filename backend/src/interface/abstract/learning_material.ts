import { MaterialType } from "../../model/enum/material_type";

export interface LearningMaterial{
    id: string,
    url: string,
    type: MaterialType
    render: () => Promise<void>
    validateFormat: () => Promise<boolean>
}
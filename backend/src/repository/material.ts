import { db } from "../config/database";
import { IMaterialRepository } from "../interface/repository/material";

export class MaterialRepository implements IMaterialRepository{
    public async delete(
        id: string
    ){
        await db.any(
            'DELETE FROM material WHERE id = ${id}',{
                id: id
            }
        )
    }
}
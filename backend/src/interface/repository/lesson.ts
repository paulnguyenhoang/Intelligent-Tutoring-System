import { LessonWithFilesDTO } from "../../dto/lesson";
import { Lesson } from "../../model/entity/lesson";

export interface ILessonRepository{
    save: (lesson: Lesson) => Promise<void>
    findLessons: (courseID: string) => Promise<LessonWithFilesDTO[]>
    delete: (id: string) => Promise<void>
}
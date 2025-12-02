import { LessonWithFilesDTO } from "../../dto/lesson";

export interface ILessonService{
    createLesson: (lesson: LessonWithFilesDTO) => Promise<void>
    findLessons: (courseID: string) => Promise<LessonWithFilesDTO[]>
    delete: (id: string) => Promise<void>
}


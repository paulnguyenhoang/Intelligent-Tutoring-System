import { LessonWithFilesDTO } from "../dto/lesson";
import { stringToFormat } from "../extra/file_format";
import { ILessonRepository } from "../interface/repository/lesson";
import { ILessonService } from "../interface/service/lesson";
import { Lesson } from "../model/entity/lesson";
import { FileFormat } from "../model/enum/file_format";
import { MaterialType } from "../model/enum/material_type";
import { TextMaterial } from "../model/material/text_material";
import { VideoMaterial } from "../model/material/video_material";

export class LessonService implements ILessonService{
    public lessonRepository: ILessonRepository
    public constructor(
        lessonRepository: ILessonRepository
    ){
        this.lessonRepository = lessonRepository
    }
    public async createLesson(
        lesson: LessonWithFilesDTO
    ){
        await this.lessonRepository.save(
            new Lesson(
                lesson.title,
                lesson.type === 'VIDEO' ? new VideoMaterial(
                    lesson.content as string,
                    MaterialType.VIDEO,
                    lesson.duration
                ) : new TextMaterial(
                    MaterialType.TEXT,
                    lesson.content as Buffer<ArrayBuffer>,
                    stringToFormat(lesson.type),
                    lesson.duration
                ),
                lesson.course
            )
        )
    }
    public async delete(
        id: string
    ){
        await this.lessonRepository.delete(
            id
        )
    }
    public async findLessons(
        courseID: string
    ){
        return await this.lessonRepository.findLessons(
            courseID
        )
    }
}
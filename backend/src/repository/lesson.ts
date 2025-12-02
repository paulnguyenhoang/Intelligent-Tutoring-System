import { db } from "../config/database";
import { LessonWithFilesDTO } from "../dto/lesson";
import { ILessonRepository } from "../interface/repository/lesson";
import { Lesson } from "../model/entity/lesson";
import { FileFormat } from "../model/enum/file_format";
import { MaterialType } from "../model/enum/material_type";
import { TextMaterial } from "../model/material/text_material";
import { VideoMaterial } from "../model/material/video_material";

export class LessonRepository implements ILessonRepository{
    public async save(
        lesson: Lesson
    ){
        const lessonResult = await db.oneOrNone(
            'SELECT 1 FROM lesson WHERE id = ${id}',
            {
                id: lesson.id
            }
        )
        if (lessonResult === null){
            await db.any(
                'INSERT INTO lesson(${column_lesson_names:name} VALUES (${lesson_values})); INSERT INTO material(${column_material_names:name}) VALUES (${material_values})',{
                    column_lesson_names: ['id', 'course', 'title'],
                    lesson_values: [lesson.id, lesson.course, lesson.title],
                    column_material_names: ['id', 'type'],
                    material_values: [lesson.materials.id, lesson.materials.type]
                }
            )
            if (lesson.materials.type === MaterialType.TEXT){
                await db.any(
                    'INSERT INTO video_material(${column_names:name}) VALUES (${values})',
                    {
                        column_names: ['id', 'url', 'duration'],
                        values: [(lesson.materials as VideoMaterial).id, (lesson.materials as VideoMaterial).url, (lesson.materials as VideoMaterial).duration]
                    }
                )
            }
            else{
                await db.any(
                    'INSERT INTO text_material(${column_names:name}) VALUES (${values})',
                    {
                        column_names: ['id', 'content', 'format', 'size'],
                        values: [(lesson.materials as TextMaterial).id, (lesson.materials as TextMaterial).content, (lesson.materials as TextMaterial).format, (lesson.materials as TextMaterial).size]
                    }
                )
            }
        }
        else{
            await db.any(
                'UPDATE lesson SET title = ${title} WHERE id = ${lessonID}; UPDATE material SET type = ${type} WHERE id = ${materialID}',{
                    title: lesson.title,
                    lessonID: lesson.id,
                    type: lesson.materials.type,
                    materialID: lesson.materials.id
                }
            )
            if (lesson.materials.type === MaterialType.TEXT){
                await db.any(
                    'UPDATE video_material SET url = ${url}, duration = ${duration} WHERE id = ${id}',
                    {
                        url: (lesson.materials as VideoMaterial).url,
                        duration: (lesson.materials as VideoMaterial).duration,
                        id: lesson.id
                    }
                )
            }
            else{
                await db.any(
                    'UPDATE text_material SET content = ${content}, format = ${format}, size = ${size} WHERE id = ${id}',
                    {
                        id: lesson.id, 
                        content: (lesson.materials as TextMaterial).content,
                        format: (lesson.materials as TextMaterial).format, 
                        size: (lesson.materials as TextMaterial).size
                    }
                )
            }
        }
    }
    public async findLessons(
        courseID: string
    ){
        const lessonAndMaterialResult = await db.manyOrNone(
            'SELECT l.id as "lessonID", m.type, l.title, v.id as "videoID", v.url, v.duration, t.id as "textID", t.content, t.format, t.size FROM lesson as l INNER JOIN material as m ON l.id = m.id AND l.course = ${courseID} LEFT JOIN video_material AS v ON v.id = m.id LEFT JOIN text_material AS t ON t.id = m.id',{
                courseID: courseID
            }
        )
        let lessons: LessonWithFilesDTO[] = []
        for (const val of lessonAndMaterialResult){
            let type
            let mimetype
            switch(val.format as FileFormat){
                case FileFormat.DOCX:
                    type = 'WORD'
                    mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    break
                case FileFormat.PDF:
                    type = 'PDF'
                    mimetype = 'application/pdf'
                    break
                case FileFormat.TXT:
                    type = 'TEXT'
                    mimetype = 'text/plain'
                    break
                default:
                    type = 'PPT'
                    mimetype = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    break
            }
            let lesson: LessonWithFilesDTO = {
                course: courseID,
                title: val.title,
                type: val.type === 0 ? 'VIDEO' : type,
                duration: val.duration,
                content: val.url ? val.url : new Blob([new Uint8Array(val.content)],{
                    type: mimetype
                }) 
            } 
            lessons.push(
                lesson
            ) 
        }
        return lessons
    }
    public async delete(
        id: string
    ){
        await db.any(
            'DELETE FROM lesson WHERE id = ${id}',
            {
                id: id
            }
        )
    }
}
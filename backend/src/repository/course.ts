import { db } from "../config/database";
import { CourseContentMap } from "../dto/course";
import { ICourseRepository } from "../interface/repository/course";
import { Course } from "../model/entity/course";
import { CourseStatus } from "../model/enum/course_status";

export class CourseRepository implements ICourseRepository{
    public async save(
        course: Course
    ){
        const courseDetail = {
            id: course.id,
            title: course.title,
            description: course.description,
            instructorID: course.instructorID,
            status: course.status,
            createdDate: course.createdDate,
            tags: course.tags,
            category: course.category,
            thumbnail: course.thumbnail
        }
        const courseResult = await db.oneOrNone(
            'SELECT 1 FROM course WHERE id = ${id}',
            {
                id: course.id
            }
        )
        if (courseResult === null){
            await db.any(
                'INSERT INTO course(${column_names:name}) VALUES (${values:list})',
                {
                    values: Object.values(courseDetail),
                    column_names: Object.keys(courseDetail)
                }
            )
        }
        else {
            await db.any(
                'UPDATE course SET id = ${id}, "title" = ${title}, "description" = ${description}, "status" = ${status}, "createdDate" = ${createdDate}, "tags" = ${tags}, "category" = ${category}, "thumbnail" = ${thumbnail} WHERE id = ${id}',
                {
                    ...courseDetail
                }
            )
        }
    }
    public async findByID(
        id: string
    ){
        const courseResult = await db.oneOrNone(
            'SELECT * FROM course WHERE id = ${id}',{
                id: id
            }
        )
        return new Course(
            courseResult.title,
            courseResult.description,
            courseResult.instructorID,
            courseResult.status as CourseStatus,
            courseResult.createdDate,
            courseResult.tags,
            [],
            courseResult.category,
            courseResult.thumbnail,
            courseResult.id,
        )
    }
    public async findByInstructor(
        instructor: string
    ){
        let courses: Course[] = []
        const coursesResult = await db.manyOrNone(
            'SELECT * FROM course WHERE "instructorID" = ${instructorID}',{
                instructorID: instructor
            }
        )
        console.log(coursesResult)
        for (const val of coursesResult){
            courses.push(
                new Course(
                    val.title,
                    val.description,
                    val.instructorID,
                    val.status as CourseStatus,
                    val.createdDate,
                    val.tags,
                    [],
                    val.category,
                    val.thumbnail,
                    val.id,
                )
            )
        }
        return courses
    }
    public async delete(
        id: string
    ){
        await db.any(
            'DELETE FROM course WHERE id = ${id}',
            {
                id: id
            }
        )
    }
    public async updateCourse(
        map: CourseContentMap
    ){
        await db.any(
            'UPDATE course SET title = ${title}, description = ${description} WHERE id = ${id}',
            {
                title: map.title,
                description: map.description
            }
        )
    }
    public async findAll(){
        let courses: Course[] = []
        const coursesResult = await db.manyOrNone(
            'SELECT * FROM course'
        )
        for (const val of coursesResult){
            const bytes = new Uint8Array(val.thumbnail.length)
            for (let i = 0; i < val.thumbnail.length; i++) {
                bytes[i] = val.thumbnail[i];
            }
            courses.push(
                new Course(
                    val.title,
                    val.description,
                    val.instructorID,
                    val.status as CourseStatus,
                    val.createdDate,
                    val.tags,
                    [],
                    val.category,
                    val.thumbnail,
                    val.id,
                )
            )
        }
        return courses
    }
}
export interface LessonWithFilesDTO{
    course: string,
    title: string,
    type: string,
    duration: string,
    content: Buffer<ArrayBuffer> | string
}
export interface LessonWithNoFileDTO{
    course: string,
    title: string,
    type: string,
    duration: string,
}
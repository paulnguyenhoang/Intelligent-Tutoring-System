export interface LessonWithFilesDTO{
    course: string,
    title: string,
    type: string,
    duration: string,
    content: Blob | string
}
export interface LessonWithNoFileDTO{
    course: string,
    title: string,
    type: string,
    duration: string,
}
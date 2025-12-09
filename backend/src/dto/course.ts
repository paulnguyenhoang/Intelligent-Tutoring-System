export interface CourseWithNoFileDTO{
    id?: string,
    title: string,
    description: string,
    instructorID: string,
    category: string
}

export interface CourseWithFilesDTO{
    id?: string,
    title: string,
    description: string,
    instructorID: string,
    category: string,
    thumbnail: Buffer<ArrayBuffer>
}

export interface CourseContentMap{
    id: string,
    title: string,
    description: string
}
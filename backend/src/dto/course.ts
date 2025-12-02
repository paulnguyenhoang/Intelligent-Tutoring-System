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
    thumbnail: Blob
}

export interface CourseContentMap{
    id: string,
    title: string,
    description: string
}
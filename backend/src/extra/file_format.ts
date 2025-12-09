import { FileFormat } from "../model/enum/file_format";

export function stringToFormat(type: string){
    switch(type){
        case 'WORD':
            return FileFormat.DOCX
        case 'PDF':
            return FileFormat.PDF
        case 'TEXT':
            return FileFormat.TXT
        default:
            return FileFormat.PPTX
    }
}

export function formatToString(type: FileFormat){
    switch(type){
        case FileFormat.DOCX:
            return 'WORD'
        case FileFormat.PDF:
            return 'PDF'
        case FileFormat.TXT:
            return 'TEXT'
        default:
            return 'PPT'
    }   
}

export function formatToMIMEType(type: FileFormat){
    switch(type){
        case FileFormat.DOCX:
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        case FileFormat.PDF:
            return 'application/pdf'
        case FileFormat.TXT:
            return 'text/plain'
        default:
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }   
}
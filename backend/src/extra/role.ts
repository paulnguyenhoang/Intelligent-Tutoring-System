import { Role } from "../model/enum/role";

export function roleToString(role: Role){
    switch(role){
        case Role.STUDENT:
            return 'student'            
        case Role.INSTRUCTOR:
            return 'instructor'            
    }
}

export function stringToRole(role: string){
    switch(role){
        case 'student':
            return Role.STUDENT
        case 'instructor':
            return Role.INSTRUCTOR            
    }
}
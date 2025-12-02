import pgPromise from "pg-promise";
import { IUserRepository } from "../interface/repository/user";
import pg from "pg-promise/typescript/pg-subset";
import { User } from "../interface/abstract/user";
import { Student } from "../model/user/student";
import { Role } from "../model/enum/role";
import { LearningStyle } from "../model/enum/learning_style";
import { Instructor } from "../model/user/instructor";

export class UserRepository implements IUserRepository {
  public db: pgPromise.IDatabase<{}, pg.IClient>;
  public constructor(db: pgPromise.IDatabase<{}, pg.IClient>) {
    this.db = db;
  }
  public async findByID(id: string) {
    const userResult = await this.db.oneOrNone(
      'SELECT id, username, "passwordHash", email, role, "isActive", "lastLogin", "verifyToken" FROM "user" WHERE id = ${id} LIMIT 1',
      {
        id: id,
      }
    );
    if (userResult === null) throw new Error("User doesn't exist.");
    if (userResult.role === Role.STUDENT) {
      const studentResult = await this.db.oneOrNone(
        'SELECT "studentID", "learningStyle", "enrollmentDate", gpa FROM student WHERE id = ${id} LIMIT 1',
        {
          id: userResult.id,
        }
      );
      return new Student(
        userResult.id,
        userResult.username,
        userResult.passwordHash,
        userResult.email,
        userResult.role as Role,
        userResult.isActive,
        studentResult.studentID,
        userResult.lastLogin,
        studentResult.learningStyle as LearningStyle,
        studentResult.enrollmentDate,
        studentResult.gpa,
        userResult.verifyToken
      );
    }
    const instructorResult = await this.db.oneOrNone(
      'SELECT "employeeID", department, expertise FROM instructor WHERE id = ${id}',
      {
        id: userResult.id,
      }
    );
    return new Instructor(
      userResult.id,
      userResult.username,
      userResult.passwordHash,
      userResult.email,
      userResult.role as Role,
      userResult.isActive,
      instructorResult.employeeID,
      userResult.lastLogin,
      instructorResult.department,
      instructorResult.expertise,
      userResult.verifyToken
    );
  }
  public async findByUsername(username: string) {
    const userResult = await this.db.oneOrNone(
      'SELECT id, username, "passwordHash", email, role, "isActive", "lastLogin" FROM "user" WHERE username = ${username}',
      {
        username: username,
      }
    );
    if (userResult === null) throw new Error("User doesn't exist.");
    if (userResult.role === Role.STUDENT) {
      const studentResult = await this.db.oneOrNone(
        'SELECT "studentID", "learningStyle", "enrollmentDate", gpa FROM student WHERE id = ${id}',
        {
          id: userResult.id,
        }
      );
      return new Student(
        userResult.id,
        userResult.username,
        userResult.passwordHash,
        userResult.email,
        userResult.role as Role,
        userResult.isActive,
        userResult.lastLogin,
        studentResult.studentID,
        studentResult.learningStyle as LearningStyle,
        studentResult.enrollmentDate,
        studentResult.gpa,
        userResult.verifyToken
      );
    }
    const instructorResult = await this.db.oneOrNone(
      'SELECT "employeeID", department, expertise FROM instructor WHERE id = ${id}',
      {
        id: userResult.id,
      }
    );
    return new Instructor(
      userResult.id,
      userResult.username,
      userResult.passwordHash,
      userResult.email,
      userResult.role as Role,
      userResult.isActive,
      userResult.lastLogin,
      instructorResult.employeeID,
      instructorResult.department,
      instructorResult.expertise,
      userResult.verifyToken
    );
  }
  public async save(user: User) {
    let userDetail = {
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      verifyToken: user.verifyToken,
    };
    let specificUserDetail;
    if (user instanceof Student) {
      specificUserDetail = {
        id: user.id,
        studentID: user.studentID,
        learningStyle: user.learningStyle,
        enrollmentDate: user.enrollmentDate,
        gpa: user.gpa,
      };
    } else if (user instanceof Instructor) {
      specificUserDetail = {
        id: user.id,
        employeeID: user.employeeID,
        department: user.department,
        expertise: user.expertise,
      };
    }
    for (const [key, value] of Object.entries(specificUserDetail!)) {
      if (value !== undefined) (specificUserDetail as any)[key] = value;
      else (specificUserDetail as any)[key] = null;
    }
    for (const [key, value] of Object.entries(userDetail)) {
      if (value !== undefined) (userDetail as any)[key] = value;
      else (userDetail as any)[key] = null;
    }
    const result = await this.db.oneOrNone('SELECT 1 FROM "user" WHERE id = ${id}', {
      id: user.id,
    });
    if (result === null) {
      await this.db.any('INSERT INTO "user"(${column_names:name}) VALUES (${values:list})', {
        column_names: Object.keys(userDetail),
        values: Object.values(userDetail),
      });
      if (user.role === Role.STUDENT) {
        await this.db.any("INSERT INTO student(${column_names:name}) VALUES (${values:list})", {
          column_names: Object.keys(specificUserDetail!),
          values: Object.values(specificUserDetail!),
        });
      } else {
        await this.db.any("INSERT INTO instructor(${column_names:name}) VALUES (${values:list})", {
          column_names: Object.keys(specificUserDetail!),
          values: Object.values(specificUserDetail!),
        });
      }
    } else {
      await this.db.any(
        'UPDATE "user" SET username = ${username}, "passwordHash" = ${passwordHash}, email = ${email}, role = ${role}, "isActive" = ${isActive}, "lastLogin" = ${lastLogin}, "verifyToken" = ${verifyToken} WHERE id = ${id}',
        {
          ...userDetail,
        }
      );
      if (user.role === Role.STUDENT) {
        await this.db.any(
          'UPDATE "student" SET "studentID" = ${studentID}, "learningStyle" = ${learningStyle}, "enrollmentDate" = ${enrollmentDate}, "gpa" = ${gpa} WHERE id = ${id}',
          {
            ...specificUserDetail,
          }
        );
      } else {
        await this.db.any(
          'UPDATE "instructor" SET "employeeID" = ${employeeID}, department = ${department}, expertise = ${expertise} WHERE id = ${id}',
          {
            ...specificUserDetail,
          }
        );
      }
    }
    return user;
  }
}

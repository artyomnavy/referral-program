import bcrypt from 'bcrypt';
import {AuthLoginModel} from "../models/auth/auth.input";
import {StudentsQueryRepository} from "../repositories/students/students-query-repository";
import {StudentType} from "../models/students/student.output";
import {inject, injectable} from "inversify";

@injectable()
export class StudentsService {
    constructor(@inject(StudentsQueryRepository) protected studentsQueryRepository: StudentsQueryRepository) {
    }

    async checkCredentials(inputData: AuthLoginModel): Promise<StudentType | null> {
        const student = await this.studentsQueryRepository
            .getStudentByPhoneOrEmail(inputData.phoneOrEmail)

        if (!student) {
            return null
        }

        const checkPassword = await bcrypt.compare(inputData.password, student.password)

        if (!checkPassword) {
            return null
        } else {
            return student
        }
    }
}
import bcrypt from 'bcrypt';
import {AuthLoginModel} from "../types/auth.input";
import {StudentsQueryRepository} from "../repositories/students-query-repository";
import {Student, StudentOutputType, StudentType} from "../types/student.output";
import {CreateStudentByAdminModel, CreateStudentByReferrerModel} from "../types/student.input";
import {v4 as uuidv4} from "uuid";
import {StudentsRepository} from "../repositories/students-repository";
import {inject, injectable} from "inversify";

@injectable()
export class StudentsService {
    constructor(@inject(StudentsRepository) protected studentsRepository: StudentsRepository,
                @inject(StudentsQueryRepository) protected studentsQueryRepository: StudentsQueryRepository ) {
    }

    async createStudentByAdmin(createData: CreateStudentByAdminModel): Promise<StudentOutputType> {
        const passwordHash = await bcrypt.hash(createData.password, 10)

        const newStudent: Student = new Student(
            uuidv4(),
            createData.fullName,
            createData.phone,
            createData.email,
            passwordHash,
            null,
            new Date()
        )

        const createStudent = await this.studentsRepository
            .createStudent(newStudent)

        return createStudent
    }
    async createStudentByReferrer(createData: {referrerId: string} & Omit<CreateStudentByReferrerModel, 'refLinkId'>): Promise<StudentOutputType> {
        const passwordHash = await bcrypt.hash(createData.password, 10)

        const newStudent: Student = new Student(
            uuidv4(),
            createData.fullName,
            createData.phone,
            createData.email,
            passwordHash,
            createData.referrerId,
            new Date()
        )

        const createStudent = await this.studentsRepository
            .createStudent(newStudent)

        return createStudent
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
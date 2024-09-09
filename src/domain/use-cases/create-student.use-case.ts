import {inject, injectable} from "inversify";
import {StudentsRepository} from "../../repositories/students/students-repository";
import bcrypt from "bcrypt";
import {Student, StudentOutputType} from "../../models/students/student.output";
import {v4 as uuidv4} from "uuid";
import {
    CreateStudentModel
} from "../../models/students/student.input";

@injectable()
export class CreateStudentUseCase {
    constructor(@inject(StudentsRepository) protected studentsRepository: StudentsRepository) {
    }

    async execute(createData: {referrerId: string | null} & Omit<CreateStudentModel, 'refLinkId'>): Promise<StudentOutputType> {
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
}

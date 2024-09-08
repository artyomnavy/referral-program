import {db} from "../../db/db";
import {Student, StudentOutputType} from "../../models/students/student.output";
import {injectable} from "inversify";

@injectable()
export class StudentsRepository {
    async createStudent(newStudent: Student): Promise<StudentOutputType> {
        try {
            const createStudent = await db('Students').insert({
                id: newStudent.id,
                fullName: newStudent.fullName,
                phone: newStudent.phone,
                email: newStudent.email,
                password: newStudent.password,
                referrerId: newStudent.referrerId,
                createdAt: newStudent.createdAt
            }).returning(['id', 'fullName', 'phone', 'email', 'referrerId'])

            return {
                id: createStudent[0].id,
                fullName: createStudent[0].fullName,
                phone: createStudent[0].phone,
                email: createStudent[0].email,
                referrerId: createStudent[0].referrerId
            };

        } catch (error) {
            console.error('Student not created: ', error);

            throw new Error('Student not created');
        }
    }
}
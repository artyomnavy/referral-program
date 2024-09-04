import {db} from "../db/db";
import {Student, StudentOutputType} from "../types/student.output";

export const studentsRepository = {
    async createStudent(newStudent: Student): Promise<StudentOutputType> {
        try {
            const createStudent = await db('users').insert({
                id: newStudent.id,
                phone: newStudent.phone,
                email: newStudent.email,
                password: newStudent.password,
                refId: newStudent.refId,
                createdAt: newStudent.createdAt
            });

            return {
                id: createStudent[0].toString(),
                phone: newStudent.phone,
                email: newStudent.email,
                refId: newStudent.refId
            };

        } catch (error) {
            console.error('Student not created: ', error);
            throw new Error('Student not created');
        }
    }
}
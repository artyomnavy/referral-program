import {StudentOutputType, StudentType} from "../types/student.output";
import {db} from "../db/db";

export const studentsQueryRepository = {
    async getStudentByPhoneOrEmail(phoneOrEmail: string): Promise<StudentType | null> {
        try {
            const student = await db('students')
                .where({email: phoneOrEmail})
                .orWhere({phone: phoneOrEmail})
                .select('id', 'phone', 'email', 'password', 'refId', 'createdAt')
                .first();

            if (!student) {
                return null
            } else {
                return student
            }
        } catch (error) {
            console.error('Error in receiving student by phone or email: ', error);
            throw new Error('Error in receiving student by phone or email. Please, try later.');
        }
    },
    async getStudentByEmail(email: string): Promise<StudentOutputType | null> {
        try {
            const student = await db('students')
                .where({email: email})
                .select('id', 'phone', 'email', 'refId')
                .first();

            if (!student) {
                return null
            } else {
                return student
            }
        } catch (error) {
            console.error('Error in receiving student by email: ', error);
            throw new Error('Error in receiving student by email. Please, try later.');
        }
    }
}
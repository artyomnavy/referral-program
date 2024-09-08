import {StudentOutputType, StudentType} from "../types/student.output";
import {db} from "../db/db";

export class StudentsQueryRepository {
    async getStudentByPhoneOrEmail(phoneOrEmail: string): Promise<StudentType | null> {
        try {
            const student = await db('Students')
                .where({email: phoneOrEmail})
                .orWhere({phone: phoneOrEmail})
                .select('id', 'fullName', 'phone', 'email', 'password', 'referrerId', 'createdAt')
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
    }
    async getStudentByEmail(email: string): Promise<StudentOutputType | null> {
        try {
            const student = await db('Students')
                .where({email: email})
                .select('id', 'fullName', 'phone', 'email', 'referrerId')
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
    async getStudentById(id: string): Promise<StudentOutputType | null> {
        try {
            const student = await db('Students')
                .where({id: id})
                .select('id','fullName', 'phone', 'email', 'referrerId')
                .first();

            if (!student) {
                return null
            } else {
                return student
            }
        } catch (error) {
            console.error('Error in receiving student by id: ', error);
            throw new Error('Error in receiving student by id. Please, try later.');
        }
    }
}
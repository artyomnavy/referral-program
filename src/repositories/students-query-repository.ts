import {StudentOutputType, StudentReferralStatisticOutputType, StudentType} from "../types/student.output";
import {db} from "../db/db";
import {injectable} from "inversify";

@injectable()
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
                .select('id', 'fullName', 'phone', 'email', 'referrerId')
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

    async getReferralStatisticForStudent(id: string): Promise<StudentReferralStatisticOutputType | null> {
        try {
            const [totalCount] = await db('Students')
                .count('id', {as: 'totalCount'})
                .where({referrerId: id})

            if (!totalCount) {
                return null
            }

            const referrals = await db('Students')
                .where({referrerId: id})
                .select('id', 'fullName')

            if (!referrals) {
                return null
            }

            return {
                studentId: id,
                referrals: {
                    totalCount: +totalCount.totalCount,
                    students: {
                        referrals
                    }
                }
            }
        } catch (error) {
            console.error('Error in receiving referral statistic for student: ', error);
            throw new Error('Error in receiving referral statistic for student. Please, try later.');
        }
    }
}
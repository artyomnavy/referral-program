import {db} from "../db/db";
import {LessonProduct} from "../types/lessons.output";

export class LessonsRepository {
    async createLessonProduct(lessonProduct: LessonProduct) {
        try {
            const createLesson = await db('Lessons').insert({
                id: lessonProduct.id,
                studentId: lessonProduct.studentId,
                refLinkId: lessonProduct.refLinkId,
                paymentId: lessonProduct.paymentId,
                productName: lessonProduct.productName,
                countLessons: lessonProduct.countLessons,
                addedAt: lessonProduct.addedAt,
            }).returning(['id', 'productName', 'countLessons', 'studentId', 'refLinkId', 'paymentId', 'addedAt']);

            return {
                id: createLesson[0].id,
                productName: createLesson[0].productName,
                countLessons: createLesson[0].countLessons,
            };
        } catch(error) {
            console.error(error);

            throw new Error('Referral not created');
        }
    }
}
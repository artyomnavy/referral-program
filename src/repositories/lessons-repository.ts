import {db} from "../db/db";
import {LessonProduct} from "../types/lessons.output";

export const lessonsRepository = {
    async createLessonProduct(lessonProduct: LessonProduct) {
        try {
            const lessonId = await db('Lessons').insert({
                id: lessonProduct.id,
                studentId: lessonProduct.studentId,
                refLinkId: lessonProduct.refLinkId,
                paymentId: lessonProduct.paymentId,
                productName: lessonProduct.productName,
                countLessons: lessonProduct.countLessons,
                addedAt: lessonProduct.addedAt,
            }).returning('id');

            return {
                id: lessonId[0].toString(),
                productName: lessonProduct.productName,
                countLessons: lessonProduct.countLessons,
            };
        } catch(error) {
            console.error(error);

            throw new Error('Referral not created');
        }
    },
}
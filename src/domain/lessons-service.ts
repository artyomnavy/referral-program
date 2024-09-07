import {v4 as uuidv4} from "uuid";
import {LessonProduct, LessonsOutputType} from "../types/lessons.output";
import {lessonsRepository} from "../repositories/lessons-repository";
import {referrersRepository} from "../repositories/referrers-repository";

export const lessonsService = {
    async addLessonsToStudent(createData: {
        studentId: string;
        refLinkId: string;
        countLessons: string;
        addPayment: string;
        productName: string
    }): Promise<LessonsOutputType> {

        const newLessonProduct: LessonProduct = new LessonProduct(
            uuidv4(),
            createData.studentId,
            createData.refLinkId,
            createData.addPayment,
            createData.productName,
            +createData.countLessons,
            new Date()
        )

        const createLessonProduct = await lessonsRepository
            .createLessonProduct(newLessonProduct)

        return createLessonProduct
    },
    async updateBonusLessonsToReferrer(refLinkId: string, countLessons:  string, bonusLessons: number): Promise<{
        refLinkId: string,
        bonusLessons: number
    } | null> {

        const updateBonus = Number(countLessons) + bonusLessons

        const updateBonusLessons = await referrersRepository
            .updateBonusLessons(refLinkId, updateBonus)

        if (!updateBonusLessons) {
            return null
        }

        return {
            refLinkId: refLinkId,
            bonusLessons: updateBonus
        }
    }
}
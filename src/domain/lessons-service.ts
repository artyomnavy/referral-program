import {v4 as uuidv4} from "uuid";
import {LessonProduct, LessonsOutputType} from "../models/lessons/lesson.output";
import {LessonsRepository} from "../repositories/lessons/lessons-repository";
import {ReferrersRepository} from "../repositories/referrers/referrers-repository";
import {inject, injectable} from "inversify";

@injectable()
export class LessonsService {
    constructor(@inject(LessonsRepository) protected lessonsRepository: LessonsRepository,
                @inject(ReferrersRepository) protected referrersRepository: ReferrersRepository) {
    }
    async addLessonsToStudent(createData: {
        studentId: string;
        refLinkId: string;
        countLessons: string;
        paymentId: string;
        productName: string
    }): Promise<LessonsOutputType> {

        const newLessonProduct: LessonProduct = new LessonProduct(
            uuidv4(),
            createData.studentId,
            createData.refLinkId,
            createData.paymentId,
            createData.productName,
            +createData.countLessons,
            new Date()
        )

        const createLessonProduct = await this.lessonsRepository
            .createLessonProduct(newLessonProduct)

        return createLessonProduct
    }
    async updateBonusLessonsToReferrer(refLinkId: string, countLessons:  string, bonusLessons: number): Promise<{
        refLinkId: string,
        bonusLessons: number
    } | null> {

        const updateBonus = Number(countLessons) + bonusLessons

        const updateBonusLessons = await this.referrersRepository
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
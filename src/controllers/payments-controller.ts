import {StudentsQueryRepository} from "../repositories/students-query-repository";
import {ReferrersQueryRepository} from "../repositories/referrers-query-repository";
import {PaymentsService} from "../domain/payments-service";
import {LessonsService} from "../domain/lessons-service";
import {RequestWithBody} from "../types/common";
import {PaymentReferralModel} from "../types/payment.input";
import {Response} from "express";
import {HTTP_STATUSES} from "../utils";
import {inject, injectable} from "inversify";

@injectable()
export class PaymentsController {
    constructor(@inject(StudentsQueryRepository) protected studentsQueryRepository: StudentsQueryRepository,
                @inject(ReferrersQueryRepository) protected referrersQueryRepository: ReferrersQueryRepository,
                @inject(PaymentsService) protected paymentsService: PaymentsService,
                @inject(LessonsService) protected lessonsService: LessonsService,
    ) {
    }

    async addReferralPaymentAndLessons(req: RequestWithBody<PaymentReferralModel>, res: Response) {
        const studentId = req.studentId

        const {refLinkId, amount, paymentStatus, currency, countLessons, productName} = req.body

        const student = await this.studentsQueryRepository.getStudentById(studentId)

        if (!student) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Student not found')
            return
        }

        const referrerStudent = await this.referrersQueryRepository.getReferrerById(refLinkId)

        if (!referrerStudent) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Referrer not found')
            return
        }

        if (!student.referrerId || student.referrerId !== referrerStudent.studentId) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Student not referred')
            return
        }

        const addPayment = await this.paymentsService
            .addPaymentReferral({studentId, refLinkId, amount, paymentStatus, currency})


        const addLessons = await this.lessonsService.addLessonsToStudent({
            studentId,
            refLinkId,
            paymentId: addPayment.id,
            countLessons,
            productName
        })

        const updateBonusLessons = await this.lessonsService.updateBonusLessonsToReferrer(refLinkId, countLessons, referrerStudent.bonusLessons)

        if (!updateBonusLessons) {
            throw new Error('Referrer bonus not updated')
        }

        res
            .status(HTTP_STATUSES.CREATED_201).send({
            student: addLessons,
            referrer: updateBonusLessons
        })
    }
}
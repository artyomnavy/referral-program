import {Response, Router} from "express";
import {RequestWithBody} from "../types/common";
import {HTTP_STATUSES} from "../utils";
import {authBasicMiddleware} from "../middlewares/auth/auth-basic";
import {PaymentReferralModel} from "../types/payment.input";
import {studentsQueryRepository} from "../repositories/students-query-repository";
import {paymentsService} from "../domain/payments-service";
import {paymentReferralValidation} from "../middlewares/validators/payments-validator";
import {referrersQueryRepository} from "../repositories/referrers-query-repository";
import {lessonsService} from "../domain/lessons-service";

export const paymentsRouter = Router({});

paymentsRouter
    .post('/referral/add',
        authBasicMiddleware,
        paymentReferralValidation,
    async (req: RequestWithBody<PaymentReferralModel>, res: Response) => {
        const studentId = req.studentId

        const { refLinkId, amount, paymentStatus, currency, countLessons, productName } = req.body

        const student = await studentsQueryRepository.getStudentById(studentId)

        if (!student) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Student not found')
            return
        }

        const referrerStudent = await referrersQueryRepository.getReferrerById(refLinkId)

        if (!referrerStudent) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Referrer not found')
            return
        }

        if (!student.referrerId || student.referrerId !== refLinkId) {
            res.status(HTTP_STATUSES.FORBIDDEN_403).send('Student not referred')
            return
        }

        const addPayment = await paymentsService
            .addPaymentReferral({studentId, refLinkId, amount, paymentStatus, currency})

        const addLessons = await lessonsService.addLessonsToStudent({
            studentId,
            refLinkId,
            addPayment,
            countLessons,
            productName
        })

        const updateBonusLessons = await lessonsService.updateBonusLessonsToReferrer(refLinkId, countLessons, referrerStudent.bonusLessons)

        if (!updateBonusLessons) {
            throw new Error('Referrer bonus not updated')
        }

        res
            .status(HTTP_STATUSES.CREATED_201).send({
            student: addLessons,
            referrer: updateBonusLessons
        })
    })
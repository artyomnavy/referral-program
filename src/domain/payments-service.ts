import {v4 as uuidv4} from "uuid";
import {Payment} from "../types/payment.output";
import {PaymentReferralModel} from "../types/payment.input";
import {paymentsRepository} from "../repositories/payments-repository";

export const paymentsService = {
    async addPaymentReferral(createData:
        {
            studentId: string
        } & Omit<PaymentReferralModel, 'countLessons' | 'productName'>): Promise<string> {

        const newPayment: Payment = new Payment(
            uuidv4(),
            createData.studentId,
            createData.refLinkId,
            createData.amount,
            createData.paymentStatus,
            createData.currency,
            new Date()
        )

        const paymentId = await paymentsRepository
            .addPayment(newPayment)

        return paymentId
    },
}
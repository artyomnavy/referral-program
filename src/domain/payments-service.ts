import {v4 as uuidv4} from "uuid";
import {Payment} from "../types/payment.output";
import {PaymentReferralModel} from "../types/payment.input";
import {PaymentsRepository} from "../repositories/payments-repository";

export class PaymentsService {
    constructor(protected paymentsRepository: PaymentsRepository) {
    }
    async addPaymentReferral(createData:
        {
            studentId: string
        } & Omit<PaymentReferralModel, 'countLessons' | 'productName'>): Promise<Payment> {

        const newPayment: Payment = new Payment(
            uuidv4(),
            createData.studentId,
            createData.refLinkId,
            createData.amount,
            createData.paymentStatus,
            createData.currency,
            new Date()
        )

        const payment = await this.paymentsRepository
            .addPayment(newPayment)

        return payment
    }
}
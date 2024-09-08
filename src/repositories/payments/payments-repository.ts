import {db} from "../../db/db";
import {Payment} from "../../models/payments/payment.output";
import {injectable} from "inversify";

@injectable()
export class PaymentsRepository {
    async addPayment(payment: Payment) {
        try {
            const [createPayment] = await db('Payments').insert({
                id: payment.id,
                studentId: payment.studentId,
                refLinkId: payment.refLinkId,
                amount: payment.amount,
                paymentStatus: payment.paymentStatus,
                currency: payment.currency,
                addedAt: payment.addedAt
            }).returning(['id', 'studentId', 'refLinkId', 'amount', 'paymentStatus', 'currency', 'addedAt']);

            return createPayment;
        } catch(error) {
            console.error(error);

            throw new Error('Payment not added');
        }
    }
}
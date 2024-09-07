import {db} from "../db/db";
import {Payment} from "../types/payment.output";

export const paymentsRepository = {
    async addPayment(payment: Payment) {
        try {
            const paymentId = await db('Payments').insert({
                id: payment.id,
                studentId: payment.studentId,
                refLinkId: payment.refLinkId,
                amount: payment.amount,
                paymentStatus: payment.paymentStatus,
                currency: payment.currency,
                addedAt: payment.addedAt
            }).returning('id');

            return paymentId[0].toString();
        } catch(error) {
            console.error(error);

            throw new Error('Payment not added');
        }
    },
}
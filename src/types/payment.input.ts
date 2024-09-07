import {PaymentStatuses} from "./payment.output";

export type PaymentReferralModel = {
    refLinkId: string;
    amount: string;
    paymentStatus: PaymentStatuses;
    currency: string;
    countLessons: string;
    productName: string;
}
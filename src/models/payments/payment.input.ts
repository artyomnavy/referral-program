import {PaymentStatuses} from "../../utils";

export type PaymentReferralModel = {
    refLinkId: string;
    amount: string;
    paymentStatus: PaymentStatuses;
    currency: string;
    countLessons: string;
    productName: string;
}
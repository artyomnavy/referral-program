export enum PaymentStatuses {
    SUCCESS = 'Success',
    PENDING = 'Pending',
    FAILED = 'Failed',
}

export class Payment {
    constructor(
        public id: string,
        public studentId: string,
        public refLinkId: string | null,
        public amount: string | null,
        public paymentStatus: PaymentStatuses,
        public currency: string | null,
        public addedAt: Date,
    ) {
    }
}
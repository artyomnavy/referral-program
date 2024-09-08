export type StudentType = {
    id: string,
    fullName: string,
    phone: string,
    email: string,
    password: string,
    referrerId: string
    createdAt: Date
}

export type StudentOutputType = {
    id: string,
    fullName: string,
    phone: string,
    email: string,
    referrerId: string | null
}

export type StudentReferralStatisticOutputType = {
    studentId: string,
    referrals: {
        totalCount: number,
        students: {
            referrals: {
                id: string,
                fullName: string
            }[]
        }
    }
}

export class Student {
    constructor(
        public id: string,
        public fullName: string,
        public phone: string,
        public email: string,
        public password: string,
        public referrerId: string | null,
        public createdAt: Date
    ) {
    }
}
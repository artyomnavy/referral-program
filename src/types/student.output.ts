export type StudentType = {
    id: string,
    phone: string,
    email: string,
    password: string,
    refId: string
    createdAt: Date
}
export type StudentOutputType = {
    id: string,
    phone: string,
    email: string,
    refId: string | null
}

export class Student {
    constructor(
        public id: string,
        public phone: string,
        public email: string,
        public password: string,
        public refId: string | null,
        public createdAt: Date
    ) {}
}
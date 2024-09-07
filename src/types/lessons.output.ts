export class LessonProduct {
    constructor(
        public id: string,
        public studentId: string,
        public refLinkId: string | null,
        public paymentId: string,
        public productName: string,
        public countLessons: number,
        public addedAt: Date,
    ) {
    }
}

export type LessonsOutputType = {
    id: string,
    productName: string,
    countLessons: number
}
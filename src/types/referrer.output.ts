export class Referrer {
    constructor(
        public id: string,
        public studentId: string,
        public countOfUses: number,
        public bonusLessons: number,
        public exp: Date,
    ) {
    }
}
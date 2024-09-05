import {db} from "../db/db";

export const referrersRepository = {
    async createReferrer(referrer: Referrer) {
        try {
            const refId = await db('referrers').insert({
                id: referrer.id,
                studentId: referrer.studentId,
                countOfUses: referrer.countOfUses,
                exp: referrer.exp,
            }).returning('id');

            return refId[0].toString();
        } catch(error) {
            console.error(error);

            throw new Error('Referral not created');
        }
    }
}
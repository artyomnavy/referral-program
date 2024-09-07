import {db} from "../db/db";
import {Referrer} from "../types/referrer.output";

export const referrersRepository = {
    async createReferrer(referrer: Referrer) {
        try {
            const refLinkId = await db('Referrers').insert({
                id: referrer.id,
                studentId: referrer.studentId,
                countOfUses: referrer.countOfUses,
                bonusLessons: referrer.bonusLessons,
                exp: referrer.exp,
            }).returning('id');

            return refLinkId[0];
        } catch(error) {
            console.error(error);

            throw new Error('Referral link not created');
        }
    },
    async deleteReferrerById(id: string) {
        try {
            const isDelete = await db('Referrers').where('id', id).del();

            return isDelete === 1;
        } catch(error) {
            console.error(error);

            throw new Error('Referrer link not deleted');
        }
    },
    async updateBonusLessons(id: string, updateBonus: number) {
        try {
            const isUpdate = await db('Referrers').where('id', id).update('bonusLessons', updateBonus);

            return isUpdate === 1;
        } catch(error) {
            console.error(error);

            throw new Error('Referrer bonus not updated');
        }
    }
}
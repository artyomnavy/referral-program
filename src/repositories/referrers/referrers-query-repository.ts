import {db} from "../../db/db";
import {Referrer} from "../../models/referrers/referrer.output";
import {injectable} from "inversify";

@injectable()
export class ReferrersQueryRepository {
    async getReferrerById(id: string): Promise<Referrer | null> {
        try {
            const referrer = await db('Referrers')
                .where({id: id})
                .select('id', 'studentId', 'countOfUses', 'bonusLessons', 'exp')
                .first();

            if (!referrer) {
                return null;
            } else {
                return referrer
            }
        } catch(error) {
            console.error(error);

            throw new Error('Referrer not found');
        }
    }
}
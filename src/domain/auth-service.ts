import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {referrersRepository} from "../repositories/referrers-repository";

export const authService = {
    async generateReferralLink(protocol: string, host: string, studentId: string) {
        const referrer = new Referrer(
            uuidv4(),
            studentId,
            0,
            add(new Date(), {
                days: 3
            })
        )

        const refId = await referrersRepository.createReferrer(referrer)

        return {
            inviteLink: `${protocol}://${host}/auth/referral-registration?referer=${refId}`
        }
    }
}
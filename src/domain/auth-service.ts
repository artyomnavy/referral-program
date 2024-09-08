import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {ReferrersRepository} from "../repositories/referrers-repository";
import {Referrer} from "../types/referrer.output";
import {inject, injectable} from "inversify";
import {RefreshTokenType} from "../types/auth.output";
import {RefreshTokensRepository} from "../repositories/refresh-tokens-repository";

@injectable()
export class AuthService {
    constructor(@inject(ReferrersRepository) protected referrersRepository: ReferrersRepository,
                @inject(RefreshTokensRepository) protected refreshTokensRepository: RefreshTokensRepository) {
    }
    async generateReferralLink(protocol: string, host: string, studentId: string) {
        const referrer = new Referrer(
            uuidv4(),
            studentId,
            0,
            0,
            add(new Date(), {
                days: 3
            })
        )

        const refLink = await this.referrersRepository.createReferrer(referrer);

        return {
            inviteLink: `${protocol}://${host}/auth/referral-registration?referrer=${refLink.id}`
        }
    }
    async addRefreshTokenToBlacklist(refreshToken: RefreshTokenType): Promise<boolean> {
        return await this.refreshTokensRepository
            .addRefreshTokenToBlacklist(refreshToken)
    }
}
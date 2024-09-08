import {injectable} from "inversify";
import {RefreshTokenType} from "../types/auth.output";
import {db} from "../db/db";

@injectable()
export class RefreshTokensQueryRepository {
    async checkRefreshToken(refreshToken: RefreshTokenType): Promise<boolean> {
        try {
            const isBlacklist = await db('BlacklistRefreshTokens')
                .where(refreshToken)
                .select('id')
                .first()

            if (isBlacklist) {
                return true
            } else {
                return false
            }
        } catch(error) {
            console.error('Error in check refresh token: ', error);
            throw new Error('Error in check refresh token');
        }
    }
}
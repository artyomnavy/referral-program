import {injectable} from "inversify";
import {RefreshTokenType} from "../types/auth.output";
import {db} from "../db/db";

@injectable()
export class RefreshTokensRepository {
    async addRefreshTokenToBlacklist(refreshToken: RefreshTokenType): Promise<boolean> {
        try {
            const isBlacklist = await db('BlacklistRefreshTokens')
                .insert(refreshToken)
                .returning(['id', 'refreshToken'])

            if (!isBlacklist) {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.error('Refresh token not created: ', error);

            throw new Error('Refresh token not created');
        }
    }
}
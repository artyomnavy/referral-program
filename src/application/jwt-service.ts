import jwt from 'jsonwebtoken'
import {injectable} from "inversify";

const jwtSecret = process.env.JWT_SECRET || '123'

@injectable()
export class JwtService {
    async createAccessJWT(studentId: string) {
        const accessToken = jwt.sign({studentId}, jwtSecret, {expiresIn: '10m'})
        return accessToken
    }
    async createRefreshJWT(studentId: string) {
        const refreshToken = jwt.sign({studentId}, jwtSecret, {expiresIn: '20m'})
        return refreshToken
    }
    async getPayloadByToken(token: string) {
        try {
            const decoded: any = jwt.verify(token, jwtSecret)
            return decoded.studentId
        } catch (error) {
            return null
        }
    }
}
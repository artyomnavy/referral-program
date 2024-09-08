import {Request, Response, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils";
import {container} from "../../composition.root";
import {JwtService} from "../../application/jwt-service";
import {RefreshTokensQueryRepository} from "../../repositories/refresh-tokens-query-repository";

const jwtService = container.resolve(JwtService)
const refreshTokensQueryRepository = container.resolve(RefreshTokensQueryRepository)

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const studentId = await jwtService
        .getPayloadByToken(refreshToken)

    if (!studentId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const isBlacklist = await refreshTokensQueryRepository
        .checkRefreshToken({refreshToken})

    if (isBlacklist) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    req.studentId= studentId
    next()
}
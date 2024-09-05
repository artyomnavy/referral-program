import {Request, Response, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils";
import {jwtService} from "../../application/jwt-service";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const accessToken = auth.split(' ')[1];

    const studentId = await jwtService
        .getPayloadByToken(accessToken)

    if (studentId) {
        req.studentId = studentId
        return next()
    }

    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    return
}
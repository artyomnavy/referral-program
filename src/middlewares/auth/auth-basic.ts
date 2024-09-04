import {Buffer} from "node:buffer";
import {Request, Response, NextFunction} from "express";
import {HTTP_STATUSES} from "../../utils";

const login = process.env.BASIC_AUTH_LOGIN || 'admin'
const password = process.env.BASIC_AUTH_PASSWORD || 'qwerty'

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(':')

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    return next()
}
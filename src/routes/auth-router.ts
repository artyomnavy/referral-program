import {Response, Request, Router} from "express";
import {authService} from "../domain/auth-service";
import {AuthLoginModel} from "../types/auth.input";
import {RequestWithBody} from "../types/common";
import {studentAuthLoginValidation} from "../middlewares/validators/students-validator";
import {studentsService} from "../domain/students-service";
import {HTTP_STATUSES} from "../utils";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";

export const authRouter = Router({});

authRouter
    .post('/generation-referral-link', authBearerMiddleware, async (req: Request, res: Response) => {
        const studentId = req.studentId

        const host = req.get('host')

        if (!host) throw new Error('Host is empty')

        const inviteLink =  await authService.generateReferralLink(req.protocol, host, studentId);

        res.send(inviteLink).status(HTTP_STATUSES.OK_200)
    })

    .get('/referral-registration', (req: Request, res: Response) => {
        const { referer } = req.query;

        const formHtml = `
            <!doctype html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport"
                    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>Регистрация</title>
            </head>
            <body>
            
            <form action="/auth/referral-registration" method="post">
              <input type="hidden" name="referer" value="${referer}" />
              <label for="fullName">ФИО:</label>
              <input type="text" id="fullName" name="fullName" required /><br/>
            
              <label for="phone">Телефон:</label>
              <input type="tel" id="phone" name="phone" required /><br/>
            
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required /><br/>
            
              <button type="submit">Регистрация</button>
            </form>
            
            </body>
            </html>
        `;

        res.send(formHtml).status(HTTP_STATUSES.OK_200);
    })

    .post('/login',
    studentAuthLoginValidation,
    async (req: RequestWithBody<AuthLoginModel>, res: Response) => {
        const {
            phoneOrEmail,
            password
        } = req.body

        const student = await studentsService
            .checkCredentials({phoneOrEmail, password})

        if (!student) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        } else {
            const studentId = student.id

            const accessToken = await jwtService
                .createAccessJWT(studentId)

            const refreshToken = await jwtService
                .createRefreshJWT(studentId)


            res
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true
                })
                .status(HTTP_STATUSES.OK_200)
                .send({accessToken: accessToken})
        }
    })
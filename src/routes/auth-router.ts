import {Response, Request, Router} from "express";
import {authService} from "../domain/auth-service";
import {AuthLoginModel} from "../types/auth.input";
import {RequestWithBody, RequestWithQuery} from "../types/common";
import {studentAuthLoginValidation, studentReferralFormValidation} from "../middlewares/validators/students-validator";
import {studentsService} from "../domain/students-service";
import {HTTP_STATUSES} from "../utils";
import {jwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {CreateStudentByReferrerModel} from "../types/student.input";
import {referrersQueryRepository} from "../repositories/referrers-query-repository";
import {referrersRepository} from "../repositories/referrers-repository";

export const authRouter = Router({});

authRouter
    .post('/generation-referral-link', authBearerMiddleware, async (req: Request, res: Response) => {
        const studentId = req.studentId

        const host = req.get('host')

        if (!host) throw new Error('Host is empty')

        const inviteLink =  await authService.generateReferralLink(req.protocol, host, studentId);

        res.send(inviteLink).status(HTTP_STATUSES.OK_200)
    })

    .get('/referral-registration', async (req: RequestWithQuery<{refLinkId: string}>, res: Response) => {
        const { refLinkId } = req.query;

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
              <input type="hidden" name="referer" value="${refLinkId}" />
              <label for="fullName">ФИО:</label>
              <input type="text" id="fullName" name="fullName" required /><br/>
            
              <label for="phone">Телефон:</label>
              <input type="tel" id="phone" name="phone" required /><br/>
            
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required /><br/>
              
              <label for="password">Пароль:</label>
              <input type="password" id="password" name="password" required autocomplete="new-password" /><br/>
            
              <button type="submit">Регистрация</button>
            </form>
            
            </body>
            </html>
        `;

        res.send(formHtml).status(HTTP_STATUSES.OK_200);
    })

    .post('/referral-registration', studentReferralFormValidation, async (req: RequestWithBody<CreateStudentByReferrerModel>, res: Response) => {
        const {refLinkId, fullName, phone, email, password} = req.body

        const referrer = await referrersQueryRepository.getReferrerById(refLinkId)

        if (!referrer) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Student not found')
            return
        }

        if (referrer.countOfUses === 0 && referrer.exp < new Date()) {
            const isDeleteReferrer: boolean = await referrersRepository.deleteReferrerById(referrer.id)

            if (!isDeleteReferrer) {
                throw new Error('Referral link not deleted')
            }

            res.status(HTTP_STATUSES.GONE_410).send('Referral link already used')
            return
        }

        if (referrer.countOfUses > 3 || referrer.exp < new Date()) {
            res.status(HTTP_STATUSES.GONE_410).send('Referral link already used or expired')
            return
        }

        const createStudent = await studentsService
            .createStudentByReferrer({referrerId: referrer.studentId, fullName, phone, password, email})

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createStudent)
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
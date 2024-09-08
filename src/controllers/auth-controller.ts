import {injectable, inject} from "inversify";
import {Response, Request} from "express";
import {ReferrersQueryRepository} from "../repositories/referrers-query-repository";
import {AuthService} from "../domain/auth-service";
import {HTTP_STATUSES} from "../utils";
import {JwtService} from "../application/jwt-service";
import {RequestWithBody, RequestWithQuery} from "../types/common";
import {ReferrersRepository} from "../repositories/referrers-repository";
import {CreateStudentByReferrerModel} from "../types/student.input";
import {StudentsService} from "../domain/students-service";
import {AuthLoginModel} from "../types/auth.input";


@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(JwtService) protected jwtService: JwtService,
                @inject(StudentsService) protected studentsService: StudentsService,
                @inject(ReferrersRepository) protected referrersRepository: ReferrersRepository,
                @inject(ReferrersQueryRepository) protected referrersQueryRepository: ReferrersQueryRepository,
    ) {
    }

    async generateReferralLink(req: Request, res: Response) {
        const studentId = req.studentId

        const host = req.get('host')

        if (!host) throw new Error('Host is empty')

        const inviteLink = await this.authService.generateReferralLink(req.protocol, host, studentId);

        res.send(inviteLink).status(HTTP_STATUSES.OK_200)
    }

    async getReferralRegistrationForm(req: RequestWithQuery<{ refLinkId: string }>, res: Response) {
        const {refLinkId} = req.query;

        const referrer = await this.referrersQueryRepository.getReferrerById(refLinkId)

        if (!referrer) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Referral link not found')
            return
        }

        if (referrer.countOfUses === 0 && referrer.exp < new Date()) {
            const isDeleteReferrer: boolean = await this.referrersRepository.deleteReferrerById(referrer.id)

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
    }

    async createStudentByReferrer(req: RequestWithBody<CreateStudentByReferrerModel>, res: Response) {
        const {refLinkId, fullName, phone, email, password} = req.body

        const referrer = await this.referrersQueryRepository.getReferrerById(refLinkId)

        if (!referrer) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send('Student not found')
            return
        }

        if (referrer.countOfUses === 0 && referrer.exp < new Date()) {
            const isDeleteReferrer: boolean = await this.referrersRepository.deleteReferrerById(referrer.id)

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

        const createStudent = await this.studentsService
            .createStudentByReferrer({referrerId: referrer.studentId, fullName, phone, password, email})

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createStudent)
    }

    async loginStudent(req: RequestWithBody<AuthLoginModel>, res: Response) {
        const {
            phoneOrEmail,
            password
        } = req.body

        const student = await this.studentsService
            .checkCredentials({phoneOrEmail, password})

        if (!student) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        } else {
            const studentId = student.id

            const accessToken = await this.jwtService
                .createAccessJWT(studentId)

            const refreshToken = await this.jwtService
                .createRefreshJWT(studentId)

            res
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true
                })
                .status(HTTP_STATUSES.OK_200)
                .send({accessToken: accessToken})
        }
    }
}
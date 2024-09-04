import {Response, Request, Router} from "express";
import {authService} from "../domain/auth-service";
import {AuthLoginModel} from "../types/auth.input";
import {RequestWithBody} from "../types/common";
import {studentAuthLoginValidation} from "../middlewares/validators/students-validator";
import {studentsService} from "../domain/students-service";
import {HTTP_STATUSES} from "../utils";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({});

authRouter
    .post('/generation-referral-link', async (req: Request, res: Response) => {
        return  await authService.generateReferal(req.protocol, req.get('host'));
    })

authRouter
    .post('/registration')

authRouter
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
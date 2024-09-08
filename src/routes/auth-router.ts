import {Router} from "express";
import {studentAuthLoginValidation, studentReferralFormValidation} from "../middlewares/validators/students-validator";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {container} from "../composition.root";
import {AuthController} from "../controllers/auth-controller";
import {authRefreshTokenMiddleware} from "../middlewares/auth/auth-refresh-token";

const authController = container.resolve(AuthController)
export const authRouter = Router({});

authRouter
    .post('/generation-referral-link',
        authBearerMiddleware,
        authController.generateReferralLink.bind(authController)
    )

    .get('/referral-registration',
        authController.getReferralRegistrationForm.bind(authController)
    )

    .post('/referral-registration',
        studentReferralFormValidation,
        authController.createStudentByReferrer.bind(authController)
    )

    .post('/login',
        studentAuthLoginValidation,
        authController.loginStudent.bind(authController)
    )

    .post('/refresh-token',
        authRefreshTokenMiddleware,
        authController.updateRefreshToken.bind(authController))

    .post('/logout',
        authRefreshTokenMiddleware,
        authController.logoutStudent.bind(authController)
    )
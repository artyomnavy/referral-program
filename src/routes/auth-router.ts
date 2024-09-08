import {Router} from "express";
import {studentAuthLoginValidation, studentReferralFormValidation} from "../middlewares/validators/students-validator";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {authController} from "../composition.root";

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
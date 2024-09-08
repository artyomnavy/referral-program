import {Router} from "express";
import {paymentReferralValidation} from "../middlewares/validators/payments-validator";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {paymentsController} from "../composition.root";


export const paymentsRouter = Router({});

paymentsRouter
    .post('/referral/add',
        authBearerMiddleware,
        paymentReferralValidation,
        paymentsController.addReferralPaymentAndLessons.bind(paymentsController)
    )
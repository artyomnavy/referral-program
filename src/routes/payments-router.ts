import {Router} from "express";
import {paymentReferralValidation} from "../middlewares/validators/payments-validator";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";
import {container} from "../composition.root";
import {PaymentsController} from "../controllers/payments-controller";

const paymentsController =container.resolve(PaymentsController)
export const paymentsRouter = Router({});

paymentsRouter
    .post('/referral/add',
        authBearerMiddleware,
        paymentReferralValidation,
        paymentsController.addReferralPaymentAndLessons.bind(paymentsController)
    )
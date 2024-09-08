import {body} from "express-validator";
import {inputModelValidation} from "../input-model-validation";
import {PaymentStatuses} from "../../types/payment.output";
import {referrerValidation} from "./students-validator";

const amountValidation = body('amount')
    .isString()
    .trim()
    .isNumeric()
    .withMessage('Invalid amount')
    .isFloat({ min: 0.01 })
    .withMessage('Invalid amount value')


const paymentStatusSuccessValidation = body('paymentStatus')
    .isString()
    .trim()
    .equals(PaymentStatuses.SUCCESS)
    .withMessage('Invalid paymentStatus')

const currencyValidation = body('currency')
    .isString()
    .trim()
    .equals('RUR')
    .withMessage('Invalid currency')

const countLessonsValidation = body('countLessons')
    .isString()
    .trim()
    .isNumeric()
    .withMessage('Invalid countLessons')
    .custom((value) => {
        if (value !== '4') {
            throw new Error('countLessons must be equal to 4');
        }
        return true;
    })

const productNameValidation = body('productName')
    .isString()
    .trim()
    .not().isEmpty()
    .withMessage('Invalid productName')

export const paymentReferralValidation = [referrerValidation, amountValidation, paymentStatusSuccessValidation, currencyValidation, countLessonsValidation, productNameValidation, inputModelValidation]

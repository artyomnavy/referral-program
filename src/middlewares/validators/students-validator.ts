import {body} from "express-validator";
import {inputModelValidation} from "../input-model-validation";
import {studentsQueryRepository} from "../../repositories/students-query-repository";

const emailValidation = body('email')
    .isString()
    .trim()
    .withMessage('Invalid email')
    .isEmail()
    .withMessage('Invalid email pattern')

const emailUniqueValidation = body('email')
    .custom(async(email) => {
        const student = await studentsQueryRepository
            .getStudentByEmail(email)

        if (student) throw new Error('Email already exists')

        return true
    })

const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 8, max: 15})
    .withMessage('Invalid password')

const phoneValidation = body('phone')
    .isString()
    .trim()
    .isLength({min: 11, max: 11})
    .withMessage('Invalid phone')

export const studentAuthLoginValidation = [emailValidation, passwordValidation, inputModelValidation]
export const studentValidation = [phoneValidation, emailValidation, emailUniqueValidation, passwordValidation, inputModelValidation]
import {body} from "express-validator";
import {inputModelValidation} from "../input-model-validation";
import {container} from "../../composition.root";
import {StudentsQueryRepository} from "../../repositories/students/students-query-repository";

const studentsQueryRepository = container.resolve(StudentsQueryRepository)

const phoneOrEmailValidation = body('phoneOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .custom(async (value) => {
        const phoneRegex = /^\+7\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (phoneRegex.test(value)) {
            return true
        } else if (emailRegex.test(value)) {
            return true
        } else {
            throw new Error('Invalid phone or email')
        }
    })
    .withMessage('Invalid login or email')

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
    .isMobilePhone('ru-RU')
    .withMessage('Invalid phone')

const fullNameValidation = body('fullName')
    .isString()
    .trim()
    .isLength({min: 5})
    .withMessage('Invalid fullName')

export const referrerValidation = body('refLinkId')
    .isString()
    .trim()
    .isUUID('4')
    .withMessage('Invalid refLinkId')



export const studentAuthLoginValidation = [phoneOrEmailValidation, passwordValidation, inputModelValidation]
export const studentValidation = [fullNameValidation, phoneValidation, emailValidation, emailUniqueValidation, passwordValidation, inputModelValidation]
export const studentReferralFormValidation = [referrerValidation, fullNameValidation, phoneValidation, emailValidation, emailUniqueValidation, passwordValidation, inputModelValidation]
import {Router} from "express";
import {authBasicMiddleware} from "../middlewares/auth/auth-basic";
import {studentValidation} from "../middlewares/validators/students-validator";
import {container} from "../composition.root";
import {StudentsController} from "../controllers/students-controller";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";

const studentsController =container.resolve(StudentsController)
export const studentsRouter = Router({});

studentsRouter
    .post('/students',
        authBasicMiddleware,
        studentValidation,
        studentsController.createStudentByAdmin.bind(studentsController)
    )

    .get('/students/referral-statistic',
        authBearerMiddleware,
        studentsController.getReferralStatisticForStudent.bind(studentsController))
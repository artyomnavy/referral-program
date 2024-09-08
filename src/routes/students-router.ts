import {Router} from "express";
import {container} from "../composition.root";
import {StudentsController} from "../controllers/students-controller";
import {authBearerMiddleware} from "../middlewares/auth/auth-bearer";

const studentsController =container.resolve(StudentsController)
export const studentsRouter = Router({});

studentsRouter
    .get('/referral-statistic',
        authBearerMiddleware,
        studentsController.getReferralStatisticForStudent.bind(studentsController))
import {Router} from "express";
import {authBasicMiddleware} from "../middlewares/auth/auth-basic";
import {studentValidation} from "../middlewares/validators/students-validator";
import {studentsController} from "../composition.root";

export const studentsRouter = Router({});

studentsRouter
    .post('/students',
        authBasicMiddleware,
        studentValidation,
        studentsController.createStudentByAdmin.bind(studentsController)
    )
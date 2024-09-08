import {Router} from "express";
import {authBasicMiddleware} from "../middlewares/auth/auth-basic";
import {studentValidation} from "../middlewares/validators/students-validator";
import {container} from "../composition.root";
import {StudentsController} from "../controllers/students-controller";

const studentsController =container.resolve<StudentsController>(StudentsController)
export const studentsRouter = Router({});

studentsRouter
    .post('/students',
        authBasicMiddleware,
        studentValidation,
        studentsController.createStudentByAdmin.bind(studentsController)
    )
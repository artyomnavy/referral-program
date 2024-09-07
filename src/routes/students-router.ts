import {Response, Router} from "express";
import {RequestWithBody} from "../types/common";
import {studentsService} from "../domain/students-service";
import {CreateStudentByAdminModel} from "../types/student.input";
import {HTTP_STATUSES} from "../utils";
import {authBasicMiddleware} from "../middlewares/auth/auth-basic";
import {studentValidation} from "../middlewares/validators/students-validator";

export const studentsRouter = Router({});

studentsRouter
    .post('/students',
        authBasicMiddleware,
        studentValidation,
    async (req: RequestWithBody<CreateStudentByAdminModel>, res: Response) => {
    const { fullName, phone, email, password } = req.body

    const createStudent = await studentsService
        .createStudentByAdmin({fullName, phone, password, email})

    res
        .status(HTTP_STATUSES.CREATED_201)
        .send(createStudent)
    })
import {StudentsService} from "../domain/students-service";
import {RequestWithBody} from "../types/common";
import {CreateStudentByAdminModel} from "../types/student.input";
import {Response} from "express";
import {HTTP_STATUSES} from "../utils";

export class StudentsController {
    constructor(protected studentsService: StudentsService) {
    }

    async createStudentByAdmin(req: RequestWithBody<CreateStudentByAdminModel>, res: Response) {
        const {fullName, phone, email, password} = req.body

        const createStudent = await this.studentsService
            .createStudentByAdmin({fullName, phone, password, email})

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createStudent)
    }
}
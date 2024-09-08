import {StudentsService} from "../domain/students-service";
import {StudentsQueryRepository} from "../repositories/students/students-query-repository";
import {RequestWithBody} from "../models/common";
import {CreateStudentByAdminModel} from "../models/students/student.input";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";
import {inject, injectable} from "inversify";

@injectable()
export class StudentsController {
    constructor(@inject(StudentsService) protected studentsService: StudentsService,
                @inject(StudentsQueryRepository) protected studentsQueryRepository: StudentsQueryRepository,
    ) {
    }

    async createStudentByAdmin(req: RequestWithBody<CreateStudentByAdminModel>, res: Response) {
        const {fullName, phone, email, password} = req.body

        const createStudent = await this.studentsService
            .createStudentByAdmin({fullName, phone, password, email})

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createStudent)
    }

    async getReferralStatisticForStudent(req: Request, res: Response) {
        const studentId = req.studentId;

        const statistic = await this.studentsQueryRepository.getReferralStatisticForStudent(studentId);

        if (!statistic) {
            throw new Error('Statistic is empty')
        }

        res
            .status(HTTP_STATUSES.OK_200)
            .send(statistic)
    }
}
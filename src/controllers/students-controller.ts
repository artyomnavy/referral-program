import {StudentsService} from "../domain/students-service";
import {StudentsQueryRepository} from "../repositories/students/students-query-repository";
import {RequestWithBody} from "../models/common";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";
import {inject, injectable} from "inversify";
import {CreateStudentUseCase} from "../domain/use-cases/create-student.use-case";
import {CreateStudentModel} from "../models/students/student.input";

@injectable()
export class StudentsController {
    constructor(@inject(StudentsService) protected studentsService: StudentsService,
                @inject(StudentsQueryRepository) protected studentsQueryRepository: StudentsQueryRepository,
                @inject(CreateStudentUseCase) protected createStudentUseCase: CreateStudentUseCase,
    ) {
    }

    async createStudentByAdmin(req: RequestWithBody<CreateStudentModel>, res: Response) {
        const {fullName, phone, email, password} = req.body

        const createStudent = await this.createStudentUseCase
            .execute({referrerId: null, fullName, phone, password, email})

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
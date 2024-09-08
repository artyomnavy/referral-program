import {StudentsRepository} from "./repositories/students-repository";
import {StudentsQueryRepository} from "./repositories/students-query-repository";
import {ReferrersRepository} from "./repositories/referrers-repository";
import {ReferrersQueryRepository} from "./repositories/referrers-query-repository";
import {PaymentsRepository} from "./repositories/payments-repository";
import {LessonsRepository} from "./repositories/lessons-repository";
import {StudentsService} from "./domain/students-service";
import {PaymentsService} from "./domain/payments-service";
import {LessonsService} from "./domain/lessons-service";
import {AuthService} from "./domain/auth-service";
import {JwtService} from "./application/jwt-service";
import {AuthController} from "./controllers/auth-controller";
import {PaymentsController} from "./controllers/payments-controller";
import exp from "node:constants";
import {StudentsController} from "./controllers/students-controller";

const studentsRepository = new StudentsRepository()
export const studentsQueryRepository = new StudentsQueryRepository()

const referrersRepository = new ReferrersRepository()
const referrersQueryRepository = new ReferrersQueryRepository()

const paymentsRepository = new PaymentsRepository()

const lessonsRepository = new LessonsRepository()

export const jwtService = new JwtService()

const studentsService = new StudentsService(studentsRepository, studentsQueryRepository)

const paymentsService = new PaymentsService(paymentsRepository)

const lessonsService = new LessonsService(lessonsRepository, referrersRepository)

const authService = new AuthService(referrersRepository)

export const authController = new AuthController(authService, jwtService, studentsService, referrersRepository, referrersQueryRepository)

export const paymentsController = new PaymentsController(studentsQueryRepository, referrersQueryRepository, paymentsService, lessonsService)

export const studentsController = new StudentsController(studentsService)

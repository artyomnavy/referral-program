import "reflect-metadata";
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
import {StudentsController} from "./controllers/students-controller";
import {Container} from "inversify";
import {RefreshTokensRepository} from "./repositories/refresh-tokens-repository";
import {RefreshTokensQueryRepository} from "./repositories/refresh-tokens-query-repository";

export const container = new Container()

// Controllers
container.bind(AuthController).to(AuthController)
container.bind(PaymentsController).to(PaymentsController)
container.bind(StudentsController).to(StudentsController)

// Services
container.bind(JwtService).to(JwtService)
container.bind(StudentsService).to(StudentsService)
container.bind(PaymentsService).to(PaymentsService)
container.bind(LessonsService).to(LessonsService)
container.bind(AuthService).to(AuthService)

// Repositories
container.bind(StudentsRepository).to(StudentsRepository)
container.bind(StudentsQueryRepository).to(StudentsQueryRepository)

container.bind(ReferrersRepository).to(ReferrersRepository)
container.bind(ReferrersQueryRepository).to(ReferrersQueryRepository)

container.bind(RefreshTokensRepository).to(RefreshTokensRepository)
container.bind(RefreshTokensQueryRepository).to(RefreshTokensQueryRepository)

container.bind(PaymentsRepository).to(PaymentsRepository)
container.bind(LessonsRepository).to(LessonsRepository)




import express from 'express';
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth-router";
import {studentsSaRouter} from "./routes/students-sa-router";
import {paymentsRouter} from "./routes/payments-router";
import {testingRouter} from "./routes/testing-router";
import {studentsRouter} from "./routes/students-router";

export const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/sa', studentsSaRouter);
app.use('/students', studentsRouter);
app.use('/payments', paymentsRouter);
app.use('/testing', testingRouter)

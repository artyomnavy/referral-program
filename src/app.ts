import express from 'express';
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth-router";
import {studentsRouter} from "./routes/students-router";

export const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/sa', studentsRouter);

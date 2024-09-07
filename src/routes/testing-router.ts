import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../utils";
import {db} from "../db/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await db('Students').delete();
        await db('Referrers').delete();
        await db('Payments').delete();
        await db('Lessons').delete();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
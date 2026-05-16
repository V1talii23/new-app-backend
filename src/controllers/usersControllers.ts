import { Request, Response } from "express"
import { prisma } from "../../lib/prisma"
import createHttpError from "http-errors"

export const createUser = (req:Request, res:Response) => {
    const user = req.body
    if (!user) {
        return createHttpError(400, "Omg, something happend")
    } 


} 
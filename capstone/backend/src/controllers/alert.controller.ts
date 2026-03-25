import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession";
import pool from "../config/db"

export const getAlert = async(req: AuthenticatedRequest, res: Response) => {

}

export const newAlert = async(req: AuthenticatedRequest, res: Response) => {

}
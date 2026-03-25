import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession";
import pool from "../config/db"

export const getTransaction = async(req: AuthenticatedRequest, res: Response) => {

}

export const newTransaction = async(req: AuthenticatedRequest, res: Response) => {

}

export const getTransactionCategory = async(req: AuthenticatedRequest, res: Response) => {

}

export const newTransactionCategory = async(req: AuthenticatedRequest, res: Response) => {

}

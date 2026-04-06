import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession";
import pool from "../config/db"

export const getAlert = async(req: AuthenticatedRequest, res: Response) => {
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

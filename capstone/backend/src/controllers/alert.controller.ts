import { Request, Response } from "express"

import pool from "../config/db"

export const getAlert = async(req: Request, res: Response) => {
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

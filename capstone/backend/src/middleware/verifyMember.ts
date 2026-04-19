import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { BusinessMember } from "../types/business.type";

export const verifyMember = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { businessID } = req.params;
        const userID = req.user.uid;

        if(!businessID){
            res.status(400).json({ message: "Missing Parameter" });
            return;
        }
        const result = await pool.query<BusinessMember>(`SELECT * FROM business_member 
            WHERE business_id = $1 AND user_id = $2 
            LIMIT 1`, [businessID, userID]);

        const member = result.rows[0];

        if(!member){
            res.status(403).json({ message: "Not a business member" });
            return;
        }

        req.businessMember = member;

        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Server Error " });
    }
}
import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { BusinessMember } from "../types/business.type";
import { BusinessParams } from "../types/common.type";

export const verifyMember = async (req: Request<BusinessParams>, res: Response, next: NextFunction) => {
    try{
        if(!req.user){
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.params.businessID = String(req.params.businessID).replace(/"/g, "");
        const businessID = req.params.businessID;
        const userID = req.user.uid;

        if(!businessID){
            res.status(400).json({ message: "Missing Parameter" });
            return;
        }

        const result = await pool.query<BusinessMember>(`SELECT * FROM business_member 
            WHERE business_id = $1 AND user_id = $2 
            LIMIT 1`, [businessID, userID]);

        const member = result.rows[0];

        if(!member || member.role === "disabled"){
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
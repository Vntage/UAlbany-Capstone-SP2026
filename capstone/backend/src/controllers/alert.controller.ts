import { Request, Response } from "express"

import pool from "../config/db"
import { BusinessParams } from "../types/common.type";

//get all alerts
export const getAlert = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const user_id = req.user?.uid;
        const businessID = req.params.businessID;

        const result = await pool.query(`SELECT 
            a.uid AS alert_id, a.title, a.message, a.severity, a.triggered_at, ar.read_at, ar.user_id,
            ar.uid AS recipient_id
            FROM alert_recipients ar
            JOIN alerts a ON a.uid = ar.alert_id
            JOIN alert_rules r ON r.uid = a.alert_rule_id
            WHERE ar.user_id = $1
            AND r.business_id = $2
            ORDER BY a.triggered_at DESC`, [user_id, businessID]);

        if(!result.rows){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(200).json(result.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

//toggle rule on/off
export const toggleRule = async(req: Request, res: Response) => {
    try{
        const { alert_rule_id } = req.body
        
        if(!alert_rule_id){
            return res.status(401).json({ message: "Missing Field" })
        }

        const result = await pool.query(`UPDATE alert_rules
            SET is_active = NOT is_active
            WHERE uid = $1
            RETURNING *`, [alert_rule_id]);

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(200).json({ message: "Successful" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

//updates alert recipient seen
export const updateSeen = async(req: Request, res: Response) => {
    try{
        const user_id = req.user?.uid;
        const { alert_id } = req.body;
        
        if(!alert_id){
            return res.status(401).json({ message: "Missing Field" })
        }

        const result = await pool.query(`UPDATE alert_recipients
            SET read_at = CASE 
                WHEN read_at IS NULL THEN NOW()
                ELSE NULL
            END
            WHERE alert_id = $1
            AND user_id = $2
            RETURNING *`, [alert_id, user_id]);

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(200).json({ message: "Successful" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}


//gets all rules for business
export const getRule = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM alert_rule WHERE business_id = $1`, [req.params.businessID]);

        if(!result.rows){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(200).json(result.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

//create rule function
export const createRule = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const { title, condition, type } = req.body;

        if(!title || !condition || !type){
            return res.status(400).json({ message: "Missing Fields" });
        }

        const result = await pool.query(`INSERT INTO alert_rule (business_id, title, condition, type, is_active, created_by)
            VALUES ($1, $2, $3, $4, true, $5)
            RETURNING *`, [req.params.businessID, title, condition, type, req.user!.uid]);

        if(!result.rows){
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(201).json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }

}
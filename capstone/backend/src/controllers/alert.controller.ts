import { Request, Response } from "express"

import pool from "../config/db"

//create update alert seen, update rule toggle, get single alert, get all alerts

//get user alerts
export const getAlert = async(req: Request, res: Response) => {
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}



export const getRule = async(req: Request, res: Response) => {
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

export const createRule = async(req: Request, res: Response) => {
    try{
        const { condition, type } = req.body;

        if(!condition || !type){
            return res.status(400).json({ message: "Missing Fields" });
        }

        const result = await pool.query(`INSERT INTO alert_rule (business_id, condition, type, is_active, created_by)
            VALUES ($1, $2, $3, true, $4)
            RETURNING *`, [req.params.businessID, condition, type, req.user!.uid]);

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
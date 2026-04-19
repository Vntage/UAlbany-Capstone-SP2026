import { Request, Response } from "express"
import pool from "../config/db"
import { Business, BusinessMember } from "../types/business.type";
import { BusinessParams } from "../types/common.type";

export const getBusiness = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;

    const business = await pool.query<Business>(`SELECT * FROM businesses WHERE uid = $1`, [business_id]);

    if(!business.rows.length){
        return res.status(401).json({ message: "Business not found" });
    }

    return res.status(201).json(business.rows[0])
}

export const getUserBusinesses = async(req: Request, res: Response) => {
    const uid = req.user?.uid
    
    const business = await pool.query<Business>(`SELECT business_id FROM businesses where user_id = $1`, [uid]);

    if(!business.rows.length){
        return res.status(401).json({ message: "Business not found" });
    }
    return res.status(201).json(business.rows)
}

export const createBusiness = async(req: Request, res: Response) => {
    try{
        const { name, type, currency, date_month, date_year } = req.body
        const uid = req.user?.uid;
        if(!name || !type || !currency){
            return res.status(400).json({ message: "Missing fields" })
        }

        const date = new Date();

        const businessResult = await pool.query<Business>(`INSERT INTO businesses 
            (name, type, currency, created_month, created_year)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
            [name, type, currency, date_month || date.getMonth() + 1, date_year || date.getFullYear()]);
        
        const business = businessResult.rows[0];

        if(!business){
            return res.status(500).json({ message: "Database Error" });
        }

        const memberResult = await pool.query(`INSERT INTO business_member 
            (business_id, user_id, role)
            VALUE($1, $2, 'OWNER') RETURNING *;`,
            [business!.uid, uid]);
        
        return res.status(201).json({ message: "Successfully created business" })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const getBusinessMember = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;

    const business_memberResult = await pool.query<BusinessMember>(`SELECT * FROM business_members WHERE business_id = $1`, [business_id]);

    if(!business_memberResult.rows.length){
        res.status(500).json({ message: "Server Error" })
    }

    res.status(201).json(business_memberResult.rows)
}

export const createBusinessMember = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;
    const role = req.body
    const user_id = req.user?.uid

    if(!business_id || !role || user_id){
        return res.status(400).json({ message: "Missing fields" })
    }

    try{
        const business_memberResult = await pool.query<BusinessMember>(`INSERT INTO business_members (business_id, user_id, role)
            VALUES($1, $2, $3) RETURNING *`, 
            [business_id, user_id, role])
        
        res.status(201).json({ message: "Successfully create business member" })
    }
    catch(error: any){
        if(error.code === "23505"){
            return res.status(409).json({ message: "User is already member" })
        }
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}
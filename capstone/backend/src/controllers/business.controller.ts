import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession"
import pool from "../config/db"

export const getBusiness = async(req: AuthenticatedRequest, res: Response) => {
    const { business_id } = req.params;

    const business = await pool.query(`SELECT * FROM businesses WHERE uid = $1`, [business_id]);

    if(!business.rows.length){
        return res.status(401).json({ message: "Business not found" });
    }

    return res.status(201).json(business.rows[0])
}

export const getUserBusinesses = async(req: AuthenticatedRequest, res: Response) => {
    const uid = req.user
    
    const business = await pool.query(`SELECT business_id FROM businesses where user_id = $1`, [uid]);

    if(!business.rows.length){
        return res.status(401).json({ message: "Business not found" });
    }
    return res.status(201).json(business.rows)
}

export const createBusiness = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const { name, type, currency } = req.body
        const uid = req.user;
        if(!name || !type || currency){
            return res.status(400).json({ message: "Missing fields" })
        }

        const date = new Date();

        const businessResult = await pool.query(`INSERT INTO businesses 
            (name, type, currency, created_month, created_year)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
            [name, type, currency, date.getMonth(), date.getFullYear()]);
        
        const business = businessResult.rows[0];

        const memberResult = await pool.query(`INSERT INTO business_member 
            (business_id, user_id, role)
            VALUE($1, $2, 'OWNER') RETURNING *;`,
            [business.uid, uid]);
        
        res.status(201).json({ message: "Successfully created business" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

export const getBusinessMember = async(req: AuthenticatedRequest, res: Response) => {
    const business_id = req.params;

    const business_memberResult = await pool.query(`SELECT * FROM business_members WHERE business_id = $1`, [business_id]);

    if(!business_memberResult.rows.length){
        res.status(500).json({ message: "Server Error" })
    }

    res.status(201).json(business_memberResult.rows)
}

export const createBusinessMember = async(req: AuthenticatedRequest, res: Response) => {
    const business_id = req.params;
    const role = req.body
    const user_id = req.user

    if(!business_id || !role || user_id){
        return res.status(400).json({ message: "Missing fields" })
    }

    try{
        const business_memberResult = await pool.query(`INSERT INTO business_members (business_id, user_id, role)
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
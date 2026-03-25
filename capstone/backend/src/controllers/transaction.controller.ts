import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/verifySession";
import pool from "../config/db"

export const getTransaction = async(req: AuthenticatedRequest, res: Response) => {
    const businessID = req.params;

    const transactions = await pool.query(`SELECT * FROM transactions
        WHERE business_id = $1
        ORDER BY date`,
        [businessID]);

    if(!transactions.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }

    return res.status(201).json(transactions.rows)
}

export const createTransaction = async(req: AuthenticatedRequest, res: Response) => {
    const businessID = req.params;
    const userID = req.user?.uid;
    const { name, date, description, type, categoryID, amount } = req.body;

    if(!businessID || !name || !date || !type || !amount || !userID){
        return res.status(400).json({ message: "Missing required fields" })
    }
    try{
        await pool.query(`INSERT INTO transaction
            (business_id, name, date, description, type, category_id, amount, created_by)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
            [businessID, name, date, description, type, categoryID, amount, userID]);
        
        return res.status(201).json({ message: "Successfully created transaction" })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }

}

export const getTransactionCategory = async(req: AuthenticatedRequest, res: Response) => {
    const businessID = req.params;

    const transaction_categories = await pool.query(`SELECT * FROM transaction_categories 
        WHERE business_id = $1
        ORDER BY name;`,
        [businessID])
    
    if(!transaction_categories.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }

    return res.status(201).json(transaction_categories.rows)
}

export const createTransactionCategory = async(req: AuthenticatedRequest, res: Response) => {
    const businessID = req.params;
    const name = req.body;

    if(!businessID || !name){
        return res.status(400).json({ message: "Missing fields" })
    }

    const transctionResult = await pool.query(`INSERT INTO transaction_categories (business_id, name)
        VALUES($1, $2) RETURNING *;`,
        [businessID, name])
    
    if(!transctionResult.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }
    return res.status(201).json({ message: "Successfully created transaction category" })
}

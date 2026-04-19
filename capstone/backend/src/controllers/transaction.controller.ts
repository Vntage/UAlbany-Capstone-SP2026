import { Request, Response } from "express"
import { BusinessParams } from "../types/common.type";
import pool from "../config/db"
import { Transaction, TransactionCategory } from "../types/transaction.type";
import { checkAlertRules } from "../middleware/alerts";

export const getTransaction = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;

    const transactions = await pool.query<Transaction>(`SELECT * FROM transactions
        WHERE business_id = $1
        ORDER BY date`,
        [businessID]);

    if(!transactions.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }

    return res.status(201).json(transactions.rows)
}

export const createTransaction = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const userID = req.user?.uid;
    const { name, date, description, type, categoryID, amount } = req.body;

    if(!businessID || !name || !date || !type || !amount || !userID){
        return res.status(400).json({ message: "Missing required fields" })
    }
    try{
        const result = await pool.query<Transaction>(`INSERT INTO transaction
            (business_id, name, date, description, type, category_id, amount, created_by)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
            [businessID, name, date, description, type, categoryID, amount, userID]);

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" })
        }

        checkAlertRules(businessID, result.rows[0])
        
        return res.status(201).json({ message: "Successfully created transaction" })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }

}

export const getTransactionCategory = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;

    const transaction_categories = await pool.query<TransactionCategory>(`SELECT * FROM transaction_categories 
        WHERE business_id = $1
        ORDER BY name;`,
        [businessID])
    
    if(!transaction_categories.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }

    return res.status(201).json(transaction_categories.rows)
}

export const createTransactionCategory = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const name = req.body;

    if(!businessID || !name){
        return res.status(400).json({ message: "Missing fields" })
    }

    const transctionResult = await pool.query<TransactionCategory>(`INSERT INTO transaction_categories (business_id, name)
        VALUES($1, $2) RETURNING *;`,
        [businessID, name])
    
    if(!transctionResult.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }
    return res.status(201).json({ message: "Successfully created transaction category" })
}

import { Request, Response } from "express"
import { AuthenticatedRequest, BusinessParams } from "../middleware/verifySession";
import pool from "../config/db"

export const newBudget = async (req: AuthenticatedRequest & Request<BusinessParams>, res: Response) => {
    try{
        const { businessID } = req.params;
        const { name, periodStart, periodEnd } = req.body;
        if(!name || !periodStart || !periodEnd){
            return res.status(400).json({ message: "Missing required fields" })
        }
        const query = `INSERT INTO budgets (
            business_id, name, period_start, period_end, created_at, creator)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        
        const values = [
            businessID,
            name,
            periodStart,
            periodEnd,
            Date.now(),
            req.user?.uid
        ];
        
        const { rows } = await pool.query(query, values);

        if(!rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(201).json(rows[0])
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const newBudgetedItem = async (req: AuthenticatedRequest & Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params;
        const { budgetId, transactionCategoryId, allocatedAmount } = req.body;

        if(!budgetId || !transactionCategoryId || !allocatedAmount){
            return res.status(401).json({ message: "Missing Required Fields" })
        }

        const query = `INSERT INTO budgeted_items (
            business_id, budget_id, transaction_category_id, allocated_amount, creator, created_at, update_by, updated_at)
            VALUES($1, $2, $3, $4, $5, $6, $5, $6)
            RETURNING *`;

        const values = [
            businessID,
            budgetId,
            transactionCategoryId,
            allocatedAmount,
            req.user?.uid,
            Date.now()
        ];

        const { rows } = await pool.query(query, values);

        if(!rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(201).json(rows[0])
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getBudget = async (req: AuthenticatedRequest & Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params;
        const { periodStart, periodEnd } = req.body;

        let query = `SELECT * FROM budgets WHERE business_id = $1 `;

        const values: any[] = [businessID];

        if(periodStart && periodEnd){
            values.push(periodStart);
            values.push(periodEnd);

            query += `AND period_start <= $${values.length - 1} 
                AND period_end >= $${values.length} `
        }

        query += `ORDERED BY created_at DESC`;

        const { rows } = await pool.query(query, values);

        if(!rows){
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(200).json(rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getBudgetedItem = async (req: AuthenticatedRequest & Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params;
        const { transactionCategoryId, budgetId} = req.body;

        let query = `SELECT * FROM budgeted_items WHERE business_id = $1 `;
        const values: any[] = [businessID];

        if(transactionCategoryId){
            values.push(transactionCategoryId);

            query += `AND transaction_category_id = $${values.length} `;
        }

        if(budgetId){
            values.push(budgetId);

            query += `AND budget_id = $${values.length} `;
        }

        query += `ORDER BY created_at DESC`;

        const { rows } = await pool.query(query, values);

        if(!rows){
            return res.status(500).json({ message: "Database Error" })
        }

        return res.status(200).json(rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}
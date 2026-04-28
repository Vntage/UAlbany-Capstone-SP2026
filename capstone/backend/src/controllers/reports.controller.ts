import { Request, Response } from "express"
import pool from "../config/db"
import { BusinessParams } from "../types/common.type"

//need to figure out how to generate the report

export const getIncomeStatement = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: "Missing Fields" });
    }

    try{
        const result = await pool.query(
            `SELECT type, SUM(amount) as total
            FROM transactions
            WHERE business_id = $1
            AND date BETWEEN $2 AND $3
            GROUP BY type`,
            [businessID, startDate, endDate]
        );

        let income = 0;
        let expense = 0;

        for(const row of result.rows){
            if(row.type === "income") income = Number(row.total);
            if(row.type === "expense") expense = Number(row.total);
        }
        return res.status(200).json({
            income,
            expense,
            netProfit: income-expense
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getExpenseReport = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: "Missing Fields" });
    }

    try{
        const result = await pool.query(
            `SELECT c.name as category, SUM(t.amount) as total
            FROM transactions t
            JOIN transaction_category c
            ON t.category_id = c.uid
            WHERE t.business_id = $1
            AND t.type = 'expense'
            AND t.date BETWEEN $2 AND $3
            GROUP BY c.name
            ORDER BY total DESC`,
            [businessID, startDate, endDate]
        );

        return res.status(200).json(result.rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getCashFlow = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: "Missing Fields" });
    }

    try{
        const result = await pool.query(
            `SELECT date, 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
            FROM transactions
            WHERE business_id = $1
            AND date BETWEEN $2 AND $3
            GROUP BY date
            ORDER BY date ASC`,
            [businessID, startDate, endDate]
        );

        return res.status(200).json(result.rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getCategoryBreakdown = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: "Missing Fields" });
    }

    try{
        const result = await pool.query(
            `SELECT c.name as category
            SUM(t.amount) as total
            FROM transaction t
            JOIN transaction_category c
            ON t.category_id = c.uid
            WHERE t.business_id = $1
            AND t.date BETWEEN $2 AND $3
            GROUP BY c.name
            ORDER BY total DESC`,
            [businessID, startDate, endDate]
        )

        return res.status(200).json(result.rows);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

//not implemented yet
export const getBalanceSheet = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { startDate, endDate } = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: "Missing Fields" });
    }

    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}
import { Request, Response } from "express"
import { BusinessParams } from "../types/common.type";
import pool from "../config/db"
import { Budget, BudgetedItem } from "../types/budget.type";

export const newBudget = async (req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        const { name, periodStart, periodEnd } = req.body;
        console.log(req.body)
        if(!req.user){
            return res.status(401).json({ message: "Unauthorized" })
        }

        if(!name || !periodStart || !periodEnd){
            return res.status(400).json({ message: "Missing required fields" })
        }
        const query = `INSERT INTO budget (
            business_id, name, period_start, period_end, created_at, created_by)
            VALUES($1, $2, $3, $4, NOW(), $5)
            RETURNING *`;
        
        const values = [
            businessID,
            name,
            periodStart,
            periodEnd,
            req.user?.uid
        ];
        
        const { rows } = await pool.query<Budget>(query, values);

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

export const newBudgetedItem = async (req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        const { budgetId, transactionCategoryId, allocatedAmount } = req.body;

        if(!budgetId || !transactionCategoryId || !allocatedAmount){
            return res.status(401).json({ message: "Missing Required Fields" })
        }

        const query = `INSERT INTO budget_item (
            business_id, budget_id, transaction_category_id, allocated_amount, created_by, created_at)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`;

        const values = [
            businessID,
            budgetId,
            transactionCategoryId,
            allocatedAmount,
            req.user?.uid,
            Date.now()
        ];

        const { rows } = await pool.query<BudgetedItem>(query, values);

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

export const getBudget = async (req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        
        const budgetResult = await pool.query(
            `SELECT * FROM budget
            WHERE business_id = $1
            ORDER BY created_at DESC
            LIMIT 1`,
            [businessID]
        )

        const budget = budgetResult.rows[0];

        if(!budget){
            return res.status(200).json({
                categories: [],
                summary: null
            })
        }

        
        const itemResult = await pool.query(
            `SELECT 
            bi.uid,
            tc.name,
            bi.allocated_amount AS budgeted
            FROM budget_item bi
            JOIN transaction_category tc
            ON tc.uid = bi.category_id
            WHERE bi.business_id = $1
            AND bi.budget_id = $2`,
            [businessID, budget.uid]
        )

        const items = itemResult.rows;


        const actualResult = await pool.query(
            `SELECT 
            category_id,
            SUM(amount) as actual
            FROM transactions
            WHERE business_id = $1
            AND type = 'expense'
            AND date >= $2
            AND date <= $3
            GROUP BY category_id`,
            [businessID, budget.period_start, budget.period_end]
        );

        const actualMap: Record<string, number> = {};

        actualResult.rows.forEach((row) => {
            actualMap[row.category_id] = Number(row.actual)
        });

        const categories = items.map((item) => {
            const actual = actualMap[item.category_id] || 0;
            const budgeted = Number(item.allocated_amount);
            const variance = budgeted - actual;

            let status = "OK";
            if (actual > budgeted) status = "Over";
            else if (actual > budgeted * 0.8) status = "Warning";

            return {
                id: item.uid,
                name: item.name,
                budgeted,
                actual,
                variance,
                status,
            };
        });

        const totalBudget = categories.reduce((s, c) => s + c.budgeted, 0);
        const totalActual = categories.reduce((s, c) => s + c.actual, 0);

        const utilization =
        totalBudget > 0
            ? Math.round((totalActual / totalBudget) * 100)
            : 0;

        const summary = {
            utilization,
            runway: totalBudget - totalActual,
        };

        return res.status(200).json({
            budget, 
            categories,
            summary
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getBudgetedItem = async (req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        const { transactionCategoryId, budgetId} = req.body;

        let query = `SELECT * FROM budget_item WHERE business_id = $1 `;
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

        const { rows } = await pool.query<BudgetedItem>(query, values);

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
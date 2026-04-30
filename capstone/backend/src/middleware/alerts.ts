//checks if any transactions breaks any rules => creates an alert
//put in every create transaction call
//might need to create a new schema for rules unless only preset rules
//capstone architecture doc updated for schema on how to develop

import { Request, Response, NextFunction } from "express";
import { AlertCondition, AlertRule, Expression } from "../types/alert.type";
import pool from "../config/db";
import { Budget } from "../types/budget.type";
import { Transaction } from "../types/transaction.type";
import { BusinessMember } from "../types/business.type";

const getCurrentBudget = async(business_id: string) => {
    const result = await pool.query<Budget>(
        `SELECT * FROM budget
        WHERE business_id = $1
        AND period_start <= NOW()
        AND period_end >= NOW()
        ORDER BY period_start DESC
        LIMIT 1`,
        [business_id]
    );

    return result.rows[0] || null
}

const getTransactionTotal = async(business_id: string, budget: Budget) => {
    const result = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE business_id = $1
        AND type = 'expense'
        AND date BETWEEN $2 AND $3`,
        [business_id, budget.period_start, budget.period_end]
    );

    return Number(result.rows[0].total);
}

const getCategoryTotal = async(business_id: string, category_id: string, budget: Budget) => {
    const result = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE business_id = $1
        AND category = $2
        AND type = 'expense'
        AND date BETWEEN $3 AND $4`,
        [business_id, category_id, budget.period_start, budget.period_end]
    );

    return Number(result.rows[0].total);
}

const getBudgetTotal = async(budget_id:string) => {
    const result = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total
        FROM budgeted_items
        WHERE budget_id = $1`,
        [budget_id]
    );

    return Number(result.rows[0].total);
}

const getAllocatedAmount = async(budget_id: string, category_id: string) => {
    const result = await pool.query(
        `SELECT allocated_amount 
        FROM budgeted_items
        WHERE budget = $1 AND transaction_category = $2`,
        [budget_id, category_id]
    );

    return Number(result.rows[0].total);
}


const evaluateExpression = async (expr: Expression, business_id: string, budget: Budget): Promise<number> => {
    switch(expr.type){
        case "value": return expr.value;
        case "metric": return await getTransactionTotal(business_id, budget);
        case "budget_total": return await getBudgetTotal(budget.uid);
        case "category_total": return await getCategoryTotal(business_id, expr.category_id, budget);
        case "budget_item_allocated": return await getAllocatedAmount(business_id, expr.category_id);
        case "expression": {
            const left = await evaluateExpression(expr.left, business_id, budget);
            const right = await evaluateExpression(expr.right, business_id, budget);

            switch(expr.operator){
                case "*": return left * right;
                case "/": return left / right;
                case "+": return left + right;
                case "-": return left - right;
            }   
        }
    }
};

const evaluateCondition = async(condition: AlertCondition, business_id: string, budget: Budget) => {
    const left = await evaluateExpression(condition.left, business_id, budget);
    const right = await evaluateExpression(condition.right, business_id, budget);

    switch(condition.operator){
        case "<": return left < right;
        case "<=": return left <= right;
        case ">": return left > right;
        case ">=": return left >= right;
        case "=": return left === right;
    }
};

export const checkAlertRules = async(business_id: string, transaction: Transaction) => {
    const budget = await getCurrentBudget(business_id);

    if(!budget) return;

    const rulesResult = await pool.query<AlertRule>(
        `SELECT * FROM alert_rule
        WHERE business_id = $1 AND is_active = true`,
        [business_id]
    );

    for (const rule of rulesResult.rows){
        const triggered = await evaluateCondition(
            rule.condition,
            business_id,
            budget
        );

        if(triggered){
            const alertResult = await pool.query(
                `INSERT INTO alerts
                (title, message, severity, alert_rule_id, triggered_at)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *`,
                [
                    rule.title,
                    rule.condition,
                    "high",
                    rule.uid
                ]
            );
            
            const alert = alertResult.rows[0];

            const members = await pool.query(
                `SELECT user_id FROM business_member WHERE business_id = $1`, [business_id]
            );

            for(const m of members.rows){
                await pool.query(
                    `INSERT INTO alert_recipients 
                    (alert_id, user_id, created_at)
                    VALUES ($1, $2, NOW())`,
                    [alert.uid, m]
                );
            }
        }
    }
}
//checks if any transactions breaks any rules => creates an alert
//put in every create transaction call
//might need to create a new schema for rules unless only preset rules
//capstone architecture doc updated for schema on how to develop

import { Request, Response, NextFunction } from "express";
import { AlertCondition, AlertRule, AlertSeverity, Expression } from "../types/alert.type";
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
        AND category_id = $2
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

    return Number(result.rows[0].allocated_amount);
}

const getAllocatedAmount = async(budget_id: string, category_id: string) => {
    const result = await pool.query(
        `SELECT allocated_amount 
        FROM budgeted_items
        WHERE budget = $1 AND category_id = $2`,
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

    let triggered = false;

    switch(condition.operator){
        case "<": triggered = left < right; break;
        case "<=": triggered = left <= right; break;
        case ">": triggered = left > right; break;
        case ">=": triggered = left >= right; break;
        case "=": triggered = left === right; break;
    }

    const ratio = right === 0 ? (left === 0 ? 1: Infinity) : left / right;

    return { triggered, left, right, ratio };
};

const computeSeverity = (ratio: number) : AlertSeverity => {
    if(ratio > 2) return "high";
    if(ratio >=1.25) return "medium";
    return "low";
}

const operatorMessage = (operator: ">" | ">=" | "<=" | "<" | "=") => {
    switch(operator){
        case ">": 
        case ">=":
            return "exceeded";
        case "<=":
        case "<":
            return "fell below";
        case "=":
            return "matched";
        default: 
            return "triggered";
    }
}

const describeExpresssion = (expr: Expression): string => {
    switch(expr.type){
        case "value":
            return expr.value.toString();
        case "metric":
            return "Total Transactions";
        case "budget_total":
            return "Total Budget";
        case "category_total":
            return `Category Spending`;
        case "budget_item_allocated":
            return "Allocated Budget";
        case "expression":
            return `(${describeExpresssion(expr.left)} ${expr.operator} ${expr.right})`;
    }
}

const buildAlertMessage = (condition: AlertCondition, left: number, right: number): string => {
    const leftDescription = describeExpresssion(condition.left);
    const rightDescription = describeExpresssion(condition.right);

    const operatorDescription = operatorMessage(condition.operator);

    let leftText, rightText = "";
    if(condition.left.type === "value"){
        leftText = leftDescription;
    }
    else{
        leftText = `${leftDescription} (${left})`
    }

    if(condition.right.type === "value"){
        rightText = rightDescription;
    }
    else{
        rightText = `${rightDescription} (${right})`
    }

    return `${leftText} ${operatorDescription} ${rightText}`;
}

export const checkAlertRules = async(business_id: string) => {
    const budget = await getCurrentBudget(business_id);

    if(!budget) return;

    const rulesResult = await pool.query<AlertRule>(
        `SELECT * FROM alert_rule
        WHERE business_id = $1 AND is_active = true`,
        [business_id]
    );

    for (const rule of rulesResult.rows){
        const result = await evaluateCondition(
            rule.condition,
            business_id,
            budget
        );
        const existing = await pool.query(
            `SELECT * FROM alert
            WHERE alert_rule_id = $1
            AND status = 'active'
            ORDER BY triggered_at DESC
            LIMIT 1`,
            [rule.uid]
        );

        if(result.triggered){
            if(existing.rows.length === 0){
                const severity = computeSeverity(result.ratio);
                const message = buildAlertMessage(rule.condition, result.left, result.right);
                const alertResult = await pool.query(
                    `INSERT INTO alert
                    (title, message, severity, alert_rule_id, triggered_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    RETURNING *`,
                    [
                        rule.title,
                        message,
                        severity,
                        rule.uid
                    ]
                );
                
                const alert = alertResult.rows[0];

                const members = await pool.query(
                    `SELECT user_id FROM business_member WHERE business_id = $1`, [business_id]
                );

                for(const m of members.rows){
                    await pool.query(
                        `INSERT INTO alert_recipient 
                        (alert_id, user_id, created_at)
                        VALUES ($1, $2, NOW())`,
                        [alert.uid, m.user_id]
                    );
                }
            }
            else{
                const severity = computeSeverity(result.ratio);
                const message = buildAlertMessage(rule.condition, result.left, result.right);
                await pool.query(
                    `UPDATE alert 
                    SET message = $2,
                    severity = $3
                    WHERE uid = $1`,
                    [existing.rows[0].uid, message, severity]
                )
            }
            
        }
        else {
            await pool.query(
                `UPDATE alert
                SET status = 'resolved',
                resolved_at = NOW()
                message = $2
                WHERE alert_rule_id = $1
                AND status = 'active'`,
                [rule.uid, `${rule.title} resolved.`]
            )
        }
    }
}
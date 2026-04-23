import { Request, Response } from "express"
import { BusinessParams, CsvRows } from "../types/common.type";
import pool from "../config/db"
import { Transaction, TransactionCategory } from "../types/transaction.type";
import { checkAlertRules } from "../middleware/alerts";
import { parse } from "csv-parse/sync"
import { randomUUID } from "crypto";

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
        const result = await pool.query<Transaction>(`INSERT INTO transactions
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

    const transaction_categories = await pool.query<TransactionCategory>(`SELECT * FROM transaction_category 
        WHERE business_id = $1
        ORDER BY name;`,
        [businessID])

    return res.status(201).json(transaction_categories.rows)
}

export const createTransactionCategory = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const { name } = req.body;
    console.log("")

    if(!businessID || !name){
        return res.status(400).json({ message: "Missing fields" })
    }

    const transctionResult = await pool.query<TransactionCategory>(`INSERT INTO transaction_category (business_id, name)
        VALUES($1, $2) RETURNING *;`,
        [businessID, name])
    
    if(!transctionResult.rows.length){
        return res.status(500).json({ message: "Server Error" })
    }
    return res.status(201).json({ message: "Successfully created transaction category" })
}

export const validatedCSV = async(req: Request<BusinessParams>, res: Response) => {
    const businessID = req.params.businessID;
    const user = req.user?.uid;

    if(!req.file){
        return res.status(400).json({ message: "Missing Field" });
    }

    try{
        const csv = req.file?.buffer.toString();

        const records = parse(csv, {
            columns: (header) => 
                header.map((h)=> 
                    h.trim().toLowerCase()
                ),
            skip_empty_lines: true,
            trim: true,
        }) as CsvRows[];

        const valid: any[] = [];
        const invalid: any[] = [];
        const duplicate: any[] = [];

        const seen = new Set();

        records.forEach((row, index) => {
            const error = [];

            if(!isCsvRow(row)){
                invalid.push({
                    row: index + 1,
                    data: row,
                    error: ["Invalid row structure"]
                });
                return;
            }

            let { date, name, amount, category, description } = row;

            const key = `${date}|${name.toLowerCase()}|${Number(amount)}`;

            if(seen.has(key)){
                duplicate.push({
                    row: index + 1,
                    data: row,
                    error: ["Duplicate row in file"],
                })
                return;
            }

            seen.add(key);

            if(!date || isNaN(Date.parse(date))){
                error.push("Invalid Date");
            }
            if(!name){
                error.push("Name is required");
            }
            if(!amount){
                error.push("Invalid Amount");
            }
            if(!category){
                error.push("Category is Required");
            }
            let type = null;
            if(!isNaN(amount)){
                type = Number(amount) < 0 ? "expense" : "income";
            }

            if(type == "expense"){
                amount*=-1;
            }

            const transaction = {
                tempID: randomUUID(),
                business_id: businessID,
                name,
                date,
                description: description || null,
                type,
                category_name: category,
                amount: Number(amount),
                creator: user
            }
            if(error.length > 0){
                invalid.push({
                    row: index + 1,
                    data: row,
                    error
                })
            }
            else{
                valid.push(transaction)
            }
        });
        const dbTransactions = await pool.query(`
            SELECT date, name, amount 
            FROM transactions 
            WHERE business_id = $1 AND date = ANY($2)`, 
            [businessID, valid.map((r)=> r.date)]);

        const dbSet = new Set(
            dbTransactions.rows.map((r: any) => 
                `${r.date}|${r.name.toLowerCase()}|${Number(r.amount)}`
            )
        )

        const finalValid: any[] = [];
        const dbDuplicate: any[] = [];

        for(const row of valid){
            const key = `${row.date}|${row.name.trim().toLowerCase()}|${Number(row.amount)}`;

            if(dbSet.has(key)){
                dbDuplicate.push({
                    data: row,
                    error: ["Data already exists in Database"]
                });
            }
            else{
                finalValid.push(row)
            }
        }

        return res.status(201).json({
            finalValid,
            duplicate,
            dbDuplicate,
            invalid,
            summary: {
                total: records.length,
                valid: finalValid.length,
                duplicate: duplicate.length + dbDuplicate.length,
                invalid: invalid.length
            }
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

function isCsvRow(row: any): row is CsvRows {
    return(
        typeof row.date === "string" &&
        typeof row.name === "string" &&
        typeof row.amount === "number" &&
        typeof row.category === "string"
    );
}


export const commitCSV = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const business_id = req.params.businessID;
        const user = req.user?.uid;
        const { rows } = req.body;

        const categories = await pool.query(`SELECT uid, name FROM transaction_category WHERE business_id = $1`, [business_id]);

        const categoryMap = new Map();
        categories.rows.forEach(c => {
            categoryMap.set(c.name.toLowerCase(), c.uid);
        });

        for(const row of rows){
            const key = row.category_name.trim().toLowerCase();

            if(!categoryMap.has(key)){
                const newCategory = await pool.query<TransactionCategory>(`
                    INSERT INTO transaction_category (business_id, name)
                    VALUES ($1, $2)
                    RETURNING *`, 
                    [business_id, row.category_name.trim()]
                );
                categoryMap.set(key, newCategory.rows[0]?.uid);
            }
        }

        for(const row of rows){
            const category_id = categoryMap.get(row.category_name.toLowerCase());

            const newTransaction = await pool.query<Transaction>(`
                INSERT INTO transactions (
                business_id, name, date, description, type, category, amount, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
                [business_id, row.name, row.date, row.description, row.type, category_id, row.amount, user]
            );

            if(!newTransaction.rows[0]){
                console.log(newTransaction);
                return res.status(500).json({ message: "Server Error" });
            }
        }
        return res.status(200).json({ message: "Successful Import" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}
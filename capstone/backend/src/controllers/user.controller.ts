import { Request, Response } from "express"
import admin from "../config/firebase"
import pool from "../config/db"

export const user = async(req: Request, res: Response) => {
    try{
        if(!req.user){
            return res.status(401).json({ message: "Unauthorized" })
        }
        const uid = req.user.uid;

        const result = await pool.query(
            `SELECT firebase_uid, first_name, last_name
            FROM users
            WHERE firebase_uid = $1`,
            [uid]
        );

        if (result.rows.length === 0){
            return res.status(404).json({ message: "User not found" })
        }


        return res.status(200).json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

//authenticates token and creates new user in db
export const signup = async(req: Request, res: Response) => {
    try{
        const { idToken, username, firstName, lastName } = req.body;

        if(!idToken || !username || !firstName || !lastName ){
            return res.status(401).json({ message: "Unauthorized Content" })
        }
        const decodedIdToken = await admin.auth().verifyIdToken(idToken)
        const uid = decodedIdToken.uid

        try{
            const query = `INSERT INTO users (firebase_uid, username, first_name, last_name)
            VALUES($1, $2, $3, $4)
            RETURNING *;`;
            const values = [uid, username, firstName, lastName];

            const result = await pool.query(query, values);

            if(!result.rows[0]){
                return res.status(500).json({ message: "Database Error" })
            }
            
            return res.status(201).json({
                message: "User created successfully"
            });
        }catch(error){
            console.log(error)
            return res.status(500).json({ message: "Server Error" });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }

}

export const checkUsername = async(req: Request, res: Response) => {
    try{
        const { username } = req.query;

        const result = await pool.query(
            `SELECT username FROM users WHERE username = $1`, [username]);

        if(!result.rows[0]){
            return res.status(200).json({ message: "Username not taken" });
        }
        return res.status(400).json({ message: "Username taken" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}
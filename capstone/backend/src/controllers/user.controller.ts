import { Request, Response } from "express"
import admin from "../config/firebase"
import pool from "../config/db"

//authenticates token and creates session cookie
export const login = async(req: Request, res: Response) => {
    const idToken = req.body;

    const expiresIn = 60 * 60 *1000;

    try{
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedIdToken.uid;

        const result = await pool.query("SELECT * FROM users WHERE firebase_uid = $1", [uid]);
        let user = result.rows[0];

        if(!user){
            return res.status(401).json({ message: "Unknown user" });
        }

        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

        res.cookie("session", sessionCookie, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: expiresIn,
        });

        res.json(user);
    }catch(error){
        console.log(error);
        return res.status(401).json({ message: "Server Error" });
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

            res.status(201).json({
                message: "User created successfully"
            });
        }catch(error){
            console.log(error)
            return res.status(401).json({ message: "Server Error" });
        }
    }catch(error){
        console.log(error);
        return res.status(401).json({ message: "Server Error" });
    }

}


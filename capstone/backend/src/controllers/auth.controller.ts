import { Request, Response } from "express"
import admin from "../config/firebase"
import pool from "../config/db";

//authenticates token and creates session cookie
export const login = async(req: Request, res: Response) => {
    const { token } = req.body;
    if(!token){
        return res.status(400).json({ message: "No Token Provided" });
    }

    try{
        const decodedIdToken = await admin.auth().verifyIdToken(token);
        const uid = decodedIdToken.uid;

        if(!uid){
            return res.status(400).json({ message: "User not found" })
        }

        const result = await pool.query(`SELECT * FROM users WHERE firebase_uid = $1`, [uid]);

        if(!result.rows[0]){
            return res.status(400).json({ message: "User not found" })
        }

        //1 hour expiration 
        const expiresIn = 60 * 60 *1000;

        const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

        res.cookie("session", sessionCookie, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: expiresIn,
        });

        return res.status(200).json({ message: "Session Cookie Created" });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

//logout function
export const logout = async(req: Request, res: Response) => {
    res.clearCookie("session");
    res.json({ status: "logged out" })
};


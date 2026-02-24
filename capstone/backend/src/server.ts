import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db"
import admin from "./config/firebase"
import { Auth } from "firebase-admin/lib/auth/auth";
import { Message } from "protobufjs";

const app = express();
app.use(cors());
app.use(express.json());


//may need to move for future api calls
interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}
const verifyToken = async(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message : "Unauthorized" })
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Unauthorized" })
    }
    
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken
        next();
    }catch(error){
        res.status(401).json({ message: "Invalid token" })
    }
}

app.get("/api/users/user", verifyToken, async(req: AuthenticatedRequest, res: Response) => {
    try{
        if(!req.user){
            res.status(401).json({ message: "Unauthorized" })
        }
        
        const uid = req.user;

        const result = await pool.query("SELECT * FROM users WHERE uid = $1", [uid]);
        let user = result.rows[1];

        if(!user){
            res.status(401).json({ message: "Unknown user" });
        }

        res.json(user);
    }catch(error){
        console.log(error);
        res.status(401).json({ message: "Server Error" })
    }
})


app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})

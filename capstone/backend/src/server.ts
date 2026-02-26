import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db"
import admin from "./config/firebase"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//may need to move for future api calls
interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}
const verifyToken = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message : "Unauthorized Token" })
    }

    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Unauthorized Token" })
    }

    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid token" })
    }
}

app.get("/api/users/user", verifyToken, async(req: AuthenticatedRequest, res: Response) => {
    try{
        if(!req.user){
           return  res.status(401).json({ message: "Unauthorized User" })
        }

        const uid = req.user.uid;

        const result = await pool.query("SELECT * FROM users WHERE firebase_uid = $1", [uid]);
        let user = result.rows[0];

        if(!user){
            return res.status(401).json({ message: "Unknown user" });
        }

        res.json(user);
    }catch(error){
        console.log(error);
        return res.status(401).json({ message: "Server Error" });
    }
})

app.post("/api/users/signup", verifyToken, async(req: AuthenticatedRequest, res: Response) => {
    try{
        const { username, firstName, lastName } = req.body;

        if(!username || !firstName || !lastName || !req.user){
            return res.status(401).json({ message: "Unauthorized Content" })
        }

        const firebaseID = req.user.uid;

        try{
            const query = `INSERT INTO users (firebase_uid, username, first_name, last_name)
            VALUES($1, $2, $3, $4)
            RETURNING *;`;
            const values = [firebaseID, username, firstName, lastName];

            const result = await pool.query(query, values);

            res.status(201).json({
                message: "User created successfully",
                user: result.rows[0]
            });
        }catch(error){
            console.log(error)
            return res.status(401).json({ message: "Server Error" });
        }
    }catch(error){
        console.log(error);
        return res.status(401).json({ message: "Server Error" });
    }
})


app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})

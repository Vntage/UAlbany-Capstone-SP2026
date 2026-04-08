import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase"

//used to authenticate requests
declare global{
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
            businessMember?: {
                uid: string;
                business_id: string;
                user_id: string;
                role: string;
                joined_at: string;
            };
        }
    }
}

export const verifySession = async(req: Request, res: Response, next: NextFunction) => {
    const sessionCookie = req.cookies?.session
    if(!sessionCookie){
        return res.status(401).json({ message : "No Session" })
    }

    try{
        const decode = await admin.auth().verifySessionCookie(sessionCookie);
        req.user = decode;
        next();
    }catch(error){
        res.status(401).json({ message: "Invalid Session" });
        return;
    }
}

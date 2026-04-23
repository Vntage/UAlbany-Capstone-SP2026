import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase"
import { BusinessMember } from "../types/business.type";



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
        console.log(error)
        res.status(401).json({ message: "Invalid Session" });
        return;
    }
}

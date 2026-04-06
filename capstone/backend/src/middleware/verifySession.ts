import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase"

//used to authenticate requests
export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export interface BusinessParams {
    businessID: string;
}

export const verifySession = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const sessionCookie = req.cookies?.session
    if(!sessionCookie){
        return res.status(401).json({ message : "No Session" })
    }

    try{
        const decode = await admin.auth().verifySessionCookie(sessionCookie);
        req.user = decode;
        next();
    }catch(error){
        return res.status(401).json({ message: "Invalid Session" })
    }
}

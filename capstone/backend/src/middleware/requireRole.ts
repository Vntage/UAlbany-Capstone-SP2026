import { Request, Response, NextFunction } from "express"

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.businessMember){
            res.status(403).json({ message: "No Membership" });
            return;
        }
        if(!roles.includes(req.businessMember.role)){
            res.status(403).json({ message: "No Permission" });
            return;
        }

        next();
    };
}
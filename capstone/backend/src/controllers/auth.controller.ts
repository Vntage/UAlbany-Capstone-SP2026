import { Request, Response } from "express"

//logout function
export const logout = async(req: Request, res: Response) => {
    res.clearCookie("session");
    res.json({ status: "logged out" })
};


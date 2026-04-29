import { Request, Response } from "express"
import pool from "../config/db"
import { Business, BusinessInvite, BusinessMember } from "../types/business.type";
import { BusinessParams, InviteParams } from "../types/common.type";

export const getBusiness = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;

    const business = await pool.query<Business>(`SELECT * FROM business WHERE uid = $1`, [business_id]);

    if(!business.rows.length){
        return res.status(401).json({ message: "Business not found" });
    }

    return res.status(201).json(business.rows[0])
}

export const getUserBusinesses = async(req: Request, res: Response) => {
    const uid = req.user?.uid
    
    const business = await pool.query(`
        SELECT b.uid, b.name
        FROM business_member bm
        JOIN business b ON bm.business_id = b.uid
        WHERE bm.user_id = $1
        AND bm.role <> 'disabled'
        `, [uid]);

    if(!business.rows[0]){
        return res.status(401).json({ message: "Businesses not found" });
    }
    return res.status(201).json(business.rows)
}

export const createBusiness = async(req: Request, res: Response) => {
    try{
        let { name, type, currency, date_month, date_year } = req.body
        const uid = req.user?.uid;
        if(!name || !type || !currency){
            return res.status(400).json({ message: "Missing fields" })
        }

        if(!date_month || !date_year ){
            const date = new Date();
            date_month = date.getMonth() + 1
            date_year = date.getFullYear()
        }

        const businessResult = await pool.query<Business>(`INSERT INTO business
            (name, business_type, currency, created_month, created_year)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
            [name, type, currency, date_month , date_year]);
        
        const business = businessResult.rows[0];

        if(!business){
            return res.status(500).json({ message: "Database Error" });
        }

        const memberResult = await pool.query(`INSERT INTO business_member 
            (business_id, user_id, role)
            VALUES($1, $2, 'owner') RETURNING *;`,
            [business!.uid, uid]);

        if(!memberResult.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }
        
        return res.status(201).json({ message: "Successfully created business" })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

export const getBusinessMember = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;

    const business_memberResult = await pool.query(
        `SELECT 
        bm.role,   
        u.username,
        u.first_name,
        u.last_name
        FROM business_member bm
        JOIN users u ON bm.user_id = u.firebase_uid
        WHERE business_id = $1`, 
        [business_id]
    );

    if(!business_memberResult.rows.length){
        res.status(500).json({ message: "Server Error" })
    }

    res.status(201).json(business_memberResult.rows)
}

export const createBusinessMember = async(req: Request<BusinessParams>, res: Response) => {
    const business_id = req.params.businessID;
    const role = req.body
    const user_id = req.user?.uid

    if(!business_id || !role || user_id){
        return res.status(400).json({ message: "Missing fields" })
    }

    try{
        const business_memberResult = await pool.query<BusinessMember>(`INSERT INTO business_members (business_id, user_id, role)
            VALUES($1, $2, $3) RETURNING *`, 
            [business_id, user_id, role])
        
        res.status(201).json({ message: "Successfully create business member" })
    }
    catch(error: any){
        if(error.code === "23505"){
            return res.status(409).json({ message: "User is already member" })
        }
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

export const updateRole = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        const { user, role } = req.body;

        if(!user || role !== "admin" || role !== "member" || role !== "disabled"){
            return res.status(400).json({ message: "Missing Fields" });
        }
        const result = await pool.query(`
            UPDATE business_member
            SET role = $1,
            WHERE business_id = $2 
            AND user_id = $3
            RETURNING *
            `, [role, businessID, user]);
        
        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(200).json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const getRole = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;
        const user = req.user?.uid;

        const result = await pool.query(`SELECT role FROM business_member WHERE business_id = $1 and user_id = $2`, [businessID, user]);

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

//create invitation for users to join business
export const createBusinessInvite = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const business_id = req.params.businessID;
        const { username, role = "member", expiresAt } = req.body;
        const invitedBy = req.user?.uid;

        const member = req.businessMember;

        if(!member){
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(member.role !== "owner"){
            return res.status(403).json({ message: "Unauthorized" })
        }

        const user = await pool.query(`SELECT firebase_uid FROM users WHERE username = $1`, [username]);

        if(!user.rows[0]) return res.status(400).json({ message: "User not found" });

        const userID = user.rows[0].firebase_uid;

        const result = await pool.query(`
            INSERT INTO business_invite (business_id, user_id, invited_by, role, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [business_id, userID, invitedBy, role, expiresAt || null]
        );

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        return res.status(201).json({ message: "Created Successfully" });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getUserInvite = async(req: Request, res: Response) => {
    try{
        const user = req.user?.uid;

        const result = await pool.query(`
            SELECT 
            b.name,
            bi.uid,
            bi.role,
            bi.status,
            bi.expires_at
            FROM business_invite bi
            JOIN business b ON bi.business_id = b.uid
            WHERE user_id = $1
            AND bi.status <> 'declined'
            `, [user]);
            
        return res.status(200).json(result.rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

//allow user to see if anyone invited them to join their business
export const getBusinessInvite = async(req: Request<BusinessParams>, res: Response) => {
    try{
        const businessID = req.params.businessID;

        const result = await pool.query(`
            SELECT 
            u.username,
            bi.uid,
            bi.role,
            bi.status,
            bi.expires_at
            FROM business_invite bi
            JOIN users u ON bi.user_id = u.firebase_uid
            WHERE business_id = $1 
            ORDER BY bi.status, bi.created_at DESC`, 
            [businessID]);

        return res.status(200).json(result.rows)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

//accept or decline business invite
export const updateBusinessInvite = async(req: Request<InviteParams>, res: Response) => {
    const inviteID = req.params.inviteID;
    const { status } = req.body;

    if(!inviteID || status !== "accepted" || status !== "declined" || status !== "canceled"){
        return res.status(400).json({ message: "Unacceptable Field" });
    }

    try{
        if(status == "declined" || status == "canceled"){
            const result = await pool.query(`
                UPDATE business_invite 
                SET status = $1
                WHERE uid = $2
                RETURNING *
                `, [status, inviteID]);

            if(!result.rows[0]){
                return res.status(500).json({ message: "Database Error" });
            }
            return res.status(200).json(result.rows[0]);
        }

        const invResult = await pool.query<BusinessInvite>(`SELECT * from business_invite WHERE uid = $1`, [inviteID]);

        if(!invResult.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        const invite = invResult.rows[0];
        
        if(invite.expires_at && new Date(invite.expires_at) < new Date()){
            return res.status(400).json({ message: "Invite Expired" })
        }

        if(invite.status !== "sent"){
            return res.status(400).json({ message: `Invite already ${invite.status}` })
        }

        const result = await pool.query(`
            UPDATE business_invite 
            SET status = $1
            WHERE uid = $2
            RETURNING *
            `, [status, inviteID]);

        if(!result.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }

        const newMember = await pool.query<BusinessMember>(`INSERT INTO business_members (business_id, user_id, role)
            VALUES($1, $2, $3) RETURNING *`, 
            [invite.business_id, invite.user_id, invite.role]);

        if(!newMember.rows[0]){
            return res.status(500).json({ message: "Database Error" });
        }
        
        return res.status(200).json(newMember.rows[0]);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}
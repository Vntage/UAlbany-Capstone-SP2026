import admin from "../config/firebase";
import { BusinessMember } from "./business.type";

export type Timestamp = string;
export type UUID = string;

declare global{
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
            businessMember?: BusinessMember;
        }
    }
}

export type CsvRows = {
    date: string,
    name: string,
    amount: number,
    category: string,
    description?: string,
}

export type BusinessParams = {
    businessID: string
}
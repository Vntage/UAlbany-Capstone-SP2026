import { Timestamp, UUID } from "./common.type";

export type Business = {
    uid: UUID;
    name: string;
    created_month?: number;
    created_year?: number;
    business_type: string;
    currency: string;
    status: "active" | "inactive" | "archived";
}

export type BusinessMember = {
    uid: UUID;
    business_id: UUID;
    user_id: UUID;
    role: "owner" | "admin" | "member" | "disabled";
    joined_at: Timestamp;
}
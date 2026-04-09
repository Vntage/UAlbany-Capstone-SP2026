import { Timestamp, UUID } from "./common.type";

export type Business = {
    uid: UUID;
    name: string;
    createdMonth?: number;
    createdYear?: number;
    type: string;
    currency: string;
    status: "active" | "inactive" | "archived";
}

export type BusinessMember = {
    uid: UUID;
    business_id: UUID;
    user_id: UUID;
    role: "owner" | "admin" | "member";
    joined_at: Timestamp;
}
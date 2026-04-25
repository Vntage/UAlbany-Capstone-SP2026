import { Timestamp, UUID } from "./common.type";

type InviteRole = "admin" | "member";
type InviteStatus = "sent" | "accepted" | "declined" | "canceled";

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

export type BusinessInvite = {
    uid: UUID;
    business_id: UUID;
    user_id: UUID;
    role: InviteRole;
    status: InviteStatus;
    invited_by: UUID;
    created_at: Timestamp;
    expires_at: Timestamp;
}


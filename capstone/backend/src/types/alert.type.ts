import { UUID, Timestamp } from "./common.type";

export type AlertSeverity = "low" | "medium" | "high";

export type Alert = {
    uid: UUID;
    title: string;
    message: string;
    severity: AlertSeverity;
    alert_rule_id: UUID;
    triggered_at: Timestamp;
};

export type AlertRecipient = {
    uid: UUID;
    alert_id: UUID;
    user_id: UUID;
    read_at?: Timestamp | null;
    created_at: Timestamp;
};

export type AlertRule = {
    uid: UUID;
    business_id: UUID;
    condition: string;
    type: string;
    is_active: boolean;
    created_by: string;
};
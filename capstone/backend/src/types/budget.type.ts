import { Timestamp, UUID } from "./common.type"


export type Budget = {
    uid: UUID;
    business_id: UUID;
    name: string;
    period_start: string;
    period_end: string;
    created_at: Timestamp;
    created_by: string;
}

export type BudgetedItem = {
    uid: UUID;
    business_id: UUID;
    category_id: UUID;
    allocated_amount: number;
    created_by: string;
    created_at: Timestamp;
    updated_by: string;
    updated_at: Timestamp;
}
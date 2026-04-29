import { UUID, Timestamp } from "./common.type";

export type TransactionType = "expense" | "income";

export type Transaction = {
    uid: UUID;
    business_id: UUID;
    name: string;
    date: string;
    description?: string;
    type?: TransactionType;
    category_id: UUID;
    amount: number;
    created_at: Timestamp;
    created_by: string;
    updated_at?: Timestamp;
    updated_by?: string;
}

export type TransactionLog = {
    uid: UUID;
    transaction_id: UUID;
    business_id: UUID;
    name: string;
    date: string;
    description?: string;
    type?: TransactionType;
    category_id: UUID;
    amount: number;
    edited_at: Timestamp;
    edited_by: string;
}

export type TransactionCategory = {
    uid: UUID;
    business_id: UUID;
    name: string;
}
import { UUID, Timestamp } from "./common.type";

export type AlertSeverity = "low" | "medium" | "high";

type Operator =  "<" | "<=" | ">" | ">=" | "=" ;    

export type Expression = 
    | {
        type: "value"; 
        value: number;
    }
    | {
        type: "metric"; 
        field: "transaction_total";
    }
    | {type: "budget_total"}
    | {
        type: "category_total"; 
        category_id: UUID;
    }
    | {
        type: "budget_item_allocated";
        category_id: UUID;
    }
    | {
        type: "expression";
        operator: "*" | "/" | "+" | "-";
        left: Expression;
        right: Expression;
    };

export type AlertCondition = {
    left: Expression;
    operator: Operator;
    right: Expression;
};

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
    title: string;
    condition: AlertCondition;
    type: "threshold" | "comparison";
    is_active: boolean;
    created_by: UUID;
};

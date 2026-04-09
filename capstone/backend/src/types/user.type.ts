import { Timestamp } from "./common.type";

export type User = {
    firebase_uid: string;
    username: string;
    first_name: string;
    last_name: string;
    created_at: Timestamp;
}
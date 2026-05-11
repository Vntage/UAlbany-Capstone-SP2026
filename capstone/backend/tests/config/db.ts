import { Pool } from "pg";

export const testDbConfig = {
    host: process.env.TEST_DB_HOST || "localhost",
    port: 6543,
    user: process.env.TEST_USER || "test_user",
    password: process.env.TEST_DB_PASSWORD || "test_pass",
    database: process.env.TEST_DB_NAME || "test_db"
}

export const pool = new Pool(
    process.env.NODE_ENV === "test"
    ? testDbConfig
    : {
        host: "localhost",
        port: 5432,
        user: "dev_user",
        password: "dev_password",
        database: "dev_db"
    }
)
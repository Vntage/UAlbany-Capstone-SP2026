import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isTesting = process.env.NODE_ENV === "test";

const pool = new Pool(
    isTesting ?
    {
        host: process.env.TEST_DB_HOST || "localhost",
        port: 6543,
        user: process.env.TEST_USER || "test_user",
        password: process.env.TEST_DB_PASSWORD || "test_pass",
        database: process.env.TEST_DB_NAME || "test_db" 
    }
    : {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port: Number(process.env.PG_PORT)
    }
);

export default pool;
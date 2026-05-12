import pool from "../../src/config/db";
import { initDB } from "../../src/config/dbInit";

export async function setupTestDB() {
    await pool.query("SELECT 1");

    await initDB(pool);

    console.log("Test DB initialized");
}

export async function teardownTestDB(){
    await pool.end();
}
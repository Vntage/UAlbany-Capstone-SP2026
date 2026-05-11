import { pool } from "./db";
import { initDB } from "../../src/config/dbInit";

export async function setupTestDB() {
    await pool.query("SELECT 1");

    await initDB();

    console.log("Test DB initialized");
}

export async function teardownTestDB(){
    await pool.end();
}
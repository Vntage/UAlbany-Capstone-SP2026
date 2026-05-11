import { setupTestDB } from "./bootstrap-db";

export default async function () {
    await setupTestDB();
    console.log("Global test DB initialized");
}
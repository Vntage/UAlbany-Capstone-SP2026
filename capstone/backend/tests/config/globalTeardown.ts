import { teardownTestDB } from "./bootstrap-db";

export default async function () {
    await teardownTestDB();
}
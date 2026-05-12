import pool from "../src/config/db";
import { checkUsername } from "../src/controllers/user.controller";

describe("check Username", () => {
    let req: any;
    let res: any;

    beforeEach(async() => {
        await pool.query(`DELETE FROM users`);

        req = { query: {} };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("returns 200 if username not taken", async() => {
        req.query.username = "newuser";

        await checkUsername(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Username not taken" });
    });

    it("returns 400 if username taken", async() => {
        await pool.query(`
            INSERT INTO users (firebase_uid, username, first_name, last_name)
            VALUES ('uid-1', 'existinguser', 'test', 'user')
        `);

        req.query.username = "existinguser";

        await checkUsername(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Username taken" });
    })

    it("returns 500 on DB failure", async () => {
        const originalQuery = pool.query;

        pool.query = () => {
            throw new Error("DB Error");
        };

        req.query.username = "testuser";

        await checkUsername(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        pool.query = originalQuery;
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM users`);
        await pool.end();
    });
});
const mockVerify = jest.fn();
jest.mock("firebase-admin", () => {
    const authMock = {
        verifyIdToken: mockVerify
    };
    return{
        apps: [],
        auth: jest.fn(() => authMock),
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn()
        }
    }
});

import pool from "../src/config/db";
import admin from "../src/config/firebase";
import { user, checkUsername, signup } from "../src/controllers/user.controller";



describe("checkUsername", () => {
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

        jest.spyOn(pool, "query" as any).mockRejectedValue(new Error("DB Error"));

        req.query.username = "testuser";

        await checkUsername(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        pool.query = originalQuery;
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM users`);
    });
});


describe("user", () => {
    let req: any;
    let res: any;

    beforeEach(async() => {
        await pool.query(`DELETE FROM users`);

        req = { user: undefined };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("returns 401 if no user in req", async() => {
        await user(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("returns 404 if user not found", async() => {
        req.user = { uid: "missing-uid" };
    
        await user(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("returns 200 if user found", async() => {
        await pool.query(`
            INSERT INTO users (firebase_uid, username, first_name, last_name)
            VALUES('test-uid', 'test-username', 'test-first_name', 'test-last_name')
        `);

        req.user = { uid: "test-uid" };

        await user(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            firebase_uid: "test-uid",
            first_name: "test-first_name",
            last_name: "test-last_name"
        });
    });

    afterAll(async() => {
        await pool.query(`DELETE FROM users`);
    })
})

describe("signup", () => {
    let req: any;
    let res: any;

    beforeEach(async() => {
        await pool.query(`DELETE FROM users`);

        req = { body: {} };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("returns 401 if missing fields", async() => {
        req.body = {
            idToken: "",
            username: "",
            firstName: "",
            lastName: ""
        };

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized Content" });
    });

    it("returns 201 user successfully created", async() => {
        mockVerify.mockResolvedValue({ uid: "firebase-123" });

        req.body = {
            idToken: "test-token",
            username: "test-user",
            firstName: "test-first_name",
            lastName: "test-last_name"
        }

        await signup(req, res);

        const dbRes = await pool.query(`SELECT * FROM users WHERE firebase_uid = $1`, ["firebase-123"]);

        expect(dbRes.rows.length).toBe(1);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
    });

    it("returns 500 if DB fails", async() => {
        mockVerify.mockResolvedValue({ uid: "firebase-123" });

        const spy = jest.spyOn(pool, "query").mockRejectedValue(new Error("DB Error") as never);

        req.body = {
            idToken: "test-token",
            username: "test-user",
            firstName: "test-first_name",
            lastName: "test-last_name"
        }

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
        
        spy.mockRestore();
    })

    afterAll(async() => {
        await pool.query(`DELETE FROM users`);
        await pool.end();
    })
})
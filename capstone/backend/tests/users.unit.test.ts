import pool from "../src/config/db";

//testing test setup
describe("Users table", () => {
    beforeAll(async() => {
        await pool.query(`
            INSERT INTO users (firebase_uid, username, first_name, last_name)
            VALUES('test-uid', 'test-username', 'test-first_name', 'test-last_name')
            `);
    });

    afterAll(async() => {
        await pool.query(`DELETE FROM users`);
        await pool.end();
    })

    it("Testing user insert", async() => {
        const result = await pool.query(`
            SELECT * FROM users WHERE firebase_uid = $1`,
            ["test-uid"]
        );

        expect(result.rows.length).toBe(1);
        expect(result.rows[0].firebase_uid).toBe("test-uid")
        expect(result.rows[0].username).toBe("test-username");
        expect(result.rows[0].first_name).toBe("test-first_name");
        expect(result.rows[0].last_name).toBe("test-last_name")
    })
})
import pool from "./db";

export async function initDB() {
    try{
        //uuid generation
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        //user schema
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
            firebase_uid VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );`)
        
        //business schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS business (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            created_month INT CHECK (created_month BETWEEN 1 AND 12),
            created_year INT CHECK (created_year >= 1900),
            business_type TEXT,
            currency VARCHAR(10),
            status TEXT
            );`)
        
        //enum for business member
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_role') THEN
                    CREATE TYPE business_role AS ENUM ('owner', 'admin', 'member', 'disabled');
                END IF;
            END$$
        `);
        
        //business member schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS business_member (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            user_id VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            role business_role,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)

        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invite_status') THEN
                    CREATE TYPE invite_status AS ENUM ('sent', 'accepted', 'declined', 'canceled');
                END IF;
            END$$
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS business_invite (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            user_id VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            role business_role,
            status invite_status NOT NULL DEFAULT 'sent',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            CONSTRAINT business_invite_role_check
                CHECK(role IN ('admin', 'member'))
            );`)

        //transaction category schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transaction_category (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            name TEXT NOT NULL
            );`)

        //transaction schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            name TEXT NOT NULL,
            date DATE NOT NULL,
            description TEXT,
            type TEXT CHECK (type IN ('expense', 'income')),
            category_id UUID REFERENCES transaction_category(uid),
            amount NUMERIC(12,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) REFERENCES public.users(firebase_uid),
            updated_at TIMESTAMP,
            updated_by VARCHAR(255) REFERENCES public.users(firebase_uid)
            );`)

        //transaction log schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transaction_log (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            transaction_id UUID REFERENCES transactions(uid) ON DELETE CASCADE,
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            name TEXT,
            date DATE,
            description TEXT,
            type TEXT CHECK (type IN ('expense', 'income')),
            category_id UUID,
            amount NUMERIC(12,2),
            edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            edited_by VARCHAR(255) REFERENCES public.users(firebase_uid)
            );`)
        
        //budget schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS budget (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            name TEXT NOT NULL,
            period_start DATE NOT NULL,
            period_end DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE
            );`)

        //budget item schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS budget_item (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            budget_id UUID REFERENCES budget(uid) ON DELETE CASCADE,
            category_id UUID REFERENCES transaction_category(uid),
            allocated_amount NUMERIC(12,2) NOT NULL,
            created_by VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_by VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            updated_at TIMESTAMP
            );`)

        //alert enums
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
                    CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_rule_type') THEN
                    CREATE TYPE alert_rule_type AS ENUM ('threshold', 'comparison');
                END IF;
            END$$
            `)
        
        //alert rules
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alert_rule(
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            business_id UUID REFERENCES business(uid) ON DELETE CASCADE,
            title TEXT NOT NULL,
            condition JSONB NOT NULL,
            type alert_rule_type NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_by VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)
        
        //alert schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alert (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            severity alert_severity NOT NULL,
            alert_rule_id UUID REFERENCES alert_rule(uid) ON DELETE CASCADE,
            triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)

        //alert recipient schema
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alert_recipient (
            uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            alert_id UUID REFERENCES alert(uid) ON DELETE CASCADE,
            user_id VARCHAR(255) REFERENCES public.users(firebase_uid) ON DELETE CASCADE,
            read_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)

        console.log("Successfully initiated db tables")
    }
    catch(error){
        console.log(error)
    }
}
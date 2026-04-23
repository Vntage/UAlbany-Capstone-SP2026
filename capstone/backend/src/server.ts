import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/router"
import { initDB } from "./config/dbInit";
import pool from "./config/db";
import authenticateToken from "./middleware/authenticateToken";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//cookie setup
app.use(cors({
    origin: process.env.CLIENT || "http://localhost:5173"   ,
    credentials: true
}));

//api calls
app.use("/api", router)

initDB(); //generate missing tables
//connect to SQL database afterwards
pool.connect().then(() => console.log("Connected to SQL database"))
.catch((err) => console.error("Database connection error: ", err))

//server setup
app.listen(process.env.PORT || 8080, () =>{
    console.log(`Server running on ${process.env.PORT || 8080}`)
})

app.get("/api/dashboard_data", authenticateToken, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in dashboard_data request!" });
    }   
    const uid = req.user.uid;

    //you only get data from the user you are logged in as
    try {
    const businesses = await pool.query(
      `SELECT b.uid, b.name, b.currency, b.status
       FROM business_member bm
       JOIN business b ON bm.business_id = b.uid
       WHERE bm.user_id = $1`,
      [uid]
    );

    const businessIds = businesses.rows.map((b) => b.uid);

    const metrics = await pool.query(
        `SELECT 
            -- Current Month Metrics
            SUM(CASE WHEN t.type = 'income' AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE) THEN t.amount ELSE 0 END) AS current_revenue,
            SUM(CASE WHEN t.type = 'expense' AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE) THEN t.amount ELSE 0 END) AS current_expenses,
      
            -- Previous Month Metrics
            SUM(CASE WHEN t.type = 'income' AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN t.amount ELSE 0 END) AS prev_revenue,
            SUM(CASE WHEN t.type = 'expense' AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN t.amount ELSE 0 END) AS prev_expenses
        FROM transactions t
        WHERE t.business_id = ANY($1::uuid[])
        AND t.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`, 
        [businessIds]
    );

    //monthly revenue vs expenses trend
    const monthlyTrend = await pool.query(
      `SELECT 
          EXTRACT(MONTH FROM date) AS month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS revenue,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expenses
       FROM transactions
       WHERE business_id = ANY($1::uuid[])
       GROUP BY month
       ORDER BY month`,
      [businessIds]
    );

    const revenueByCategory = await pool.query(
      `SELECT tc.name AS category, SUM(t.amount) AS value
       FROM transactions t
       JOIN transaction_category tc ON t.category_id = tc.uid
       WHERE t.business_id = ANY($1::uuid[]) AND t.type='income'
       GROUP BY tc.name`,
      [businessIds]
    );

    //recent alerts
    const alerts = await pool.query(
      `SELECT a.uid, a.type, a.description, b.name AS business_name, a.created_at
       FROM alert a
       JOIN business b ON a.business_id = b.uid
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT 10`,
      [uid]
    );

    res.json({
      businesses: businesses.rows,
      metrics: metrics.rows[0],
      monthlyTrend: monthlyTrend.rows,
      revenueByCategory: revenueByCategory.rows,
      alerts: alerts.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error fetching dashboard data");
  }
})
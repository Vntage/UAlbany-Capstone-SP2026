import {Request, Response} from "express";
import pool from "../config/db";
import { BusinessParams } from "../types/common.type";

export const getDashboardData = async (req: Request<BusinessParams>, res: Response) => { //get it all in one request
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in dashboard_data request!" });
    }   
    const uid = req.user?.uid;
    const businessID = req.params.businessID; //narrow search compared to before

    //you only get data from the user you are logged in as
    try {
    const businesses = await pool.query( //probably deprecated
      `SELECT b.uid, b.name, b.currency, b.status
       FROM business_member bm
       JOIN business b ON bm.business_id = b.uid
       WHERE bm.user_id = $1 AND b.uid = $2`,
      [uid, businessID]
    );
    if (businesses.rows.length === 0) {
        return res.status(500).json({ message: "Unable to retrieve business data for the specified business." });
    }
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
        WHERE t.business_id = $1
        AND t.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`, 
        [businessID]
    );
    if (metrics.rows.length === 0) {
        return res.status(500).json({ message: "Unable to retrieve business metrics for the specified business." });
    }

    //monthly revenue vs expenses trend
    const monthlyTrend = await pool.query(
      `SELECT 
          EXTRACT(MONTH FROM date) AS month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS revenue,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expenses
       FROM transactions
       WHERE business_id = $1
       GROUP BY month
       ORDER BY month`,
      [businessID]
    );
    if (monthlyTrend.rows.length === 0) {
        return res.status(500).json({ message: "Unable to retrieve monthly trend data for the specified business." });
    }

    const revenueByCategory = await pool.query(
      `SELECT tc.name AS category, SUM(t.amount) AS value
       FROM transactions t
       JOIN transaction_category tc ON t.category_id = tc.uid
       WHERE t.business_id = $1 AND t.type='income'
       GROUP BY tc.name`,
      [businessID]
    );
    if (revenueByCategory.rows.length === 0) {
        return res.status(500).json({ message: "Unable to retrieve revenue by category data for the specified business." });
    }

    //recent alerts
    const alerts = await pool.query(
      `SELECT a.uid, a.type, a.description, b.name AS business_name, a.created_at
       FROM alert a
       JOIN business b ON a.business_id = b.uid
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT 10`,
      [uid]
    ); //no alerts, no problem

    res.status(200).json({
      businesses: businesses.rows,
      metrics: metrics.rows[0],
      monthlyTrend: monthlyTrend.rows,
      revenueByCategory: revenueByCategory.rows,
      alerts: alerts.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
}
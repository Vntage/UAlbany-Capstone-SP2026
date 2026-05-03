import { Request, Response } from "express";
import pool from "../config/db";
import { BusinessParams } from "../types/common.type";

export const getMetrics = async (req: Request<BusinessParams>, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found in dashboard data request!" });
  }
  const uid = req.user?.uid;
  const businessID = req.params.businessID;
  //you only get data from this business

  try {
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

    res.status(200).json(metrics.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
}

export const getMonthlyTrend = async (req: Request<BusinessParams>, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found in monthly trend request!" });
  }
  const uid = req.user?.uid;
  const businessID = req.params.businessID;
  //you only get data from this business

  try {

    //monthly revenue vs expenses trend
    const monthlyTrend = await pool.query(
      `SELECT 
          EXTRACT(YEAR FROM date) AS year,
          EXTRACT(MONTH FROM date) AS month,
          SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS revenue,
          SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expenses
       FROM transactions
       WHERE business_id = $1
       GROUP BY year, month
       ORDER BY year ASC, month ASC`,
      [businessID]
    );
    if (monthlyTrend.rows.length === 0) {
      return res.status(500).json({ message: "Unable to retrieve monthly trend data for the specified business." });
    }

    res.status(200).json(monthlyTrend.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching monthly trend data" });
  }
}

export const getRevenueByCategory = async (req: Request<BusinessParams>, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found in revenue by category request!" });
  }
  const uid = req.user?.uid;
  const businessID = req.params.businessID;
  //you only get data from this business
  
  try {
    const revenueByCategory = await pool.query(
      `SELECT tc.name AS category, SUM(t.amount) AS value
       FROM transactions t
       JOIN transaction_category tc ON t.category_id = tc.uid
       WHERE t.business_id = $1 AND t.type='income'
       AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY tc.name`,
      [businessID]
    );
    if (revenueByCategory.rows.length === 0) {
      return res.status(500).json({ message: "Unable to retrieve revenue by category data for the specified business." });
    }

    res.status(200).json(revenueByCategory.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching revenue by category data" });
  }
}
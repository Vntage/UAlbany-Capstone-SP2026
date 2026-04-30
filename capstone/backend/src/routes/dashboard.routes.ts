import express from "express"
import { getAlertSnapshot, getMetrics, getMonthlyTrend, getRevenueByCategory } from "../controllers/dashboard.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/metrics/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getMetrics);
router.get("/monthly-trend/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getMonthlyTrend);
router.get("/revenue-by-category/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getRevenueByCategory);
router.get("/alert-snapshot/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getAlertSnapshot);

export default router;
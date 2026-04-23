import express from "express"
import { getDashboardData } from "../controllers/dashboard.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getDashboardData);

export default router;
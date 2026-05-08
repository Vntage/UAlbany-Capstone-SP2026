import express from "express"
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";
import { previewReport, exportReport } from "../controllers/reports.controller";

const router = express.Router();

router.post("/:businessID/preview", verifySession, verifyMember, requireRole(['owner', 'admin']), previewReport);
router.post("/:businessID/export", verifySession, verifyMember, requireRole(['owner', 'admin']), exportReport);


export default router;
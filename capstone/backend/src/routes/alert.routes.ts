import express from "express"
import { getAlert, toggleRule, updateSeen, getRule, createRule } from "../controllers/alert.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getAlert);
router.get("/:businessID/rules", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getRule);

router.patch("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), updateSeen);
router.patch("/:businessID/rule", verifySession, verifyMember, requireRole(['owner', 'admin']), toggleRule);

router.post("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin']), createRule);

export default router;
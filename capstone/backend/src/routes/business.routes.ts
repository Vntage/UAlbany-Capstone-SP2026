import  express  from "express";
import { getBusiness, getUserBusinesses, getBusinessMember, createBusiness, updateRole, getRole, createBusinessInvite, getBusinessInvite, updateBusinessInvite, getUserInvite } from "../controllers/business.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.post("/", verifySession, createBusiness);
router.post("/:businessID/invite", verifySession, verifyMember, requireRole(['owner']), createBusinessInvite);

router.patch("/:businessID/role", verifySession, verifyMember, requireRole(['owner']), updateRole);
router.patch("/:inviteID", verifySession, updateBusinessInvite);

router.get("/", verifySession, getUserBusinesses);
router.get('/invite', verifySession, getUserInvite);

router.get("/:businessID/invite", verifySession, verifyMember, requireRole(['owner']), getBusinessInvite);
router.get("/:businessID/member", verifySession, verifyMember, requireRole(['owner']), getBusinessMember);

router.get("/:businessID", verifySession, verifyMember, getBusiness);
router.get("/:businessID/role", verifySession, verifyMember, getRole);

export default router;
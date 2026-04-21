import  express  from "express";
import { getBusiness, getUserBusinesses, getBusinessMember, createBusiness, createBusinessMember } from "../controllers/business.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.post("/business", verifySession, createBusiness);
router.post("/:businessID/member", verifySession, verifyMember, requireRole(['owner', 'admin']), createBusinessMember)

//create update role 
router.patch("/:businessID/role", verifySession, verifyMember, requireRole(['owner']))

router.get("/:businessID", verifySession, verifyMember, getBusiness)
router.get("/business", verifySession, getUserBusinesses)
router.get("/:businessID/member", verifySession, verifyMember, requireRole(['owner', 'admin']), getBusinessMember)

//create get role
router.get("/:businessID/role", verifySession, verifyMember)

export default router;
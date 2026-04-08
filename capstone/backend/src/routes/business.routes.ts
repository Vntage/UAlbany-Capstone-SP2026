import  express  from "express";
import { getBusiness, getUserBusinesses, getBusinessMember, createBusiness, createBusinessMember } from "../controllers/business.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";

const router = express.Router();

router.post("/business", verifySession, createBusiness);
router.post("/:businessID/member", verifySession, createBusinessMember)

router.get("/:businessID", verifySession, verifyMember, getBusiness)
router.get("/business", verifySession, getUserBusinesses)
router.get("/:businessID/member", verifySession, verifyMember, getBusinessMember)

export default router;
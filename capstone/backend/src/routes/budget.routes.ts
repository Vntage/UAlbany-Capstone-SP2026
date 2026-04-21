import express from "express"
import { getBudget, getBudgetedItem, newBudget, newBudgetedItem } from "../controllers/budget.controller"
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";


const router = express.Router();

router.post("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin']), newBudget);
router.post("/:businessID/item", verifySession, verifyMember, requireRole(['owner', 'admin']), newBudgetedItem);

router.get("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getBudget);
router.get("/:businessID/item", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getBudgetedItem);


export default router;
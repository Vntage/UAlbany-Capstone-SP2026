import express from "express"
import { getBudget, getBudgetedItem, newBudget, newBudgetedItem } from "../controllers/budget.controller"
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";


const router = express.Router();

router.post("/:businessID", verifySession, verifyMember, newBudget);
router.post("/:businessID/item", verifySession, verifyMember, newBudgetedItem);

router.get("/:businessID", verifySession, verifyMember, getBudget);
router.get("/:businessID/item", verifySession, verifyMember, getBudgetedItem);


export default router;
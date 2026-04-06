import express from "express"
import { getBudget, getBudgetedItem, newBudget, newBudgetedItem } from "../controllers/budget.controller"
import { verifySession } from "../middleware/verifySession";


const router = express.Router();

router.post("/:businessID", verifySession, newBudget);
router.post("/:businessID/Item", verifySession, newBudgetedItem)

router.get("/:businessID", verifySession, getBudget);
router.get("/:businessID/item", verifySession, getBudgetedItem)


export default router;
import express from "express"
import { getTransaction, getTransactionCategory, createTransaction, createTransactionCategory } from "../controllers/transaction.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getTransaction);
router.get("/:businessID/category", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getTransactionCategory);

router.post("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), createTransaction);
router.post("/:businessID/category", verifySession, verifyMember, requireRole(['owner', 'admin']), createTransactionCategory);

export default router;
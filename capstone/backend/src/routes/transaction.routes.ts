import express from "express"
import { getTransaction, getTransactionCategory, createTransaction, createTransactionCategory } from "../controllers/transaction.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";

const router = express.Router();

router.get("/:businessID", verifySession, verifyMember,getTransaction);
router.get("/:businessID/category", verifySession, verifyMember, getTransactionCategory);

router.post("/:businessID", verifySession, verifyMember, createTransaction);
router.post("/:businessID/category", verifySession, verifyMember, createTransactionCategory);

export default router;
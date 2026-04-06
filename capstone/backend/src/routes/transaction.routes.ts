import express from "express"
import { getTransaction, getTransactionCategory, createTransaction, createTransactionCategory } from "../controllers/transaction.controller";
import { verifySession } from "../middleware/verifySession";

const router = express.Router();

router.get("/:businessID", verifySession, getTransaction);
router.get("/:businessID/category", verifySession, getTransactionCategory);

router.post("/:businessID", verifySession, createTransaction);
router.post("/:businessID/category", verifySession, createTransactionCategory);

export default router;
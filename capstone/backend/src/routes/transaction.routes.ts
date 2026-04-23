import express from "express";
import multer from "multer";
import { getTransaction, getTransactionCategory, createTransaction, createTransactionCategory, validatedCSV, commitCSV } from "../controllers/transaction.controller";
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();
const upload = multer({ dest: "uploads/" })

router.get("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getTransaction);
router.get("/:businessID/category", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), getTransactionCategory);

router.post("/:businessID", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), createTransaction);
router.post("/:businessID/category", verifySession, verifyMember, requireRole(['owner', 'admin']), createTransactionCategory);

router.post("/:businessID/csv/validate", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), upload.single("file"), validatedCSV);
router.post("/:businessID/csv/commit", verifySession, verifyMember, requireRole(['owner', 'admin', 'member']), commitCSV);

export default router;
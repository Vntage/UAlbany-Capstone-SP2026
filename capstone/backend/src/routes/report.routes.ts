import express from "express"
import { verifySession } from "../middleware/verifySession";
import { verifyMember } from "../middleware/verifyMember";
import { requireRole } from "../middleware/requireRole";
import { getBalanceSheet, getCashFlow, getCategoryBreakdown, getExpenseReport, getIncomeStatement } from "../controllers/reports.controller";

const router = express.Router();

router.get("/:businessID/income", verifySession, verifyMember, requireRole(['owner']), getIncomeStatement);
router.get("/:businessID/expense", verifySession, verifyMember, requireRole(['owner']), getExpenseReport);
router.get("/:businessID/cashflow", verifySession, verifyMember, requireRole(['owner']), getCashFlow);
router.get("/:businessID/categorybreakdown", verifySession, verifyMember, requireRole(['owner']), getCategoryBreakdown);

//balance sheet not implemented yet
//router.get("/:businessID/balancesheet", verifySession, verifyMember, requireRole(['owner']), getBalanceSheet);



export default router;
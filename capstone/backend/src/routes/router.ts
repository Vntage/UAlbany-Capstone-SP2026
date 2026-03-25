import Router from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import businessRoutes from "./business.routes"
import transactionRoutes from "./transaction.routes"
import alertRoutes from "./alert.routes"
import budgetRoutes from "./budget.routes"
import reportRoutes from "./report.routes"

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/business", businessRoutes)
router.use("/transaction", transactionRoutes)
router.use("/alert", alertRoutes)
router.use("/budget", budgetRoutes)
router.use("/report", reportRoutes)

export default router;
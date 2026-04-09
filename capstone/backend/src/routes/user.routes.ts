import  express  from "express"
import { user, signup } from "../controllers/user.controller"
import { verifySession } from "../middleware/verifySession"

const router = express.Router();

router.post("/signup", signup);

router.get("/user", verifySession, user);

export default router;
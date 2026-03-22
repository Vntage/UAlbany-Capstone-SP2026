import  express  from "express"
import { login, signup } from "../controllers/user.controller"

const router = express.Router();

router.post("/signup", signup);

router.get("/login", login);

export default router;
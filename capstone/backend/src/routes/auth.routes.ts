import express from "express"
import { login, logout, refreshSession } from "../controllers/auth.controller"
import { checkUsername } from "../controllers/user.controller";
import { verifySession } from "../middleware/verifySession";

const router = express.Router();

router.post("/logout", logout);

router.post("/login", login);

router.post("/refreshsession", verifySession, refreshSession);

router.get("/username", checkUsername);

export default router;
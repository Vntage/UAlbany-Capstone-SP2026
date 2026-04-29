import express from "express"
import { login, logout } from "../controllers/auth.controller"
import { checkUsername } from "../controllers/user.controller";

const router = express.Router();

router.post("/logout", logout);

router.post("/login", login);

router.get("/username", checkUsername);

export default router;
import express from "express"
import { logout } from "../controllers/auth.controller"

const router = express.Router();

router.post("/logout", logout);

export default router;
import { Router } from "express";
import { login, logout, register } from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";

const router = Router()


router.post("/register",register)

router.post("/login", login)

router.post("/logout", authenticate, logout)


export default router
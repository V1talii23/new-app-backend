import { Router } from "express";
import {
  login,
  logout,
  register,
  requestResetEmail,
  resetPassword,
} from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";
import validate from "../middleware/validateInput.js";
import { requestResetEmailSchema, resetPasswordSchema } from "../validations/authValidations.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.post(
  "/request-reset-email",
  validate(requestResetEmailSchema),
  requestResetEmail,
);

router.post("/reset-password", validate(resetPasswordSchema), resetPassword)

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  changePassword,
} from "../controllers/user.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", auth, changePassword);

export default router;

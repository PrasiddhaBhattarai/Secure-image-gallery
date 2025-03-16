import express from "express";
import { registerUser, loginUser, changePassword, logoutUser } from "../controllers/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

// all routes 
router.post("/register", registerUser);

router.post("/login", loginUser);

// logout route
router.post("/logout", logoutUser);

// user should be logged-in to change password
// logged-in, checked by authMiddleware
router.post("/change-password", authMiddleware, changePassword);

export default router;
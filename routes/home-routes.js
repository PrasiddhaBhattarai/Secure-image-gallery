import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
    const {username, userId, role, email, createdAt} = req.userInfo;

    res.json({
        success : true,
        message : "Welcome to the home page",
        user:{
            _id : userId,
            username,
            role,
            email,
            createdAt
        }
    });
});

export default router;
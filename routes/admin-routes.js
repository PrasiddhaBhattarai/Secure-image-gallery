import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { isAdminUser } from "../middleware/admin-middleware.js";

const router = express.Router();

// there are two middlewares used here,
// since these two middlewares are used for every routes in this program, you can also use it as global middleware :-
// app.use(adminRoutes)
// app.use(isAdminUser)
// router.get("/welcome", (req, res) ...);

router.get("/welcome", authMiddleware, isAdminUser, (req, res) => {
    res.json({
        success : true,
        message : 'welcome to the admin page'
    });
});

export default router;
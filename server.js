import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import { connectToDatabase, closeConnectionToDB } from "./database/db.js";
import authRoutes from "./routes/auth-routes.js";
import homeRoutes from "./routes/home-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import imageRoutes from "./routes/image-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

// Frontend routes
app.get("/", (req, res) => {
    res.render("index", { 
        title: "Home",
        customJS: "index"
    });
});

app.get("/login", (req, res) => {
    res.render("login", { 
        title: "Login",
        customJS: "login"
    });
});

app.get("/register", (req, res) => {
    res.render("register", { 
        title: "Register",
        customJS: "register"
    });
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard", { 
        title: "Dashboard",
        customJS: "dashboard"
    });
});

app.get("/admin", (req, res) => {
    res.render("admin", { 
        title: "Admin Dashboard",
        customJS: "admin"
    });
});

app.get("/change-password", (req, res) => {
    res.render("change-password", { 
        title: "Change Password",
        customJS: "change-password"
    });
});

app.get("/upload", (req, res) => {
    res.render("upload", { 
        title: "Upload Image",
        customJS: "upload"
    });
});

//db connection
connectToDatabase();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
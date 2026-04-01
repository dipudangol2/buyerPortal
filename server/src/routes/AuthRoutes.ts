import { Router } from "express";
import { login, signup, logout, getCurrentUser } from "../controllers/AuthController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const authRoutes: Router = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/me", verifyToken, getCurrentUser);
authRoutes.post("/logout", logout);

export default authRoutes;
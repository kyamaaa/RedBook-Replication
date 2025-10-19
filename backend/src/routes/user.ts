import express from "express";
import { getCurrentUser } from "../controllers/userController";
import { authenticateToken } from "../middleware/authAvatar";

const router = express.Router();

router.get("/current", authenticateToken, getCurrentUser);

export default router;

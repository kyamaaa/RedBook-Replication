import express from "express";
import { login, logout, getCaptcha } from "../controllers/authController";

const router = express.Router();

// 获取验证码
router.get("/captcha", getCaptcha);

// 用户登录
router.post("/login", login);

// 用户登出
router.post("/logout", logout);

export default router;

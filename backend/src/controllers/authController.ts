import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 模拟用户数据（实际项目中应该使用数据库）
const mockUsers = [
  {
    id: 1,
    username: "18218162327",
    name: "测试用户",
  },
];

// 存储验证码（实际项目中应该使用Redis）
const captchaStore = new Map<string, { code: string; expiresAt: number }>();

// 生成随机验证码
const generateCaptcha = (): string => {
  return "123456";
};

export const getCaptcha = (req: Request, res: Response) => {
  try {
    const captchaKey = Math.random().toString(36).substring(2);
    const captchaCode = generateCaptcha();

    // 存储验证码，5分钟有效
    captchaStore.set(captchaKey, {
      code: captchaCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // 清理过期验证码
    for (const [key, value] of captchaStore.entries()) {
      if (value.expiresAt < Date.now()) {
        captchaStore.delete(key);
      }
    }

    res.json({
      code: 0,
      message: "成功",
      data: {
        captchaKey,
        captchaCode, // 实际项目中应该通过短信发送，这里返回用于测试
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "获取验证码失败",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("收到的Token:", req.headers.authorization);
  try {
    console.log("收到的登录参数：", req.body);
    const { username, captcha, captchaKey } = req.body;

    // 验证参数
    if (!username) {
      return res.status(400).json({
        code: 400,
        message: "缺用户名",
      });
    }
    if (!captcha) {
      return res.status(400).json({
        code: 400,
        message: "缺少验证码",
      });
    }
    if (!captchaKey) {
      return res.status(400).json({
        code: 400,
        message: "缺少验证码密钥（captchaKey）",
      });
    }

    // 验证验证码
    const captchaData = captchaStore.get(captchaKey);
    if (!captchaData || captchaData.expiresAt < Date.now()) {
      return res.status(400).json({
        code: 400,
        message: "验证码已过期或无效",
      });
    }

    if (captchaData.code !== captcha.toUpperCase()) {
      return res.status(400).json({
        code: 400,
        message: "验证码错误",
      });
    }

    // 验证用户
    const user = mockUsers.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "用户不存在",
      });
    }

    // // 验证密码（实际项目中应该使用bcrypt比较）
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({
    //     code: 401,
    //     message: "密码错误",
    //   });
    // }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // 清除已使用的验证码
    captchaStore.delete(captchaKey);

    res.json({
      code: 0,
      message: "登录成功",
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      code: 500,
      message: "登录失败",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  // 在实际项目中，这里可以处理token黑名单等
  res.json({
    code: 0,
    message: "登出成功",
  });
};

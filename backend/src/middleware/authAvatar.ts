import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 扩展 Express 的 Request 接口，添加 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

interface JwtPayload {
  userId: number;
  username: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("收到请求，请求方法:", req.method);
  console.log("请求头信息:", req.headers);

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("提取到的authHeader:", authHeader);
  console.log("提取到的token:", token);

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "访问令牌缺失",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback-secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          code: 403,
          message: "访问令牌无效",
        });
      }

      // 将解析出的用户信息附加到请求对象上
      req.user = decoded as JwtPayload;
      console.log("token验证成功，解析的用户信息:", req.user);
      next();
    }
  );
};

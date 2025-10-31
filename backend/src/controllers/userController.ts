import { Request, Response, NextFunction } from "express";
import { BaseUserInfo, CurrentUserAvatar, UserAvatarInfo } from "../types";

const mockUsers: BaseUserInfo[] = [
  {
    id: 1,
    username: "18218162327",
    name: "测试用户",
  },
];

// 模拟头像数据
const mockAvatarInfo: UserAvatarInfo[] = [
  {
    userId: 1,
    avatarUrl: "https://picsum.photos/id/64/200/200",
  },
];

/**
 * 获取当前登录用户信息
 * 实际项目中应该通过token验证用户身份
 * 这里简化处理，直接返回第一个用户
 */
export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 添加禁止缓存的头部
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    console.log("Received request headers:", req.headers);
    console.log("Received request user:", req.user);
    // 在实际应用中，应该通过解析请求中的token来获取当前用户ID
    // 这里为了简化，直接返回模拟数据中的第一个用户
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        code: 401,
        message: "用户未认证",
      });
    }

    const user = mockUsers.find((u) => u.id === currentUserId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "用户不存在",
      });
    }

    const avatarInfo = mockAvatarInfo.find((a) => a.userId === currentUserId);

    // 构建符合 CurrentUserAvatar 接口的响应
    const response = {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarInfo: avatarInfo,
    };

    res.json({
      code: 0,
      message: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

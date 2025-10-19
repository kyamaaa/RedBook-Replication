import request from "../utils/request";
import { CurrentUserAvatar } from "../types/user";

/**
 * 获取当前登录用户信息，加载用户的个人信息
 */
export const fetchCurrentUser = async (): Promise<CurrentUserAvatar> => {
  console.log("调用fetchCurrentUser时的请求实例:", request);
  const response = await request.get("user/current");
  console.log("fetchCurrentUser响应:", response);
  return response.data;
};

/**
 * 更新用户信息
 * 不加入 updateUserInfo 的内容先
 */

/**
 * 更新用户头像
 * 不加入 updateUserAvatar 的内容先
 */

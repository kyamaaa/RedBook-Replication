import request from "../utils/request";

// 定义接口返回类型
export interface CaptchaResponse {
  code: number;
  message: string;
  data: {
    captchaKey: string;
    captchaCode: string; // 若后端返回图片，这里改为captchaUrl: string
  };
}

// 定义登录请求参数类型
export interface LoginParams {
  username: string;
  captcha: string;
  captchaKey: string;
}

// 定义登录响应类型
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    // 可以根据实际情况添加其他字段
  };
}

/**
 * 获取验证码
 */
export const fetchCaptcha = async (): Promise<CaptchaResponse> => {
  return await request.get("/auth/captcha");
};

/**
 * 用户登录
 * @param params 登录参数
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  return await request.post("/auth/login", params);
};

/**
 * 退出登录
 */
export const logout = async (): Promise<{
  code: number;
  message: string;
}> => {
  return await request.post("/auth/logout");
};

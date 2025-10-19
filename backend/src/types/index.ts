export interface LoginParams {
  username: string; // 手机号
  captcha: string;
  captchaKey: string;
}

export interface BaseUserInfo {
  id: number;
  name: string; // 昵称
  username: string; // 手机号
}

export interface UserAvatarInfo {
  userId: number;
  avatarUrl?: string;
}

export interface CurrentUserAvatar {
  id: number;
  avatarInfo?: UserAvatarInfo;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface CaptchaData {
  captchaKey: string;
  captchaCode: string;
}

// 登录响应数据
export interface LoginResponseData {
  token: string;
  userInfo: BaseUserInfo;
}

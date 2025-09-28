export interface LoginParams {
  username: string;
  captcha: string;
  captchaKey: string;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  avatar?: string;
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

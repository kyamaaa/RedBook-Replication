// 定义用户信息接口
// 和后端一致哟

// 好吧现在UserInfo承载了登录的Response（logInfo）和用户信息（userInfo）两个领域的类型定义额！
export interface BaseUserInfo {
  id: number;
  name: string; // 昵称
  username: string; // 手机号
}

// 登录后返回的数据结构
export interface LoginResponseData {
  token: string;
  userInfo: BaseUserInfo;
}

// 头像信息接口
export interface UserAvatarInfo {
  userId: number;
  avatarUrl?: string;
}

// 当前用户响应
export interface CurrentUserAvatar {
  id: number;
  avatarInfo?: UserAvatarInfo;
}

// 完整的用户信息
export interface CompleteUserInfo extends BaseUserInfo {
  avatarInfo?: UserAvatarInfo;
}

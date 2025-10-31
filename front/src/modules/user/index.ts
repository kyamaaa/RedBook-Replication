import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  login,
  logout,
  fetchCaptcha,
  LoginParams,
  LoginResponse,
  CaptchaResponse,
} from "../../services/login";
import { fetchCurrentUser } from "../../services/user";

import { BaseUserInfo, CompleteUserInfo } from "../../types/user";

// 本地存储的键名
const TOKEN_STORAGE_KEY = "user_auth_token";

// 定义用户状态接口
interface UserState {
  // 状态数据
  token: string | null;
  userInfo: CompleteUserInfo | null;

  // 验证码相关状态
  captchaKey: string;
  captchaCode: string; //若后端返回图片则存url

  // 辅助状态
  isLoading: boolean;
  error: string | null;

  // 状态操作方法
  setCaptchaInfo: (key: string, code: string) => void; //设置验证码信息
  clearCaptcha: () => void; //清除验证码信息
  setUserInfo: (token: string, userInfo: BaseUserInfo) => void; // 设置用户信息
  logout: () => void; //退出登录（含清除状态）

  // 服务调用方法 异步：封装服务层， 组件无需直接调用API
  fetchCaptchaAction: () => Promise<void>; //获取验证码
  loginAction: (params: LoginParams) => Promise<void>; //登录
  logoutAction: () => Promise<void>; //后端登出
  fetchCurrentUserAction: () => Promise<void>; //获取当前用户信息
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        token: null,
        userInfo: null,
        captchaKey: "",
        captchaCode: "",
        isLoading: false,
        error: null,

        // 5. 基础状态操作（纯同步）
        setCaptchaInfo: (key, code) =>
          set({ captchaKey: key, captchaCode: code }),
        clearCaptcha: () => set({ captchaKey: "", captchaCode: "" }),
        setUserInfo: (token, userInfo) => {
          const completeUserInfo: CompleteUserInfo = {
            ...userInfo,
            avatarInfo: undefined, // 初始时未获取到头像信息
          };
          set({ token, userInfo: completeUserInfo });
        },
        // 6. 退出登录（同步清除状态，如需后端登出则调用logoutAction）
        logout: () =>
          set({ token: null, userInfo: null, captchaKey: "", captchaCode: "" }),

        // 7. 封装服务层：获取验证码（异步，带加载/错误处理）
        fetchCaptchaAction: async () => {
          set({ isLoading: true, error: null }); // 开始加载，清空之前的错误
          try {
            const res: CaptchaResponse = await fetchCaptcha(); // 调用服务层
            // 存储验证码Key和Code（res已被request拦截器处理，直接是成功数据）
            set({
              captchaKey: res.data.captchaKey,
              captchaCode: res.data.captchaCode,
            });
          } catch (err: any) {
            // 捕获服务层/request层的错误，存入状态
            set({ error: err.message || "获取验证码失败" });
            throw err; // 抛给组件，让组件可做额外处理（如弹窗）
          } finally {
            set({ isLoading: false }); // 结束加载
          }
        },

        // 8. 封装服务层：登录（异步，带加载/错误处理）
        loginAction: async (params: LoginParams) => {
          set({ isLoading: true, error: null });

          try {
            // 1. 登录验证接口
            const res: LoginResponse = await login(params);
            console.log("✅ 后端登录验证通过，返回token：", res.data.token);
            const { token, userInfo: baseUserInfo } = res.data;

            // 2. 先设置token和基础用户信息
            const completeUserInfo: CompleteUserInfo = {
              ...baseUserInfo,
              avatarInfo: undefined, // 头像信息暂为空
            };
            set({ token, userInfo: completeUserInfo });

            try {
              // 2. 获取头像接口（独立的try-catch）
              await get().fetchCurrentUserAction();
            } catch (userInfoErr: any) {
              console.error(
                "❌ 登录成功但获取用户信息失败：",
                userInfoErr.message
              );
              // 可以选择只记录错误，不抛出，因为登录本身成功了
              // 或者抛出特定错误让组件处理
              throw new Error("登录成功，但获取用户信息失败，请刷新页面重试");
            }
          } catch (err: any) {
            const errorMessage = err?.message || "登录失败";
            set({ error: errorMessage });
            console.error("❌ 登录流程失败：", errorMessage);
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },

        // 9. 封装服务层：后端登出（如需通知后端销毁token）
        logoutAction: async () => {
          try {
            await logout(); // 调用服务层的后端登出接口
          } catch (err: any) {
            console.error("后端登出失败：", err.message);
          } finally {
            get().logout(); // 无论后端是否成功，都清除前端状态
          }
        },

        // 获取当前用户信息，且验证一下哈
        fetchCurrentUserAction: async () => {
          console.log("开始调用 fetchCurrentUserAction");
          const { token, userInfo } = get();
          console.log("当前store中的token:", token);
          if (!token) {
            const error = new Error("无效的token，无法获取用户信息");
            console.error("❌ 获取用户信息失败 - 无效token:", error.message);
            throw error;
          }

          set({ isLoading: true, error: null });
          try {
            console.log("进入到获取头像逻辑");
            const currentUserData = await fetchCurrentUser();
            console.log("✅ 成功拉取用户信息：", {
              id: currentUserData.id,
              name: currentUserData.name,
              username: currentUserData.username,
              avatarUrl: currentUserData.avatarInfo?.avatarUrl,
            });

            // 关键修复：使用后端返回的完整用户信息更新 store
            const updatedUserInfo: CompleteUserInfo = {
              id: currentUserData.id,
              name: currentUserData.name,
              username: currentUserData.username,
              avatarInfo: currentUserData.avatarInfo,
            };
            set({ userInfo: updatedUserInfo });
            console.log("✅ 已更新 store 中的 userInfo", updatedUserInfo);
          } catch (err: any) {
            // 添加更详细的错误日志，特别针对获取用户头像/信息的错误
            console.error("❌ 获取用户信息失败 - 请求错误:", {
              message: err.message || "未知错误",
              stack: err.stack,
              response: err.response || "无响应数据",
            });

            set({ error: err.message || "获取用户信息失败" });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        // persist配置：持久化存储token和Info（避免刷新丢失）
        name: "user-auth-storage", // 本地存储的key
        partialize: (state) => ({
          token: state.token,
          userInfo: state.userInfo,
        }), // 只持久化token和userInfo，验证码无需持久化
      }
    )
  )
);

export default useUserStore;

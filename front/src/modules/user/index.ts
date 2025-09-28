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
import exp from "constants";

// 本地存储的键名
const TOKEN_STORAGE_KEY = "user_auth_token";

// 定义用户状态接口
interface UserState {
  // 状态数据
  token: string | null;
  userInfo: { id: number; name: string } | null;

  // 验证码相关状态
  captchaKey: string;
  captchaCode: string; //若后端返回图片则存url

  // 辅助状态
  isLoading: boolean;
  error: string | null;

  // 状态操作方法
  setCaptchaInfo: (key: string, code: string) => void; //设置验证码信息
  clearCaptcha: () => void; //清除验证码信息
  setUserInfo: (token: string, userInfo: { id: number; name: string }) => void; // 设置用户信息
  logout: () => void; //退出登录（含清除状态）

  // 服务调用方法 异步：封装服务层， 组件无需直接调用API
  fetchCaptchaAction: () => Promise<void>; //获取验证码
  loginAction: (params: LoginParams) => Promise<void>; //登录
  logoutAction: () => Promise<void>; //后端登出
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
        setUserInfo: (token, userInfo) => set({ token, userInfo }),

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
          set({ isLoading: true, error: null }); // 开始加载
          try {
            const res: LoginResponse = await login(params); // 调用服务层
            // 登录成功：存储token（res.data含token，后端可能返回userInfo，这里假设token需后续拉取）
            set({ token: res.data.token });
            // 若后端登录接口直接返回userInfo，可在此处调用setUserInfo
            // 示例：setUserInfo(res.data.token, res.data.userInfo);
          } catch (err: any) {
            set({ error: err.message || "登录失败" });
            throw err; // 抛给组件
          } finally {
            set({ isLoading: false }); // 结束加载
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
      }),
      {
        // persist配置：持久化存储token和userInfo（避免刷新丢失）
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

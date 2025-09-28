// 工具层 统一管理http请求

import axios from "axios";
import proxy from "../configs/host";
import useUserStore from "../modules/user"; // 用于获取token

// 获得api主机地址，已测
const env = process.env.NODE_ENV || "development";
const API_HOST = proxy[env].API;
console.log("当前API_HOST:", API_HOST);

// 状态码
const SUCCESS_CODE = 0;
const TIMEOUT = 5000;

// 配置实例
export const instance = axios.create({
  baseURL: API_HOST, // 设置基础URL
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true, // 允许跨域请求携带Cookie（与登录态管理相关）
});

//修改：把localStorage改成pinia

// 请求拦截器：自动加token到请求头
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore.getState();
    if (userStore.token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${userStore.token}`;
      console.log("请求头中添加的token:", config.headers["Authorization"]);
    } else {
      console.log("未获取到token，请求头中不添加Authorization");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 拦截器
instance.interceptors.response.use(
  (response) => {
    // 处理成功响应
    const { data } = response;
    console.log("传递的数据", data);
    if (data.code === SUCCESS_CODE) {
      return data;
    }
    return Promise.reject(data); // 业务逻辑失败
  },
  (error) => {
    // 处理网络错误、401/403等状态码
    let errorMsg = "网络错误，请稍后重试";
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // 未登录/Token过期：清空状态并跳转登录（需配合路由）
        const userStore = useUserStore.getState();
        userStore.logout();
        errorMsg = "登录已过期，请重新登录";
        // 这里可加路由跳转，如：window.location.href = "/login"
      } else if (status === 403) {
        errorMsg = "没有权限访问";
      } else if (status === 500) {
        errorMsg = "服务器内部错误";
      }
    }
    return Promise.reject(new Error(errorMsg));
  }
);

export default instance;

// 暴露instance到全局
window.instance = instance;

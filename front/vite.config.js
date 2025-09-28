import path from "path";
import { loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import react from "@vitejs/plugin-react";
import svgr from "@honkhonk/vite-plugin-svgr";

const CWD = process.cwd();

// 传递 环境上下文 params
export default (params) => {
  // mode：当前环境模式，参考host.ts  执行vite dev/vite build/vite dev -- mode test 来切换运行环境
  const { mode } = params;
  // .env.development、.env.production
  const { VITE_BASE_URL } = loadEnv(mode, CWD);

  return {
    base: VITE_BASE_URL,
    server: {
      // 正常被启用应该是可以通过 http://localhost:3003/recommend 访问页面
      port: 3003,
      proxy: {
        //  fetch('/api/user' -- .tencentcs.com/api/user --
        "/api": {
          // 真实的后端接口部署的服务器地址
          target: "http://localhost:3001",
          // 转发请求时会修改 HTTP 头中的 Host 字段为 target 的域名，
          // 让后端服务器认为请求来自自身域名，避免因跨域被拒绝。
          changeOrgin: true,
        },
      },
    },
  };
};

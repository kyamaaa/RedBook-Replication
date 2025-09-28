// 环境类型定义

import { AxiosInstance } from "axios";

// 扩展了全局的 ImportMeta 接口
declare interface ImportMeta {
  env: {
    MODE: "development" | "test" | "production";
  };
}

declare global {
  interface Window {
    instance?: AxiosInstance;
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 扫描所有 src 目录下的组件文件，确保 Tailwind 能识别类名
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  // 主题配置：只放颜色、字体、间距等基础主题扩展
  theme: {
    extend: {
      colors: {
        red: "#ff2442",
        red1: "#fb8e9d",
        gray: "#f5f5f5",
        gray1: "#5c5c5c",
        gray2: "#e6e6e6",
        gray3: "#bbbbbb",
        gray4: "#858585",
        black: "#333333",
      },
      spacing: {
        500: "50rem",
        300: "30rem",
      },
    },
  },

  // 关键：自定义工具类必须通过 plugins 中的 addUtilities 注册
  plugins: [
    function ({ addUtilities }) {
      // 添加「隐藏滚动条但保留滚动功能」的工具类
      addUtilities({
        ".scrollbar-hide": {
          // Chrome/Safari/Edge/Opera：隐藏滚动条本体、轨道、滑块
          "&::-webkit-scrollbar": { display: "none" },
          "&::-webkit-scrollbar-track": { display: "none" },
          "&::-webkit-scrollbar-thumb": { display: "none" },
          // Firefox：隐藏滚动条
          "scrollbar-width": "none",
          // IE/Edge：隐藏滚动条
          "-ms-overflow-style": "none",
        },
      });
    },
  ],
};

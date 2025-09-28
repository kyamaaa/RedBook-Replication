import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home";
import More from "./components/More";
import Buttom from "./components/Buttom";
import AppRouter from "./router";

const App: React.FC = () => {
  // 跟踪屏幕宽度是否大于等于960px
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 960);

  useEffect(() => {
    // 处理窗口大小变化
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 960);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        {/* 1024px及以上显示Sidebar和More */}
        {isLargeScreen && (
          <div className="flex-col h-[calc(100vh-135px)] w-64 pl-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <Sidebar />
            <More />
          </div>
        )}

        {/* 所有屏幕尺寸都显示Home */}
        <main className="flex h-[calc(100vh-60px)] overflow-y-auto">
          <AppRouter />
          {/* 1024px以下显示Bottom组件 */}
          {!isLargeScreen && <Buttom />}
        </main>
      </div>
    </div>
  );
};

export default App;

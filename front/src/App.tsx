import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home";
import More from "./components/More";
import Buttom from "./components/Buttom";
import AppRouter from "./router";

const App: React.FC = () => {
  // 跟踪屏幕宽度是否大于等于960px
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 960);

  // 引用左侧和右侧容器
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 处理窗口大小变化
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 960);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 处理滚轮事件的联动逻辑
  useEffect(() => {
    if (!isLargeScreen) return;

    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      const leftSide = leftSideRef.current;
      const rightSide = rightSideRef.current;

      if (!leftSide || !rightSide) return;

      // 检查鼠标是否悬停在左侧容器上
      const isHoverOnLeft = leftSide.contains(wheelEvent.target as Node);
      // 检查鼠标是否悬停在右侧容器上
      const isHoverOnRight = rightSide.contains(wheelEvent.target as Node);

      // 检查左侧是否有可滚动内容
      const leftHasScroll = leftSide.scrollHeight > leftSide.clientHeight;

      // 检查左侧是否已经滚动到底部（增加5px容差，提高灵敏度）
      const isLeftAtBottom =
        leftSide.scrollHeight - leftSide.scrollTop <= leftSide.clientHeight + 5;

      // 检查左侧是否在顶部（增加5px容差）
      const isLeftAtTop = leftSide.scrollTop <= 5;

      // 检查右侧是否在顶部（增加5px容差）
      const isRightAtTop = rightSide.scrollTop <= 5;

      // 如果鼠标在左侧容器上
      if (isHoverOnLeft) {
        // 向下滚动
        if (wheelEvent.deltaY > 0) {
          // 如果左侧未到底部，不做任何处理，让浏览器默认滚动
          if (leftHasScroll && !isLeftAtBottom) {
            // 不阻止默认行为，让 Sidebar 自然滚动
            return;
          }
          // 如果左侧已到底部，滚动右侧
          else {
            wheelEvent.preventDefault();
            rightSide.scrollTop += wheelEvent.deltaY;
          }
        }
        // 向上滚动
        else if (wheelEvent.deltaY < 0) {
          // 如果左侧未到顶部，不做任何处理，让浏览器默认滚动
          if (leftHasScroll && !isLeftAtTop) {
            return;
          }
          // 如果左侧到顶部但右侧未到顶，滚动右侧
          else if (!isRightAtTop) {
            wheelEvent.preventDefault();
            rightSide.scrollTop += wheelEvent.deltaY;
          }
        }
      }
      // 如果鼠标在右侧容器上
      else if (isHoverOnRight) {
        // 向下滚动 - 直接让右侧滚动
        if (wheelEvent.deltaY > 0) {
          // 不阻止，让右侧自然滚动
          return;
        }
        // 向上滚动
        else if (wheelEvent.deltaY < 0) {
          // 如果右侧未到顶，让右侧自然滚动
          if (!isRightAtTop) {
            return;
          }
          // 如果右侧到顶且左侧有滚动内容且未到顶，滚动左侧
          else if (leftHasScroll && !isLeftAtTop) {
            wheelEvent.preventDefault();
            leftSide.scrollTop += wheelEvent.deltaY;
          }
        }
      }
    };

    const container = document.querySelector('.main-container');
    container?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container?.removeEventListener('wheel', handleWheel);
    };
  }, [isLargeScreen]);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden items-center">
        <div className="w-full flex justify-center">
          <Navbar />
        </div>

        <div className="flex flex-1 w-full max-w-7xl mx-auto main-container">
          {/* 1024px及以上显示Sidebar和More */}
          {isLargeScreen && (
            <div
              ref={leftSideRef}
              className="flex-col h-[calc(100vh-135px)] w-64 pl-3 overflow-y-scroll overflow-x-hidden scrollbar-hide"
            >
              <Sidebar />
              <More />
            </div>
          )}

          {/* 所有屏幕尺寸都显示Home */}
          <main
            ref={rightSideRef}
            className="flex h-[calc(100vh-60px)] flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide"
          >
            <AppRouter />
            {/* 1024px以下显示Bottom组件 */}
            {!isLargeScreen && <Buttom />}
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

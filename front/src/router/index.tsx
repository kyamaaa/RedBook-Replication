import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
// 懒得定义分类路由了，Home项目切换暂时不用改变布局
import NotFound from "../pages/NotFound";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页默认显示推荐分类 */}
        <Route path="/" element={<Navigate to="/recommend" replace />} />

        {/* 首页路由 - 可以访问所有分类 */}
        <Route path="/:category" element={<Home />} />

        {/* 将来应该会添加专门的分类页面 */}

        {/* 404 页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

import React, { useRef, useEffect, useState } from "react";
import LoginModal from "../Login";

const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 滑到底部的时候 isScrolled
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      // 阻止事件冒泡
      event.stopPropagation();

      if (!sidebarRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setIsScrolled(atBottom);
    };

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  // 登录弹窗
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleOpenModal = () => {
    setIsLoginOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginOpen(false);
  };

  const handleQrLogin = () => {
    console.log("二维码登录");
  };

  const handleLogin = (phone: string, code: string) => {
    console.log("手机号登录", phone, code);
    handleCloseModal();
  };

  return (
    <div
      ref={sidebarRef}
      onWheel={handleWheel}
      className={`flex flex-none h-full w-full relative bg-white overflow-x-hidden overflow-y-auto scrollbar-hide ${
        isScrolled ? "fixed inset-y-0 left-0" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col space-y-2 relative">
          <button className=" flex items-center text-black font-bold bg-gray px-2 py-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#333333"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            发现
          </button>
          <button className="flex items-center text-black font-bold hover:bg-gray px-2 py-3 rounded-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#333333"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            发布
          </button>
          <div>
            <button
              className="flex w-full h-full items-center text-black font-bold hover:bg-gray px-2 py-3 rounded-full"
              onClick={() => setIsLoginOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              通知
            </button>
            <LoginModal
              isOpen={isLoginOpen}
              onClose={handleCloseModal}
              onQrCodeLogin={handleQrLogin}
              onAgreeChange={setIsAgreed}
              isAgreed={isAgreed}
              onLoginSuccess={() => {}}
            />
          </div>
          <div>
            <button
              className="flex w-full h-full items-center justify-center text-white font-bold bg-red px-2 py-3 rounded-full"
              onClick={() => setIsLoginOpen(true)}
            >
              登录
            </button>
            <LoginModal
              isOpen={isLoginOpen}
              onClose={handleCloseModal}
              onQrCodeLogin={handleQrLogin}
              onAgreeChange={setIsAgreed}
              isAgreed={isAgreed}
              onLoginSuccess={() => {}}
            />
          </div>
          <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray2">
            <p className="text-sm font-medium mt-2 ml-3 mb-3">马上登录即可</p>
            <ul className="text-sm font-normal text-gray4 space-y-2 ml-3 mb-3 ">
              <li>刷到更懂你的优质内容</li>
              <li>搜索最新种草、拔草信息</li>
              <li>查看收藏、点赞的笔记</li>
              <li>与他人更好地互动、交流</li>
            </ul>
          </div>
        </div>
        <div
          className="mt-96 pt-4 text-xs text-gray3 leading-relaxed mr-2"
          style={{ wordBreak: "break-all" }} // 强制换行（避免英文/符号溢出）
        >
          沪ICP备13030189号|营业执照|
          2024沪公网安备31010102002533号|增值电信业务经营许可证：沪B2-20150021|医疗器械网络交易服务第三方平台备案:(沪)网械平台备字[2019]第00006号1互联网药品信息服务资格证书:
          (沪)-经营性-2023-0144|违法不良信息举报电话：4006676810|
          上海市互联网举报中心|网上有害信息举报专区|自营经营者信息1网络文化经营许可证:沪网文(2024)1344-086号|个性化推荐算法
          网信算备310101216601302230019号 ©2014-2024
          行吟信息科技（上海）有限公司 地址：上海市黄浦区马当路388号C座
          电话：9501-3888
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

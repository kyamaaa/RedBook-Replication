import React, { useState } from "react";
import LoginModal from "./Login";

const Navbar: React.FC = () => {
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

  // 监听enter键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 当按下的是Enter键时，打开登录弹窗
    if (e.key === "Enter") {
      e.preventDefault(); // 阻止默认行为（避免页面刷新或表单提交）
      setIsLoginOpen(true);
    }
  };

  return (
    <nav className="bg-white  py-5 px-9 flex items-center justify-between">
      <div className=" flex items-center justify-center bg-red font-bold w-20 h-8 rounded-full -ml-2">
        <p className="text-white text-bace font-mono">RedBook</p>
      </div>
      <div>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="登录探索更多内容"
            className=" rounded-full py-2 px-4 w-96 focus:outline-none placeholder-gray3 bg-gray caret-red"
            onKeyDown={handleKeyDown}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="#5a5a5a"
              onClick={() => setIsLoginOpen(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <LoginModal
          isOpen={isLoginOpen}
          onClose={handleCloseModal}
          onQrCodeLogin={handleQrLogin}
          onAgreeChange={setIsAgreed}
          isAgreed={isAgreed}
          onLoginSuccess={() => {}}
        />
      </div>

      <div className="flex space-x-7">
        <a href="#" className="text-gray1 hover:text-red-500">
          创作中心
        </a>
        <a href="#" className="text-gray1 hover:text-red-500">
          业务合作
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

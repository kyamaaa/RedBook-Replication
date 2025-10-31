import React, { useState } from "react";
import { CompleteUserInfo } from "../../types/user";
import useUserStore from "../../modules/user";
import LoginModal from "../Login";

interface UserAvatarProps {
  userInfo: CompleteUserInfo;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userInfo }) => {
  const { name, avatarInfo } = userInfo;
  const avatarUrl = avatarInfo?.avatarUrl;
  // 添加调试代码
  console.log("avatarUrl:", avatarUrl);
  console.log("name:", name);

  return (
    <button className="flex w-full h-full items-center text-black font-bold hover:bg-gray px-2 py-3 rounded-full">
      <img src={avatarUrl} className="h-6 w-6 mr-2 ml-2 rounded-full" />
      {name}
    </button>
  );
};

const LoginSection: React.FC = () => {
  const { userInfo, token } = useUserStore();
  const isLoggedIn = !!token && !!userInfo;

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

  const handleAvatarClick = () => {
    console.log("点击用户头像");
    // 这里可以展开用户菜单
    // 或者跳转到个人中心页面
  };
  return (
    <div className="login-section">
      {isLoggedIn && userInfo ? (
        <div>
          <UserAvatar userInfo={userInfo} />
        </div>
      ) : (
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
          />
        </div>
      )}
    </div>
  );
};

export default LoginSection;

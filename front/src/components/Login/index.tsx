import React, { useEffect, useState } from "react";
// 1. 导入用户状态管理 hooks
import useUserStore from "../../modules/user";
// 2. 导入服务层类型（确保类型安全）
import { LoginParams } from "../../services/login";
import { CompleteUserInfo } from "../../types/user";

interface LoginModalProps {
  isOpen: boolean; // 是否显示弹窗
  onClose: () => void; // 关闭弹窗的回调
  // 3. 移除原 onLogin（改为直接调用 useUserStore 的 login）
  onQrCodeLogin?: () => void; // 用二维码登录的回调
  onAgreeChange: (isAgreed: boolean) => void; // 同意协议状态变化的回调
  isAgreed: boolean; // 是否同意协议
  size?: "small" | "large"; // 窗口大小
  onLoginSuccess: (userId: number) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onQrCodeLogin,
  onAgreeChange,
  isAgreed,
  size = "large",
  onLoginSuccess,
}) => {
  // zustand 获取用户信息
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeBtnText, setCodeBtnText] = useState("获取验证码");
  const [countdown, setCountdown] = useState(0);
  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);
  // 4. 从 useUserStore 中解构需要的状态和方法
  const {
    captchaKey, // 服务端返回的验证码Key（用于登录请求）
    isLoading, // store管理的加载状态（登录/获取验证码通用）
    error, // store管理的错误信息
    fetchCaptchaAction, // store封装的“获取验证码”方法
    loginAction, // store封装的“登录”方法
    logoutAction, // 可选：如需登出可调用
    userInfo, // 登录成功后的用户信息
  } = useUserStore();

  // zustand内置 setState
  const clearError = () => useUserStore.setState({ error: null });

  // 处理背景层点击关闭弹窗
  const handleOverlayClick = () => {
    onClose();
  };
  // 防止点击弹窗内部时触发背景关闭事件
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  // 按下ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 当弹窗打开时，禁止页面滚动 + 清除错误信息
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      clearError(); // 打开弹窗时清空之前的错误
    } else {
      document.body.style.overflow = "";
      // 关闭弹窗时重置表单
      setPhone("");
      setCode("");
      setCountdown(0);
      clearError();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // 验证码倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // 同步更新按钮文本
  useEffect(() => {
    if (countdown > 0) {
      setCodeBtnText(`重新发送（${countdown}s）`);
    } else {
      setCodeBtnText("获取验证码");
    }
  }, [countdown]);

  // 对接服务层：获取验证码（替换原模拟逻辑）
  const handleGetCode = async () => {
    // 防止重复点击
    if (countdown > 0 || isGettingCode || isLoading) {
      return;
    }
    // 校验
    if (!phone) {
      alert("请输入手机号");
      return;
    }
    // 手机号格式校验（必须添加）
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      alert("请输入正确的手机号");
      return;
    }

    setIsGettingCode(true);
    try {
      // 调用服务层获取验证码（会触发 isLoading）
      await fetchCaptchaAction();
      setCountdown(60);
      alert("验证码已发送至您的手机，请注意查收");
    } catch (err: any) {
      alert(error || "获取验证码失败，请稍后重试");
    } finally {
      setIsGettingCode(false);
    }
  };

  // 6. 对接服务层：提交登录（替换原 onLogin 回调）
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("点击登录，准备发起请求");
    e.preventDefault();
    clearError(); // 提交前清空之前的错误

    // 前端基础校验
    if (!phone) {
      alert("请输入手机号");
      return;
    }
    if (!code) {
      alert("请输入验证码");
      return;
    }
    if (!isAgreed) {
      alert("请阅读并同意相关协议");
      return;
    }
    if (!captchaKey) {
      alert("请先获取验证码");
      return;
    }
    // 再次验证手机号格式
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      alert("请输入正确的手机号");
      return;
    }

    try {
      // 构造登录参数（注意：需与服务层 LoginParams 类型匹配）
      const loginParams: LoginParams = {
        username: phone, // 若后端用 username 接收手机号，直接传 phone
        captcha: code, // 用户输入的验证码
        captchaKey: captchaKey,
      };
      console.log("📤 发起登录请求，参数：", loginParams); // 验证4：打印请求参数

      // 调用 Zustand 的登录方法（对接后端接口）
      await loginAction(loginParams);

      if (userInfo?.id) {
        alert(`登录成功！欢迎您，${userInfo.name}`);
        onLoginSuccess(Number(userInfo.id));
        onClose(); // 关闭登录弹窗
      }
    } catch (err: any) {
      if (err.message && err.message.includes("获取用户信息")) {
        // 获取用户信息失败的专门错误处理
        console.error("❌ 登录流程中获取用户信息失败:", err);
        alert("登录成功，但获取用户信息失败，请稍后重试");
      } else {
        // 登录接口本身的错误
        const errorMessage =
          err?.message ||
          err?.response?.data?.message ||
          "登录失败，请检查信息后重试";
        console.error("❌ 登录接口失败:", err);
        alert(errorMessage);
      }
    }
  };

  // 根据size选弹窗宽度
  const getModalWidth = () => {
    switch (size) {
      case "small":
        return "sm:max-w-sm";
      case "large":
        return "sm:max-w-lg";
      default:
        return "sm:max-w-lg";
    }
  };

  // 弹窗未打开不渲染
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className="w-[50rem] h-[30rem] bg-white rounded-2xl shadow-xl overflow-hidden flex"
        onClick={handleModalClick}
      >
        {/* 左侧部分（二维码登录等） */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center justify-between">
          <div className="w-full flex flex-col justify-between min-h-[100px] items-center">
            <div className="flex items-center justify-center bg-blue-100/75 font-bold w-48 h-12 rounded-full">
              <p className="text-blue-500 text-base ">登录后查看搜索结果</p>
            </div>
            <div className=" flex items-center justify-center bg-red font-bold w-20 h-8 rounded-full">
              <p className="text-white text-bace font-mono">RedBook</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mt-3">
            <img
              src="https://picsum.photos/300/400?random=3"
              alt="小红书二维码"
              className="w-32 h-32"
            />
          </div>
          <div className="text-base text-gray-600 mb-8">
            可用小红书或微信扫码
          </div>
          <button
            onClick={onQrCodeLogin || onClose}
            className="px-4 py-2 text-gray4 text-sm transition-colors"
          >
            小红书扫码登录
          </button>
        </div>

        {/* 右侧部分（手机号登录） */}
        <div className="w-1/2">
          <div className="px-6 py-4 text-lg font-bold text-center mt-6 mb-5">
            手机号登录
          </div>

          <div className="px-12 py-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-full bg-gray2 ">
                    +86
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="输入手机号"
                    className="flex-1 px-3 py-3 bg-gray2 rounded-r-full focus:outline-none focus:ring-0 caret-red
                    "
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="mb-14">
                <div className="flex items-stretch">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="输入验证码"
                    className="flex-none pl-3 py-3 bg-gray2 rounded-l-full focus:outline-none focus:ring-0 caret-red"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleGetCode}
                    disabled={countdown > 0 || isGettingCode}
                    className={`flex-1 whitespace-nowrap text-right bg-gray2 pr-3 rounded-r-full text-red1 font-medium hover:text-red
                    }`}
                    style={{ width: "50%" }}
                  >
                    {isGettingCode ? "发送中..." : codeBtnText}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-red font-bold text-white text-base rounded-full hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                登录
              </button>
            </form>
          </div>

          <div className="px-6">
            <div className="flex items-center flex-nowrap">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => onAgreeChange(e.target.checked)}
                className="mr-2 mb-2"
              />
              <label className="text-xs text-gray4 flex-nowrap items-center">
                我已阅读并同意
                <a
                  href="https://oa.xiaohongshu.com/h5/terms/ZXXY20220516001/-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 ml-1"
                >
                  《用户协议》
                </a>
                <span className="text-gray4 mx-1">、</span>
                <a
                  href="https://oa.xiaohongshu.com/h5/terms/ZXXY20220516001/-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500"
                >
                  《隐私政策》
                </a>
                <span className="text-gray4 mx-1">、</span>
                <a
                  href="https://oa.xiaohongshu.com/h5/terms/ZXXY20220516001/-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500"
                >
                  《儿童/青少年个人信息保护规则》
                </a>
              </label>
            </div>
          </div>

          <div className="px-6 py-4 text-center text-sm text-gray4 mt-7">
            新用户可直接登录
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

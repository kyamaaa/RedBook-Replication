import React, { useState, useEffect, useRef } from "react";
import { mockPosts } from "../mockData";
import { Category, Post } from "../types/post";
import { PostList } from "../components/Post/PostList";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LoginModal from "../components/Login";

const Home: React.FC = () => {
  // 1. 列表状态：拆分为「新列表」和「原列表」，避免数据混淆
  const [newPosts, setNewPosts] = useState<Post[]>(mockPosts); // 加载完成后的目标列表
  const [prevPosts, setPrevPosts] = useState<Post[]>([]); // 路由切换时临时存储的原列表

  // 2. 路由状态：拆分为「加载中」和「动画中」，解决逻辑冲突
  const [isRouteLoading, setIsRouteLoading] = useState(false); // 数据加载中（显示动画+原列表）
  const [isRouteAnimating, setIsRouteAnimating] = useState(false); // 列表切换动画中（原列表→新列表）

  const emptyPostRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 滚动的加载
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // 获取导航函数和当前路由参数
  const navigate = useNavigate();
  const { category } = useParams<{ category: Category }>();

  // 点击按钮的font-bold变化
  const [selectedButtonKey, setSelectedButtonKey] = useState(
    category || "recommend"
  );

  // 新增：控制登录弹窗显示的状态
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // id查询参数
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  // 处理登录成功的回调函数
  const handleLoginSuccess = (userId: number) => {
    // 在Home组件中进行导航，因为它在路由上下文内
    navigate(`/recommend?id=${userId}`, { replace: true });
  };

  const categoryButtons: Array<{
    key: Category; // 关键：将 key 类型约束为 Category
    text: string;
    isDefaultSelected: boolean;
  }> = [
    { key: "recommend", text: "推荐", isDefaultSelected: true },
    { key: "fashion", text: "穿搭", isDefaultSelected: false },
    { key: "food", text: "美食", isDefaultSelected: false },
    { key: "makeup", text: "彩妆", isDefaultSelected: false },
    { key: "movie", text: "影视", isDefaultSelected: false },
    { key: "workplace", text: "职场", isDefaultSelected: false },
    { key: "emotion", text: "情感", isDefaultSelected: false },
    { key: "home", text: "家居", isDefaultSelected: false },
    { key: "game", text: "游戏", isDefaultSelected: false },
    { key: "travel", text: "旅行", isDefaultSelected: false },
    { key: "exercise", text: "健身", isDefaultSelected: false },
  ];

  // 根据分类加载帖子
  const loadPostsForCategory = async (cat: Category) => {
    setPrevPosts(newPosts);
    setIsRouteLoading(true);

    // setIsLoading(true);

    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 使用post.category过滤,推荐分类显示所有帖子
    const filteredPosts =
      cat === "recommend"
        ? mockPosts
        : mockPosts.filter((post) => post.category === cat);

    setNewPosts(filteredPosts);

    setIsRouteLoading(false);
    setIsRouteAnimating(true);

    // 模拟等待动画时间
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 动画结束
    setPrevPosts([]);
    setIsRouteAnimating(false);
  };

  const handleButtonClick = (key: Category) => {
    setSelectedButtonKey(key);
    navigate(`/${key}`);
  };

  // 根据按钮分类变化，加载帖子
  useEffect(() => {
    if (category) {
      loadPostsForCategory(category);
      setSelectedButtonKey(category); // 同步按钮选中状态
    }
  }, [category]);

  useEffect(() => {
    const fetchMorePosts = async () => {
      if (isLoading || isRouteLoading || isRouteAnimating) return;
      setIsLoading(true);
      // 模拟异步请求数据
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 确保新帖子和分类匹配
      const newPosts: Post[] = mockPosts
        .filter((post) => !category || post.category === category)
        .map((post) => ({
          ...post,
          id: post.id + Date.now(), // 确保ID唯一
        }));
      setNewPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setIsLoading(false);
    };

    // 滚动加载更多 接收一个 entries 参数，这是一个包含所有被观察元素的交叉状态信息的数组
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchMorePosts();
        }
      });
    };

    if (lastPostRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current && lastPostRef.current) {
        observerRef.current.unobserve(lastPostRef.current);
      }
    };
  }, [
    newPosts,
    prevPosts,
    isLoading,
    isRouteAnimating,
    isRouteLoading,
    category,
  ]);

  return (
    <div className="container px-4 py-1 w-screen ">
      {/*  */}
      {/*  */}
      <div className="mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="inline-flex space-x-2 pb-2">
          {categoryButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleButtonClick(btn.key)}
              className={`px-4 py-2 rounded-full transition-colors flex-shrink-0 ${
                selectedButtonKey === btn.key
                  ? "bg-gray text-black font-bold"
                  : "bg-white text-gray4 hover:bg-gray hover:text-black"
              }`}
              disabled={isRouteLoading || isRouteAnimating} // 路由切换时禁用按钮，防止重复点击
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>

      {/* 路由切换时的加载动画 */}
      {isRouteLoading && (
        <div className="flex justify-center items-center h-16 mb-4">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-red-500 rounded-full"></div>
        </div>
      )}

      {/* 3. 列表渲染核心：根据状态决定显示「原列表」还是「新列表」 */}
      <div className="relative">
        {/* 原列表：路由加载中显示，轻微透明提示「加载中」 */}
        {prevPosts.length > 0 && (
          <PostList
            posts={prevPosts} // 渲染原列表数据
            loading={false} // 原列表不需要骨架屏
            lastPostRef={emptyPostRef} // 原列表不参与无限滚动
            skeletonCount={0}
          />
        )}

        {/* 新列表：动画过渡时显示，完成后替换原列表 */}
        <div
          className={`absolute top-0 left-0 w-full transition-all duration-300 ${
            // 逻辑：动画过渡中显示新列表，否则隐藏（避免叠加）
            isRouteAnimating
              ? "translate-y-0 opacity-100"
              : "translate-y-0 opacity-0 pointer-events-none"
          }`}
        >
          <PostList
            posts={newPosts} // 渲染新列表数据
            loading={isLoading && !isRouteLoading && !isRouteAnimating} // 仅无限滚动时加载
            lastPostRef={lastPostRef} // 新列表参与无限滚动
            skeletonCount={6}
          />
        </div>

        {/* 初始/非过渡状态：直接显示新列表（无原列表） */}
        {prevPosts.length === 0 && !isRouteAnimating && (
          <PostList
            posts={newPosts}
            loading={isLoading}
            lastPostRef={lastPostRef}
            skeletonCount={6}
          />
        )}
      </div>

      {isLoading && !isRouteLoading && !isRouteAnimating && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full-circle h-8 w-8 border-t-2 border-b-2 border-red-500 rounded-full"></div>
        </div>
      )}
      {/*  */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAgreeChange={setIsAgreed}
        isAgreed={isAgreed}
        onLoginSuccess={handleLoginSuccess} // 传递登录成功回调
      />
      {/*  */}
    </div>
  );
};

export default Home;

// 瀑布流布局和骨架屏优化加载体验
// 瀑布流核心：列容器分配法

import React from "react";

const SKELETON_SIZES = {
  LARGE: { height: 290 },
  SMALL: { height: 150 },
};

// 随机返回大或小骨架屏
const getRandomSize = () => {
  return Math.random() > 0.5
    ? SKELETON_SIZES.LARGE.height
    : SKELETON_SIZES.SMALL.height;
};

function PostSkeleton({ size }: { size?: "large" | "small" | "random" }) {
  let skeletonSize;
  const getImageHeight = () => {
    switch (size) {
      case "large":
        return SKELETON_SIZES.LARGE.height;
      case "small":
        return SKELETON_SIZES.SMALL.height;
      // 默认随机一种尺寸
      default:
        return getRandomSize();
    }
  };

  const imageHeight = getImageHeight();

  return (
    // <div
    //   className="rounded-lg overflow-hidden bg-gray"
    //   style={{
    //     width: "100%",
    //   }}
    // >
    //   {/* 骨架屏图片区域 */}
    //   <div className="w-full" style={{ height: `calc(100% - 60px)` }}>
    //     <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
    //   </div>
    //   {/* 底部信息区 */}
    //   <div className="p-3">
    //     {/* 用户信息区 */}
    //     <div className="flex items-center gap-2 mb-2">
    //       <div className="h-6 w-6 rounded-full" />
    //       <div className="h-3 flex-1 rounded" />
    //     </div>
    //     {/* 点赞 */}
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-3">
    //         <div className="h-6 w-12 rounded animate-pulse" />
    //         <div className="h-6 w-12 rounded animate-pulse" />
    //       </div>
    //       <div className="h-6 w-6 rounded animate-pulse" />
    //     </div>
    //   </div>
    // </div>
    <div className="card-container bg-gray rounded-2xl overflow-hidden transition-transform duration-300">
      {/* 图片区域 */}
      <div
        className="card-image-container w-full bg-gray dark:bg-gray2 rounded-2xl"
        style={{ height: imageHeight }}
      ></div>

      {/* 底部信息区（内容动态撑开高度） */}
      <div className="card-info p-4">
        {/* 标题（可能换行，高度动态） */}
        <div className="card-title mb-2">
          {/* 模拟 1-2 行标题（根据实际标题可能的行数） */}
          <div className="h-4 w-3/4 rounded bg-gray3 dark:bg-gray2 animate-pulse mb-1"></div>
          <div className="h-4 w-1/2 rounded bg-gray3 dark:bg-gray2 animate-pulse"></div>
        </div>

        {/* 作者和点赞区 */}
        <div className="card-meta flex items-center justify-between">
          <div className="card-author flex items-center">
            {/* 圆形 */}
            <div className="author-avatar h-5 w-5 bg-gray3 rounded-full"></div>
            <span className="author-name h-3 w-16 ml-2"></span>
          </div>

          <div className="card-likes flex items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MasonryGridProps {
  children: React.ReactNode[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: {
    // xs就是base
    base?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  spacing?: string;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  skeletonSize?: "large" | "small" | "random";
}

export function MasonryGrid({
  children,
  loading = false,
  skeletonCount = 12,
  columns = { base: 2, xs: 2, sm: 3, md: 4, lg: 5 },
  spacing = "1rem",
  containerSize = "xl",
  skeletonSize = "random",
}: MasonryGridProps) {
  // 解析间距为数值，用于计算
  const spacingValue = parseFloat(spacing);

  // 确定当前屏幕尺寸下的列数
  const getCurrentColumns = () => {
    if (typeof window === "undefined") return columns.base || 2;

    const width = window.innerWidth;
    if (width >= 1280) return columns.lg || 5;
    if (width >= 1024) return columns.md || 4;
    if (width >= 768) return columns.sm || 3;
    if (width >= 640) return columns.xs || 2;
    return columns.base || 2;
  };

  // 响应式列数
  const [currentColumns, setCurrentColumns] = React.useState(
    getCurrentColumns()
  );
  React.useEffect(() => {
    const handleResize = () => {
      setCurrentColumns(getCurrentColumns());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  // 根据容器大小确定最大宽度
  const containerWidth = {
    xs: "360px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  }[containerSize];

  // 按列分配子元素
  const columnItems = Array.from(
    { length: currentColumns },
    () => [] as React.ReactNode[]
  );
  children.forEach((child, index) => {
    columnItems[index % currentColumns].push(child);
  });

  // 计算每列应显示的骨架屏数量
  const skeletonsPerColumn =
    loading && children.length === 0
      ? Math.ceil(skeletonCount / currentColumns)
      : 0;

  return (
    <div className="mx-auto w-full" style={{ maxWidth: containerWidth }}>
      {/* 响应式 */}
      <div
        className="grid gap-4 w-full"
        style={{
          gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
          gap: spacing,
        }}
      >
        {/* 创建列并分配子元素 */}
        {columnItems.map((column, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="flex flex-col gap-4"
            style={{ gap: spacing }}
          >
            {/* 当前列的子元素 */}
            {column.map((child, index) => (
              <div
                key={`item-${colIndex}-${index}`}
                className="fade-in"
                style={{
                  animationDelay: `${
                    (colIndex + index * currentColumns) * 0.1
                  }s`,
                }}
              >
                {child}
              </div>
            ))}

            {/* 加载更多时的骨架屏 */}
            {loading && children.length > 0 && (
              <PostSkeleton size={skeletonSize} />
            )}

            {/* 初始加载骨架屏 */}
            {loading && children.length === 0 && (
              <>
                {Array.from(
                  { length: Math.ceil(skeletonCount / currentColumns) },
                  (_, i) => (
                    <PostSkeleton
                      key={`skeleton-${colIndex}-${i}`}
                      size={skeletonSize}
                    />
                  )
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { PostSkeleton, SKELETON_SIZES };

import React, { useState } from "react";
import { Post } from "../../../types/post";
import { SKELETON_SIZES } from "./PostSkeleton";

interface PostCardProps {
  post: Post;
}

// 根据图片URL判断是竖图还是横图，返回对应的骨架屏高度
const getImageHeight = (imageUrl: string): number => {
  // 从URL中提取尺寸信息
  // 格式：https://picsum.photos/300/400?random=1 (竖图)
  // 格式：https://picsum.photos/400/300?random=6 (横图)
  const match = imageUrl.match(/\/(\d+)\/(\d+)/);

  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);

    // 竖图 (300x400) -> 使用 LARGE 高度 290px
    if (width < height) {
      return SKELETON_SIZES.LARGE.height; // 290
    }
    // 横图 (400x300) -> 使用 SMALL 高度 150px
    else {
      return SKELETON_SIZES.SMALL.height; // 150
    }
  }

  // 默认返回 LARGE 高度
  return SKELETON_SIZES.LARGE.height;
};

// 方便骨架镜像
const PostCard: React.FC<PostCardProps> = ({ post }: PostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 根据图片URL获取对应的高度（290px 或 150px）
  const imageHeight = getImageHeight(post.imageUrl);

  return (
    <div className="card-container bg-white rounded-2xl overflow-hidden transition-transform duration-300">
      {/* 图片区域 */}
      <div
        className="card-image-container relative overflow-hidden"
        style={{ height: `${imageHeight}px` }}
      >
        {/* 图片加载中的黑框占位 */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-white border-gray3 border rounded-2xl">
            {/* 空白黑框，等待图片加载 */}
          </div>
        )}

        {/* 图片加载失败的占位符 */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* 实际图片 - 加载完成后淡入并替换黑框 */}
        <img
          src={post.imageUrl}
          alt={post.title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover rounded-2xl hover:brightness-75 transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>

      {/* 底部信息区（内容动态撑开高度） */}
      <div className="card-info p-4">
        {/* 标题（可能换行，高度动态） */}
        <h3 className="card-title font-normal text-sm text-gray-800 mb-2">
          {post.title}
        </h3>

        {/* 作者和点赞区 */}
        <div className="card-meta flex items-center justify-between">
          <div className="card-author flex items-center">
            <div className="author-avatar bg-white rounded-full overflow-hidden">
              <img
                src={post.imageUrl}
                className="w-5 h-5 object-cover rounded-full"
                alt={post.author}
              />
            </div>
            <span className="author-name text-gray-400 text-xs ml-2">
              {post.author}
            </span>
          </div>

          <div className="card-likes flex items-center text-gray4 text-xs">
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
            {post.likes}+
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

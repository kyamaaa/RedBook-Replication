import React, { useState } from "react";
import { Post } from "../../../types/post";

interface PostCardProps {
  post: Post;
}

// 方便骨架镜像
const PostCard: React.FC<PostCardProps> = ({ post }: PostCardProps) => {
  return (
    <div className="card-container bg-white rounded-2xl overflow-hidden transition-transform duration-300">
      {/* 图片区域 */}
      <div className="card-image-container">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover rounded-2xl hover:brightness-75"
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

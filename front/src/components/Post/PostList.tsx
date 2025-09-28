// 引入必要依赖：React（用于类型定义）、PostCard组件、Post类型
import React, { RefObject } from "react";
import PostCard from "./component/PostCard";
import { Post } from "../../types/post";
import { MasonryGrid } from "./component/PostSkeleton";
import { PostSkeleton } from "./component/PostSkeleton";

// interface PostListProps {
//   /** 帖子列表数据源 */
//   posts: Post[];
//   // lastPostRef: RefObject<HTMLDivElement | null>;
// }

// // 2. 组件通过Props接收依赖项，解构后使用
// export function PostList({ posts, lastPostRef }: PostListProps) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {posts.map((post, index) => {
//         // 判断是否为最后一个帖子：给最后一个帖子的外层容器绑定lastPostRef
//         if (posts.length === index + 1) {
//           return (
//             <div ref={lastPostRef} key={post.id}>
//               <PostCard post={post} />
//             </div>
//           );
//         } else {
//           // 非最后一个帖子：直接渲染PostCard
//           return <PostCard key={post.id} post={post} />;
//         }
//       })}
//     </div>
//   );
// }

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  skeletonCount?: number;
  lastPostRef?: RefObject<HTMLDivElement | null>;
}

export function PostList({
  posts = [],
  skeletonCount = 12,
  loading = false,
  lastPostRef,
}: PostListProps) {
  const validPosts = posts.filter((post) => post != null && post.id);

  return (
    // 用MasonryGrid作为统一容器：同时处理瀑布流布局和骨架屏
    <MasonryGrid
      loading={true} // 控制骨架屏显示/隐藏
      skeletonCount={skeletonCount} // 骨架屏总数
      columns={{ base: 2, xs: 2, sm: 3, md: 4, lg: 5 }} // 响应式列数
      spacing="1rem" // 列与列、卡片与卡片的间距（可根据需求调整）
      containerSize="xl" // 容器最大宽度（适配大屏）
    >
      {/* 渲染有效帖子卡片：分配到瀑布流的列中 */}
      {validPosts.map((post, index) => {
        // 给最后一个帖子绑定Ref（用于下拉加载检测）
        const isLastPost = validPosts.length === index + 1;

        return (
          <div
            key={post.id} // 用帖子唯一ID作为key（避免React列表警告）
            // 仅最后一个帖子绑定Ref，其他帖子不绑定
            ref={isLastPost && lastPostRef ? lastPostRef : undefined}
          >
            {/* 传递单个帖子给PostCard */}
            <PostCard post={post} />
          </div>
        );
      })}
    </MasonryGrid>
  );
}

// 定义所有可能的分类类型
export type Category =
  | "recommend"
  | "fashion"
  | "food"
  | "makeup"
  | "movie"
  | "workplace"
  | "emotion"
  | "home"
  | "game"
  | "travel"
  | "exercise";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  likes: number;
  imageUrl: string;
  category: Category;
}

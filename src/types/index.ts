// 文章元数据类型定义
export interface PostMeta {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  author?: string;
  coverImage?: string;
}

// 完整文章类型
export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
  readingTime: number;
}

// 文章标题结构（用于侧边栏目录）
export interface Heading {
  id: string;
  text: string;
  level: number;
}

// 文章目录类型
export interface TableOfContents {
  headings: Heading[];
}

// 邀请码验证相关类型
export interface InviteCode {
  code: string;
  used: boolean;
  createdAt: string;
  usedAt?: string;
}

// API 响应类型
export interface VerifyInviteResponse {
  success: boolean;
  message: string;
  token?: string;
}

// 认证状态类型
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

// 组件 Props 类型
export interface PostCardProps {
  post: Post;
}

export interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}
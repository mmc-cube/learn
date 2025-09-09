import { Post } from '@/types';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';

interface PostCardProps {
  post: Omit<Post, 'content'>;
}

/**
 * 文章卡片组件 - 用于首页文章列表显示
 */
export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-6 hover:shadow-sm">
      <div className="space-y-3">
        {/* 标题 */}
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          <Link 
            href={`/posts/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.meta.title}
          </Link>
        </h2>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <time dateTime={post.meta.date}>
              {formatDate(post.meta.date)}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readingTime} 分钟阅读</span>
          </div>

          {post.meta.author && (
            <div className="flex items-center gap-1">
              <span>by {post.meta.author}</span>
            </div>
          )}
        </div>

        {/* 摘要 */}
        {post.meta.excerpt && (
          <p className="text-gray-600 leading-relaxed">
            {post.meta.excerpt}
          </p>
        )}

        {/* 标签 */}
        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <Tag size={14} className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
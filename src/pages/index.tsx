import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { getAllPosts, searchPosts } from '@/lib/posts';
import { Post } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Search, BookOpen, Clock } from 'lucide-react';

interface HomeProps {
  posts: Omit<Post, 'content'>[];
}

export default function Home({ posts }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchPosts(query.trim());
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts);
    }
  };

  const totalReadingTime = posts.reduce((total, post) => total + post.readingTime, 0);

  return (
    <>
      <Head>
        <title>知识分享网站 - 首页</title>
        <meta name="description" content="个人知识分享网站，分享技术文章、学习笔记和思考感悟" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面头部 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              知识分享
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              用心分享技术文章、学习笔记和思考感悟
            </p>
            
            {/* 统计信息 */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>{posts.length} 篇文章</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>共 {totalReadingTime} 分钟阅读</span>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 文章列表 */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                未找到相关文章
              </h3>
              <p className="text-gray-600">
                尝试使用不同的关键词搜索
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                暂无文章
              </h3>
              <p className="text-gray-600">
                在 posts 目录中添加 Markdown 文件开始分享吧！
              </p>
            </div>
          )}

          {/* 搜索结果提示 */}
          {searchQuery && (
            <div className="mt-8 text-center text-sm text-gray-500">
              {filteredPosts.length > 0 ? (
                <p>找到 {filteredPosts.length} 篇关于 "{searchQuery}" 的文章</p>
              ) : (
                <p>没有找到关于 "{searchQuery}" 的文章</p>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
    // 每小时重新生成页面
    revalidate: 3600,
  };
};
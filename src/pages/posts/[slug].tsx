import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getPostBySlug, getAllPostSlugs, extractHeadings } from '@/lib/posts';
import { Post, Heading } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/TableOfContents';
import { Calendar, Clock, Tag, ArrowUp } from 'lucide-react';

interface PostPageProps {
  post: Post;
  headings: Heading[];
}

export default function PostPage({ post, headings }: PostPageProps) {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 监听滚动，更新活跃标题和返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowBackToTop(scrollTop > 500);

      // 找到当前可见的标题
      const headingElements = headings.map(h => ({
        id: h.id,
        element: document.getElementById(h.id),
        offset: document.getElementById(h.id)?.offsetTop || 0,
      })).filter(h => h.element);

      const currentHeading = headingElements
        .reverse()
        .find(h => scrollTop >= h.offset - 100);

      if (currentHeading) {
        setActiveHeadingId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 将内容中的标题添加 id 属性
  const processContentWithIds = (content: string) => {
    return content.replace(
      /<h([1-4])>(.*?)<\/h[1-4]>/g,
      (match, level, text) => {
        const plainText = text.replace(/<[^>]*>/g, '');
        const id = plainText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        return `<h${level} id="${id}">${text}</h${level}>`;
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const processedContent = processContentWithIds(post.content);

  return (
    <>
      <Head>
        <title>{post.meta.title} - 知识分享网站</title>
        <meta name="description" content={post.meta.excerpt || post.meta.title} />
        <meta name="author" content={post.meta.author} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.meta.title} />
        <meta property="og:description" content={post.meta.excerpt || post.meta.title} />
        {post.meta.coverImage && (
          <meta property="og:image" content={post.meta.coverImage} />
        )}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={post.meta.title} />
        <meta property="twitter:description" content={post.meta.excerpt || post.meta.title} />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.meta.title,
              description: post.meta.excerpt,
              author: {
                '@type': 'Person',
                name: post.meta.author,
              },
              datePublished: post.meta.date,
              image: post.meta.coverImage,
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        <Header showBackButton title={post.meta.title} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 文章内容 */}
            <article className="flex-1 max-w-4xl">
              {/* 文章头部 */}
              <header className="mb-8 pb-8 border-b border-gray-200">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {post.meta.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
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
                      <span>作者: {post.meta.author}</span>
                    </div>
                  )}
                </div>

                {/* 标签 */}
                {post.meta.tags && post.meta.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {post.meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* 文章正文 */}
              <div 
                className="prose prose-lg max-w-none prose-blue"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>

            {/* 侧边栏目录 */}
            <TableOfContents headings={headings} activeId={activeHeadingId} />
          </div>
        </main>

        <Footer />

        {/* 返回顶部按钮 */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="返回顶部"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // 从原始 markdown 内容中提取标题
  const fs = require('fs');
  const path = require('path');
  const matter = require('gray-matter');
  
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);
  const headings = extractHeadings(content);

  return {
    props: {
      post,
      headings,
    },
    // 每小时重新生成页面
    revalidate: 3600,
  };
};
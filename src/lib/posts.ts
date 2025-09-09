import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { Post, PostMeta, Heading } from '@/types';

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * 获取所有文章的基本信息（不包含内容）
 */
export function getAllPosts(): Omit<Post, 'content'>[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // 计算阅读时间（基于字数，假设每分钟阅读200字）
        const readingTime = Math.ceil(content.length / 200 / 5); // 中文字符计算

        return {
          slug,
          meta: {
            title: data.title || fileName.replace(/\.md$/, ''),
            date: data.date || new Date().toISOString(),
            excerpt: data.excerpt || content.slice(0, 200) + '...',
            tags: data.tags || [],
            author: data.author || 'Anonymous',
            coverImage: data.coverImage || null,
          } as PostMeta,
          readingTime,
        };
      });

    // 按日期排序，最新的在前
    return allPostsData.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

/**
 * 获取单篇文章的完整信息（包含渲染后的HTML内容）
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // 处理图片路径，将相对路径转换为绝对路径
    const processedContent = content.replace(
      /!\[(.*?)\]\((?!http)(.*?)\)/g,
      (match, alt, src) => {
        // 如果图片在 posts 目录下，转换为 public 目录下的路径
        const imagePath = src.startsWith('./') ? src.slice(2) : src;
        return `![${alt}](/images/${imagePath})`;
      }
    );

    // 使用 remark 将 Markdown 转换为 HTML
    const processedContentResult = await remark()
      .use(remarkGfm) // 支持表格、删除线等 GitHub 风格 Markdown
      .use(remarkHtml, { sanitize: false }) // 允许原始 HTML
      .process(processedContent);

    const contentHtml = processedContentResult.toString();

    // 计算阅读时间
    const readingTime = Math.ceil(content.length / 200 / 5);

    return {
      slug,
      meta: {
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || content.slice(0, 200) + '...',
        tags: data.tags || [],
        author: data.author || 'Anonymous',
        coverImage: data.coverImage || null,
      } as PostMeta,
      content: contentHtml,
      readingTime,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * 从 Markdown 内容中提取标题，生成目录
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    // 生成 ID（用于锚点链接）
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格转换为连字符
      .trim();

    headings.push({
      id: id || `heading-${headings.length}`,
      text,
      level,
    });
  }

  return headings;
}

/**
 * 获取所有文章的 slug 列表（用于静态路由生成）
 */
export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting post slugs:', error);
    return [];
  }
}

/**
 * 搜索文章（基于标题和内容）
 */
export function searchPosts(query: string): Omit<Post, 'content'>[] {
  const allPosts = getAllPosts();
  const lowercaseQuery = query.toLowerCase();

  return allPosts.filter((post) =>
    post.meta.title.toLowerCase().includes(lowercaseQuery) ||
    post.meta.excerpt?.toLowerCase().includes(lowercaseQuery) ||
    post.meta.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tag: string): Omit<Post, 'content'>[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.meta.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * 获取所有使用过的标签
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.meta.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
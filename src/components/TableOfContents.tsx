import { Heading, TableOfContentsProps } from '@/types';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * 侧边栏目录组件 - 显示文章标题结构并支持点击跳转
 */
export default function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动，实现活跃标题高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 这里可以实现更复杂的活跃标题逻辑
        // 暂时先使用传入的 activeId
      },
      {
        rootMargin: '-20% 0% -35% 0%',
      }
    );

    // 观察所有标题元素
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-8 hidden lg:block w-64 ml-8">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight size={16} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
            目录
          </h3>
        </div>
        
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleHeadingClick(heading.id)}
              className={`
                block w-full text-left py-1.5 px-2 rounded text-sm transition-colors
                ${heading.level === 2 ? 'toc-h2' : ''}
                ${heading.level === 3 ? 'toc-h3' : ''}
                ${heading.level === 4 ? 'toc-h4' : ''}
                ${
                  activeId === heading.id
                    ? 'toc-link active'
                    : 'toc-link'
                }
              `}
              title={heading.text}
            >
              <span className="truncate block">
                {heading.text}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
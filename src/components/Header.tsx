import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

/**
 * 网站头部组件 - 极简设计风格
 */
export default function Header({ showBackButton = false, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">返回</span>
              </Link>
            )}
            
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home size={18} className="text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">
                  知识分享
                </span>
              </Link>
            </div>
          </div>

          {title && (
            <div className="hidden md:block">
              <h1 className="text-lg font-medium text-gray-700 truncate max-w-96">
                {title}
              </h1>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {/* 这里可以添加用户菜单或其他操作 */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
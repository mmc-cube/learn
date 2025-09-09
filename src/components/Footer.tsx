/**
 * 网站底部组件 - 极简设计
 */
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2024 知识分享网站. 用心分享，用爱传播.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Powered by Next.js</span>
            <span>•</span>
            <span>Deployed on Netlify</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
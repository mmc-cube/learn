/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 优化构建
  swcMinify: true,
  
  // 支持静态导出（部署时可能需要禁用）
  // output: 'export',
  trailingSlash: true,
  
  // Netlify 兼容配置
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // 优化包大小
  experimental: {
    optimizePackageImports: ['lucide-react']
  },

  // Markdown 文件处理
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
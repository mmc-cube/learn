# 知识分享网站

一个基于 Next.js 构建的极简个人知识分享网站，支持 Markdown 文章、图片展示、目录导航和邀请码访问控制。

## ✨ 特性

- 🎯 **极简设计** - 专注内容，清晰易读
- 📝 **Markdown 支持** - 完整的 GitHub 风格 Markdown
- 🖼️ **图片优化** - 自动 WebP 转换和懒加载
- 📚 **自动目录** - 根据标题自动生成侧边栏目录
- 🔒 **访问控制** - 基于邀请码的私密访问机制
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **性能优化** - 静态生成，极快加载速度
- 🌐 **SEO 友好** - 结构化数据和元标签优化

## 🛠️ 技术栈

- **前端框架**: Next.js 14 + TypeScript
- **样式系统**: Tailwind CSS + 自定义组件
- **内容解析**: Remark + Rehype 生态
- **数据库**: FaunaDB（无服务器）
- **云函数**: Netlify Functions
- **部署平台**: Netlify
- **开发工具**: ESLint + TypeScript

## 📁 项目结构

```
knowledge-sharing-website/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.tsx      # 头部导航
│   │   ├── Footer.tsx      # 底部信息
│   │   ├── PostCard.tsx    # 文章卡片
│   │   ├── TableOfContents.tsx  # 目录组件
│   │   ├── OptimizedImage.tsx   # 优化图片组件
│   │   └── InviteGate.tsx  # 邀请码验证
│   ├── lib/                # 工具函数
│   │   ├── posts.ts        # 文章处理
│   │   ├── fauna.ts        # 数据库操作
│   │   └── auth.tsx        # 认证管理
│   ├── pages/              # Next.js 页面
│   │   ├── index.tsx       # 首页
│   │   ├── posts/[slug].tsx # 文章详情页
│   │   ├── _app.tsx        # 应用入口
│   │   └── _document.tsx   # HTML 文档
│   ├── styles/             # 样式文件
│   └── types/              # TypeScript 类型
├── posts/                  # Markdown 文章
├── public/                 # 静态资源
├── netlify/                # Netlify 配置
│   └── functions/          # 云函数
├── next.config.js          # Next.js 配置
├── tailwind.config.js      # Tailwind 配置
└── package.json           # 依赖管理
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/knowledge-sharing-website.git
cd knowledge-sharing-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入以下信息：
FAUNA_SECRET_KEY=your_fauna_secret_key
JWT_SECRET=your_jwt_secret_key
ADMIN_TOKEN=your_admin_token
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看网站。

## 📝 内容管理

### 添加文章

在 `posts/` 目录创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2024-01-15"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
author: "作者名称"
---

# 文章内容

这里是您的 Markdown 内容...

## 子标题

支持代码块：

\`\`\`javascript
console.log('Hello World!');
\`\`\`

支持图片：
![图片描述](./image.jpg)
```

### 添加图片

1. 将图片放在 `public/images/` 目录
2. 在 Markdown 中引用：`![描述](./image-name.jpg)`
3. 系统自动优化和处理

## 🔐 邀请码系统

### 创建邀请码

使用管理 API：

```bash
# 创建单个邀请码
curl -X POST "/.netlify/functions/admin-invites" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "WELCOME2024"}'

# 批量创建
curl -X POST "/.netlify/functions/admin-invites" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'
```

### 用户访问流程

1. 用户访问网站
2. 系统检查本地认证状态
3. 未认证用户需输入邀请码
4. 验证成功后获得 30 天访问权限
5. 邀请码使用后自动失效

## 🌐 部署指南

详细部署教程请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到 Netlify

1. 推送代码到 GitHub
2. 连接 Netlify 到您的仓库
3. 配置环境变量
4. 自动部署完成

## 🔧 开发指南

### 可用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint
npm run type-check   # TypeScript 类型检查
```

### 自定义配置

- **样式**: 修改 `tailwind.config.js` 和 `src/styles/globals.css`
- **站点信息**: 更新 `src/pages/_document.tsx` 中的元数据
- **功能**: 在 `src/components/` 中添加新组件

## 🔍 SEO 优化

网站已内置 SEO 优化：

- 自动生成元标签
- 结构化数据标记
- Open Graph 协议支持
- Twitter Card 支持
- 自动生成网站地图

## 📊 性能特性

- **静态生成** - 构建时预渲染所有页面
- **图片优化** - 自动 WebP/AVIF 转换
- **代码分割** - 自动按页面分割代码
- **字体优化** - 字体子集化和预加载
- **缓存策略** - 智能静态资源缓存

## 🔒 安全特性

- **邀请码验证** - 服务端验证，前端无法绕过
- **JWT 令牌** - 安全的用户状态管理
- **环境变量** - 敏感信息服务端处理
- **HTTPS 强制** - 全站 HTTPS 加密
- **安全头部** - 预防常见 Web 攻击

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Remark](https://remark.js.org/) - Markdown 处理器
- [FaunaDB](https://fauna.com/) - 无服务器数据库
- [Netlify](https://netlify.com/) - 部署平台
- [Lucide](https://lucide.dev/) - 图标库

## 📞 支持

如果您觉得这个项目有用，请给它一个 ⭐️！

有问题或建议？欢迎创建 [Issue](https://github.com/YOUR_USERNAME/knowledge-sharing-website/issues)。

---

**用心分享，用爱传播** ❤️
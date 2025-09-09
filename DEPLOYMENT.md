# 知识分享网站 - 完整部署教程

这是一个基于 Next.js + Netlify + FaunaDB 的个人知识分享网站的完整部署指南。

## 🚀 快速开始

### 系统要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本
- Git
- GitHub 账号
- Netlify 账号
- FaunaDB 账号（可选，推荐）

## 📋 第一步：环境准备

### 1. 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击 "New repository"
3. 仓库名称：`knowledge-sharing-website`（或您喜欢的名称）
4. 设置为 Private（推荐，因为包含邀请码系统）
5. 点击 "Create repository"

### 2. 克隆并上传代码

```bash
# 进入项目目录
cd knowledge-sharing-website

# 初始化 Git 仓库
git init

# 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/knowledge-sharing-website.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Knowledge sharing website"

# 推送到 GitHub
git push -u origin main
```

## 🗄️ 第二步：配置 FaunaDB 数据库

### 1. 注册 FaunaDB 账号

1. 访问 [FaunaDB](https://fauna.com/)
2. 点击 "Sign Up" 注册账号
3. 验证邮箱并登录

### 2. 创建数据库

1. 登录 FaunaDB 控制台
2. 点击 "Create Database"
3. 数据库名称：`knowledge-sharing`
4. Region 选择：`Classic`（免费版本）
5. 点击 "Create"

### 3. 创建安全密钥

1. 进入刚创建的数据库
2. 点击左侧菜单的 "Security"
3. 点击 "New Key"
4. Role 选择：`Server`
5. Key Name：`netlify-functions`
6. 点击 "Save"
7. **重要：复制并保存生成的密钥**（只显示一次）

### 4. 设置数据库结构

在 FaunaDB Shell 中执行以下命令（可选，函数会自动创建）：

```javascript
// 创建 invites 集合
CreateCollection({name: "invites"})

// 创建索引
CreateIndex({
  name: "invites_by_code",
  source: Collection("invites"),
  terms: [{field: ["data", "code"]}],
  unique: true
})

// 创建几个示例邀请码
Create(Collection("invites"), {
  data: {
    code: "WELCOME2024",
    used: false,
    createdAt: Now()
  }
})

Create(Collection("invites"), {
  data: {
    code: "HELLO123",
    used: false,
    createdAt: Now()
  }
})
```

## 🌐 第三步：Netlify 部署配置

### 1. 连接 GitHub 仓库

1. 登录 [Netlify](https://netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub" 并授权
4. 选择您的 `knowledge-sharing-website` 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `netlify/functions`

### 2. 配置环境变量

在 Netlify 控制台中设置以下环境变量：

1. 进入 Site settings → Environment variables
2. 添加以下变量：

```bash
# FaunaDB 配置
FAUNA_SECRET_KEY=your_fauna_secret_key_from_step_2

# JWT 密钥（生成一个随机字符串）
JWT_SECRET=your_super_secret_jwt_key_32_chars_long

# 管理员令牌（用于管理邀请码）
ADMIN_TOKEN=your_admin_token_for_managing_invites

# 网站地址（部署后获得）
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
```

**生成安全密钥的方法**：
```bash
# 在终端中生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 部署网站

1. 点击 "Deploy site"
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，您会获得一个 `.netlify.app` 域名

### 4. 自定义域名（可选）

1. 在 Netlify 控制台中，进入 Domain settings
2. 点击 "Add custom domain"
3. 输入您的域名
4. 按照指引配置 DNS 设置
5. 启用 HTTPS（Netlify 会自动提供 Let's Encrypt 证书）

## 📝 第四步：内容管理

### 1. 添加文章

在本地项目的 `posts` 目录中创建 `.md` 文件：

```markdown
---
title: "您的文章标题"
date: "2024-01-15"
excerpt: "文章摘要，会显示在首页列表中"
tags: ["标签1", "标签2", "标签3"]
author: "作者名称"
---

# 文章标题

这里是文章内容...

## 二级标题

更多内容...

### 三级标题

支持代码块：

\`\`\`javascript
console.log('Hello World!');
\`\`\`

支持图片：
![图片描述](./image.jpg)
```

### 2. 添加图片

1. 将图片放在 `public/images/` 目录中
2. 在 Markdown 中引用：`![描述](./image-name.jpg)`
3. 系统会自动处理路径转换和优化

### 3. 发布内容

```bash
# 添加新内容
git add .
git commit -m "Add new post: your-post-title"
git push

# Netlify 会自动检测更改并重新部署
```

## 🔐 第五步：邀请码管理

### 1. 创建邀请码

使用管理 API 创建邀请码：

```bash
# 创建单个邀请码
curl -X POST "https://your-site.netlify.app/.netlify/functions/admin-invites" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": "CUSTOM123"}'

# 批量创建邀请码
curl -X POST "https://your-site.netlify.app/.netlify/functions/admin-invites" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'
```

### 2. 查看邀请码状态

```bash
curl "https://your-site.netlify.app/.netlify/functions/admin-invites" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. 分享邀请码

将邀请码分享给您希望访问网站的用户，他们首次访问时需要输入邀请码验证身份。

## 🔧 第六步：本地开发环境

### 1. 克隆项目到本地

```bash
git clone https://github.com/YOUR_USERNAME/knowledge-sharing-website.git
cd knowledge-sharing-website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件，填入实际值
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看网站。

### 5. 测试 Netlify Functions

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目目录中运行
netlify dev
```

## 📊 监控和维护

### 1. 查看网站分析

1. 在 Netlify 控制台查看访问统计
2. 设置 Google Analytics（可选）

### 2. 监控构建状态

1. 在 Netlify 中设置构建通知
2. 查看构建日志了解部署状态

### 3. 备份数据

1. 定期导出 FaunaDB 数据
2. 备份 GitHub 仓库

## ⚠️ 故障排除

### 常见问题

**1. 构建失败**
```bash
# 检查构建日志
netlify open --site

# 常见解决方案：
# - 检查 package.json 中的依赖版本
# - 确保环境变量正确设置
# - 检查 TypeScript 类型错误
```

**2. 邀请码验证失败**
```bash
# 检查环境变量是否正确设置
# 验证 FaunaDB 连接和权限
# 查看函数日志
```

**3. 图片不显示**
```bash
# 确保图片在 public/images/ 目录中
# 检查 Markdown 中的路径是否正确
# 验证图片格式是否支持
```

**4. 页面无法访问**
```bash
# 检查 Netlify 重定向规则
# 确保 next.config.js 配置正确
```

## 🔄 更新和扩展

### 更新依赖

```bash
# 检查过时的包
npm outdated

# 更新所有依赖
npm update

# 更新特定包
npm install package-name@latest
```

### 添加新功能

1. 在本地开发和测试
2. 提交到 GitHub
3. 自动部署到 Netlify

## 📱 移动端优化

网站已经过移动端优化，包括：

- 响应式设计
- 触摸友好的界面
- 优化的字体大小
- 快速的加载速度

## 🔒 安全最佳实践

1. **定期更新依赖**：保持所有包为最新版本
2. **环境变量管理**：不要在代码中硬编码敏感信息
3. **邀请码管理**：定期更新和替换邀请码
4. **HTTPS**：始终使用 HTTPS（Netlify 自动提供）
5. **监控访问**：定期检查访问日志

## 📞 获取帮助

如果遇到问题，可以：

1. 查看 [Next.js 文档](https://nextjs.org/docs)
2. 查看 [Netlify 文档](https://docs.netlify.com/)
3. 查看 [FaunaDB 文档](https://docs.fauna.com/)
4. 在项目 GitHub 仓库中创建 Issue

## 🎉 恭喜！

您的知识分享网站现在已经成功部署！您可以开始添加内容和分享知识了。

记住要定期备份数据，并保持系统更新以确保安全性和最佳性能。
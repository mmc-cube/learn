---
title: "欢迎来到知识分享网站"
date: "2024-01-15"
excerpt: "这是一篇示例文章，展示了网站的基本功能，包括 Markdown 解析、图片显示和标题目录等特性。"
tags: ["介绍", "示例", "Markdown"]
author: "管理员"
---

# 欢迎来到知识分享网站

欢迎访问我们的个人知识分享网站！这个网站是基于 Next.js 构建的现代化知识分享平台，支持 Markdown 文章编写和发布。

## 网站特性

### 极简设计
我们采用了极简的设计理念，确保内容是绝对的主角。清晰的排版和合理的间距让阅读变得更加舒适。

### Markdown 支持
网站完全支持 Markdown 格式，让您可以：

- 使用熟悉的 Markdown 语法
- 专注于内容创作而不是格式排版
- 轻松插入代码块、表格和列表

### 图片支持
您可以在文章中插入图片，系统会自动进行优化处理：

```markdown
![示例图片](./example-image.jpg)
```

### 自动目录
系统会自动根据文章中的标题生成侧边栏目录，方便读者快速导航到感兴趣的章节。

## 如何使用

### 添加新文章

1. 在 `posts` 目录下创建新的 `.md` 文件
2. 添加 frontmatter 元数据
3. 编写 Markdown 内容
4. 提交到 Git 仓库，网站会自动更新

### 文章元数据

每篇文章都应该包含以下元数据：

```yaml
---
title: "文章标题"
date: "2024-01-15"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
author: "作者名称"
---
```

## 技术栈

网站使用了现代化的技术栈：

- **前端框架**: Next.js 14
- **样式系统**: Tailwind CSS
- **内容解析**: Remark & Rehype
- **数据库**: FaunaDB
- **部署平台**: Netlify
- **访问控制**: 邀请码验证机制

## 代码示例

这里是一个简单的 JavaScript 代码示例：

```javascript
// 文章列表处理函数
function getAllPosts() {
  const posts = fs.readdirSync('posts')
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const content = fs.readFileSync(`posts/${fileName}`, 'utf8');
      const { data, content: markdown } = matter(content);
      
      return {
        slug: fileName.replace('.md', ''),
        meta: data,
        content: markdown
      };
    });

  return posts.sort((a, b) => 
    new Date(b.meta.date) - new Date(a.meta.date)
  );
}
```

## 表格支持

| 特性 | 支持情况 | 说明 |
|------|---------|------|
| Markdown | ✅ | 完全支持 GitHub 风格 |
| 图片优化 | ✅ | 自动 WebP 转换 |
| 响应式设计 | ✅ | 移动端友好 |
| 搜索功能 | ✅ | 全文搜索 |
| 标签分类 | ✅ | 支持多标签 |
| 邀请码保护 | ✅ | 私密访问控制 |

## 开始探索

现在您可以开始探索网站的各种功能了！如果您有任何问题或建议，欢迎联系管理员。

> 💡 **小贴士**: 点击右侧的目录可以快速跳转到对应的章节，在移动端可以使用返回顶部按钮快速回到页面顶端。

感谢您的访问，希望您在这里能找到有价值的内容！
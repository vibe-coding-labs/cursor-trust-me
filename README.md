# Cursor Trust Me

一个用于提高 Cursor AI 编辑器信任度的工具，帮助用户更流畅地使用 Cursor 的 AI 功能。

## 项目背景与解决的问题

Cursor 对免费用户有一定的使用限制和风控检查机制，可能导致 AI 功能无法正常使用或响应缓慢。本项目通过生成与 Cursor 相关的随机问题，帮助用户提高 Cursor 对其的信任度。

**使用方法**：
1. 在使用 Cursor 进行实际开发前，先复制一个本工具生成的问题
2. 将问题粘贴到 Cursor 中并等待回答
3. 然后再开始你的实际开发问题

这样可以显著提高 Cursor 的响应质量和速度，使你能够更流畅地使用 Cursor 的 AI 功能。

## 在线访问

访问 [https://vibe-coding-labs.github.io/cursor-trust-me/#/random](https://vibe-coding-labs.github.io/cursor-trust-me/#/random) 查看应用。

## 功能特点

- 随机展示关于 Cursor 与其他工具比较的问题
- 完整的问题列表，支持搜索和排序
- 支持复制问题、点赞和标记问题
- 响应式设计，适配移动端和桌面端

## 本地开发

### 安装依赖

```bash
npm install
```

### 生成问题数据

```bash
npm run generate-questions
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 本地预览生产构建

```bash
npm run preview
```

## 部署

项目配置了 GitHub Actions 自动部署流程。每当推送到 `main` 分支时，会自动构建并部署到 GitHub Pages。

如需手动部署，可以运行：

```bash
npm run deploy
```

## 项目链接

- 在线应用: [https://vibe-coding-labs.github.io/cursor-trust-me/#/random](https://vibe-coding-labs.github.io/cursor-trust-me/#/random)
- GitHub 仓库: [https://github.com/vibe-coding-labs/cursor-trust-me](https://github.com/vibe-coding-labs/cursor-trust-me)

## 技术栈

- React
- TypeScript
- React Router
- React Select
- Vite
- GitHub Pages

## 许可证

MIT

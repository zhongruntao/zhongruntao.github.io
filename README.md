# 我的博客

基于 [Jekyll](https://jekyllrb.com/) 的极简个人博客，纯静态站点，支持明暗主题切换、站内搜索、分类归档等功能。

## 特性

- 明暗主题切换，点击页头头像即可切换，跟随系统设置
- 客户端站内搜索，无需后端支持
- 分类归档，按年份分组展示文章
- 代码高亮（Rouge 引擎，深浅双套主题）
- 图片全屏预览，点击文章内图片居中放大
- MathJax 数学公式渲染
- PWA 离线缓存支持

## 技术栈

| 类别 | 说明 |
|------|------|
| 站点生成 | Jekyll 3.8.5 |
| 代码高亮 | Rouge 3.11.0 |
| 前端 | 原生 HTML / CSS / JS |
| 搜索 | jQuery + 预生成 XML 索引 |
| 部署 | GitHub Pages 或腾讯云 COS + CDN |

## 目录结构

```
├── _config.yml        # 站点配置（信息、菜单、友情链接等）
├── _layouts/          # 布局模板（page / mypost）
├── _includes/         # 可复用组件（head、header、footer 等）
├── _posts/            # 博客文章（Markdown）
├── pages/             # 独立页面（关于、分类、搜索、书签）
├── posts/             # 文章静态资源（按 年/月/日 组织）
├── static/            # 静态资源（CSS、JS、字体、图片、XML）
├── index.html         # 首页
├── blog.sh            # 构建与部署脚本
├── service-worker.js  # PWA 离线缓存
└── favicon.ico        # 站点图标（多尺寸）
```

## 快速开始

### 本地运行

```bash
# 安装依赖
bundle install

# 启动本地预览（默认端口 8080）
./blog.sh run

# 或指定端口
./blog.sh run 4000
```

### 配置站点信息

1. 修改 `_config.yml`，设置 `title`、`description`、`author`、`keywords` 等字段
2. 修改 `pages/about.md`，编辑"关于"页面的内容
3. 站点头像放在 `static/img/logo.jpg`（建议 1:1 比例）
4. 站点图标 `static/img/favicon.ico`（建议使用多尺寸 ICO）

### 域名配置

| 方式 | 操作 |
|------|------|
| 自定义域名 | `CNAME` 文件写入你的域名，CNAME 解析到 `用户名.github.com` |
| GitHub 域名 | 删除 `CNAME` 文件，项目命名为 `用户名.github.io` |

## 写文章

文章放在 `_posts` 目录下，命名为 `yyyy-MM-dd-标题.md`，文件头使用 Front Matter：

```yaml
---
layout: mypost
title: 标题
categories: [分类1, 分类2]
---

正文内容，Markdown 格式。
```

文章引用的图片等资源放在 `posts` 目录下，按日期归档。例如文章文件名为 `2023-06-27-my-post.md`，则资源放在 `posts/2023/06/27/` 下，引用时使用相对路径。

## 部署

```bash
# 构建到 dist 目录
./blog.sh build

# 部署到腾讯云 COS 并刷新 CDN
./blog.sh deploy
```

如使用 GitHub Pages，将代码推送到仓库即可自动构建。

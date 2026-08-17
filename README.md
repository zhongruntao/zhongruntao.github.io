# 知行合一

基于 Jekyll 3.8.5 的个人技术博客。站点为纯静态输出，适配手机、平板和桌面浏览器，当前支持 GitHub Pages Actions 自动部署，也保留了腾讯云 COS 手动部署脚本。

## 功能特性

- 明暗主题切换，可点击页头头像，也可使用右下角主题按钮
- 客户端站内搜索，无需后端服务
- 分类归档页，按年份和分类整理文章
- 文章目录：桌面端固定在右侧，非桌面端从右下角按钮展开
- Rouge 代码高亮，提供明暗两套配色
- 文章代码块一键复制
- 生产构建自动压缩 JS / CSS，并去除产物注释
- 图片点击全屏预览
- 文章二维码，手机扫码打开当前文章
- MathJax 数学公式渲染，本地按需加载
- Mermaid 图表渲染，本地按需加载
- PWA 离线缓存
- 文章 URL 基于源文件 MD5 自动生成

## 目录结构

```text
├── .github/workflows/  # GitHub Pages 构建工作流
├── _config.yml         # 站点配置、菜单、功能开关、书签
├── _includes/          # head、header、footer 和扩展功能组件
├── _layouts/           # page / mypost 页面布局
├── _plugins/           # Jekyll 插件，当前负责 MD5 链接和资源路径改写
├── _posts/             # 文章 Markdown 源文件
├── pages/              # 关于、分类、搜索、书签等独立页面
├── posts/              # 文章资源，按 年/月/日 目录存放
├── static/             # CSS、JS、字体、图标和 XML 索引
├── 404.md              # 404 页面
├── CNAME               # 自定义域名
├── Gemfile             # Ruby 依赖
├── package.json        # 生产构建压缩依赖
├── scripts/            # 构建辅助脚本
├── blog.sh             # 本地预览、构建和 COS 部署脚本
├── index.html          # 首页
└── service-worker.js   # PWA Service Worker
```

## 本地开发

环境要求：

- Ruby 2.7+
- Bundler
- Node.js 18+（仅生产构建和部署压缩需要）

安装依赖并启动本地服务：

```bash
bundle install
npm install
./blog.sh run
```

`./blog.sh run` 用于本地预览，保留未压缩源码；`./blog.sh build` 和 `./blog.sh deploy` 会先构建 Jekyll，再通过 esbuild 压缩产物中的自定义 JS、CSS 和 `service-worker.js`。源码文件保留注释，方便维护。

默认访问 `http://localhost:8080`。指定端口运行：

```bash
./blog.sh run 4000
```

Windows 用户建议在 Git Bash、WSL 或其他 Bash 兼容环境中执行 `blog.sh`。

## 站点配置

常用信息集中在 `_config.yml`：

```yaml
title: 知行合一
description: 知行合一
keywords: runtao.zhong,Blog,Java,Html,JavaScript,Jekyll
author: runtao.zhong
footerText: '联系我（email）: <a href="mailto:runtao.zhong@email.cn">runtao.zhong@email.cn</a>'
```

`footerText` 支持 HTML，可用于 `mailto:` 链接。

### 导航菜单

```yaml
menu:
  - title: 首页
    url: /
  - title: 归类
    url: /pages/categories.html
  - title: GitHub
    url: https://github.com
    target: _blank
```

内部链接会自动拼接 `baseurl`；外部链接建议显式配置 `target`。

### 书签页

`pages/links.html` 渲染 `_config.yml` 中的 `links`：

```yaml
links:
  - title: GitHub
    url: https://github.com
```

### 关于页面

编辑 [pages/about.md](pages/about.md)。该页面正文从三级标题开始书写。

## 头像与图标

| 文件                     | 用途                     | 引用位置                                       |
|--------------------------|--------------------------|------------------------------------------------|
| `static/img/logo.jpg`    | 页头头像、Apple 触摸图标 | `_includes/header.html`、`_includes/head.html` |
| `static/img/favicon.ico` | 浏览器标签页图标         | `_includes/head.html`                          |

替换文件即可更新图标。根目录下的 `favicon.ico` 当前未被站点引用。

生成多尺寸 favicon 的 Python 示例：

```python
from PIL import Image

src = Image.open("static/img/logo.jpg").convert("RGBA")
sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
frames = [src.resize(size, Image.LANCZOS) for size in sizes]
frames[0].save("static/img/favicon.ico", format="ICO")
```

## 写文章

文章放在 `_posts`，命名格式：

```text
yyyy-MM-dd-文章名.md
```

示例：

```text
_posts/2026-08-17-my-post.md
```

Front Matter 示例：

```yaml
---
layout: mypost
title: 文章标题
categories: [ 分类1, 分类2 ]
author: jiancai.zhong
date: 2026-08-17
---
```

| 字段         | 必填 | 说明                         |
|--------------|------|------------------------------|
| `layout`     | 是   | 固定为 `mypost`              |
| `title`      | 是   | 文章标题，显示在列表和文章页 |
| `categories` | 否   | 分类数组，自动进入归类页     |
| `author`     | 否   | 默认使用 `site.author`       |
| `date`       | 否   | 默认取文件名日期             |

Markdown 语法示例可参考 [_posts/2025-01-01-md的使用.md](_posts/2025-01-01-md的使用.md)。

### 代码块

使用围栏代码块并显式声明语言，例如：

````markdown
```java
public class Demo {
}
```
````

Rouge 会按语言高亮，文章页会自动显示复制按钮。Mermaid 图使用 `mermaid` 语言标识，构建后渲染为图表，不显示复制按钮。

## 文章资源

文章引用的图片、压缩包等资源放在 `posts/年/月/日/` 目录：

| 文章文件名              | 资源目录            |
|-------------------------|---------------------|
| `2026-08-17-my-post.md` | `posts/2026/08/17/` |
| `2026-08-18-hello.md`   | `posts/2026/08/18/` |

文章中使用相对路径引用：

```markdown
![图片说明](yun.webp)
```

构建时插件会把相对资源链接改写为：

```text
/posts/年/月/日/文件名
```

因此文章页面使用 MD5 URL 时，资源仍然按原日期目录访问，不会变成 `/<md5>/yun.webp`。

当前支持改写的常见静态资源后缀包括：`webp`、`png`、`jpg`、`jpeg`、`gif`、`svg`、`bmp`、`ico`、`pdf`、`zip`、`rar`、`7z`、`txt`。

### SEO 文件

构建输出包含：

| 文件                     | 用途             |
|--------------------------|------------------|
| `static/xml/sitemap.xml` | 站点地图         |
| `static/xml/rss.xml`     | RSS 订阅         |
| `static/xml/search.xml`  | 站内搜索内容索引 |

这些文件由 Jekyll 模板生成，通常不需要手工编辑。

## 文章 MD5 链接

`_plugins/md5_permalink.rb` 会在构建时为文章生成：

```text
/<md5>/
```

规则：

- MD5 的输入是文章 Markdown 源文件内容
- 计算前会把 CRLF 统一为 LF，Windows 和 Linux 构建结果一致
- 源文件任何内容变化都会改变文章 URL，包括改标题、改错别字、改 Front Matter 或改空白字符
- 不修改源 Markdown 中的相对资源路径，因此资源改写不会反向影响文章 MD5
- 首页、RSS、sitemap 和文章二维码都会使用当前构建出的 URL

`_config.yml` 中的 `permalink: /posts/:year/:month/:day/:title` 仅作为未走插件的兜底配置；正常构建文章时会被 MD5
permalink 覆盖。

## 可选功能开关

在 `_config.yml` 中控制：

```yaml
extClickEffect: false   # 点击文字冒出特效
extMath: true           # MathJax 数学公式
extMermaid: true        # Mermaid 图表
extQrCode: true         # 文章二维码
extThemeToggle: true    # 右下角主题按钮；关闭后仍可点击头像切换
extServiceWorker: true  # PWA 离线缓存
```

文章目录和代码复制按钮当前为默认功能，未单独设置开关。

## 部署

### GitHub Pages

仓库提供 [.github/workflows/pages.yml](.github/workflows/pages.yml)，使用 Ruby 2.7、Bundler 和 Jekyll 3.8.5 构建站点。

GitHub 仓库需要设置：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

推送 `main` 分支后自动部署，也可以在：

```text
Actions -> Build and deploy Pages -> Run workflow
```

手动触发。

### 腾讯云 COS

本机需要安装并配置 `cos-upload`，且可访问 `curl`：

```bash
# 构建到 dist 目录
./blog.sh build

# 构建、上传到 COS 并刷新 CDN
./blog.sh deploy
```

这套脚本适用于 COS 手动部署，不参与 GitHub Pages 自动部署。

### 域名

- 自定义域名保留 `CNAME`
- GitHub 默认域名需删除 `CNAME`，并将仓库命名为 `<用户名>.github.io`

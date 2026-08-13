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

 ### 环境要求

 - Ruby 2.5+
 - Bundler（`gem install bundler`）

 ### 本地运行

 ```bash
 # 安装依赖
 bundle install

 # 启动本地预览（默认端口 8080）
 ./blog.sh run

 # 或指定端口
 ./blog.sh run 4000
 ```

 启动后访问 `http://localhost:8080` 即可预览网站。

 ## 修改网站信息

 所有站点配置集中在 [_config.yml](_config.yml) 文件中。

 ### 基础信息

 ```yaml
 title: 我的博客                    # 站点标题，显示在浏览器标签页和页头
 description: 我的博客              # 站点描述，用于 SEO meta 标签
 keywords: runtao.zhong,Blog,Java   # 关键词，逗号分隔，用于 SEO
 author: runtao.zhong               # 作者名称，显示在文章页和 meta 标签
 footerText: '联系我（email）: ...'  # 页脚文字，支持 HTML（如 mailto 链接）
 ```

 `footerText` 支持写入 HTML 标签，例如点击发邮件：

 ```yaml
 footerText: '联系我: <a href="mailto:you@email.com">you@email.com</a>'
 ```

 ### 导航菜单

 在 `_config.yml` 的 `menu` 字段配置，每项包含：

 ```yaml
 menu:
   - title: 首页          # 菜单显示文字（必填）
     url: /               # 链接地址（必填）
   - title: GitHub        # 外部链接示例
     url: https://github.com
     target: _blank       # 可选，新标签页打开
 ```

 ### 友情链接

 书签页（`pages/links.html`）的内容来自 `_config.yml` 的 `links` 字段：

 ```yaml
 links:
   - title: GitHub        # 链接文字
     url: https://github.com  # 链接地址
 ```

 ### 关于页面

 编辑 [pages/about.md](pages/about.md)，使用 Markdown 格式书写个人介绍、联系方式等内容。

 ## 修改头像与图标

 网站涉及三处图片，全部放在 `static/img/` 目录下，替换文件即可，建议比例 1:1：

 | 文件 | 用途 | 引用位置 |
 |------|------|----------|
 | `static/img/logo.jpg` | 页头头像（点击可切换夜间模式） | `_includes/header.html` |
 | `static/img/favicon.ico` | 浏览器标签页图标 | `_includes/head.html` |
 | `static/img/logo.jpg` | Apple 触摸图标（iOS 添加到主屏幕） | `_includes/head.html` |

 根目录下的 `favicon.ico` 不被网站直接引用，如需更新标签页图标，请替换 `static/img/favicon.ico`。

 favicon 建议使用多尺寸 ICO（16/32/48/64/128/256），可用 Pillow 从高清原图生成：

 ```python
 from PIL import Image
 src = Image.open('logo.jpg').convert('RGBA')
 sizes = [(256,256),(128,128),(64,64),(48,48),(32,32),(16,16)]
 frames = [src.resize(s, Image.LANCZOS) for s in sizes]
 frames[0].save('static/img/favicon.ico', format='ICO')
 ```

 ## SEO 配置

 SEO 相关信息在 `_config.yml` 顶部统一配置，会自动注入到所有页面的 `<head>` 中：

 ```yaml
 title: 我的博客          # <title> 标签
 description: 我的博客    # <meta name="description">
 keywords: a,b,c         # <meta name="keywords">
 author: runtao.zhong    # <meta name="author">
 ```

 文章页会自动使用文章标题作为 `description`，文章分类追加到 `keywords`，无需手动设置。

 站点还会自动生成以下 SEO 文件，位于 `static/xml/` 目录：

 | 文件 | 用途 |
 |------|------|
 | `sitemap.xml` | 站点地图，提交给搜索引擎 |
 | `rss.xml` | RSS 订阅源 |
 | `search.xml` | 站内搜索索引（自动生成，不要手动编辑） |

 ## 写文章

 ### 创建文章

 文章放在 `_posts` 目录下，文件命名格式为 `yyyy-MM-dd-标题.md`，例如：

 ```
 _posts/2023-06-27-my-first-post.md
 ```

 ### Front Matter

 每篇文章开头需要 Front Matter 声明元信息：

 ````markdown
 ---
 layout: mypost
 title: 文章标题
 categories: [分类1, 分类2]
 ---

 正文从这里开始，使用 Markdown 格式书写。
 ````

 字段说明：

 | 字段 | 必填 | 说明 |
 |------|------|------|
 | `layout` | 是 | 固定为 `mypost` |
 | `title` | 是 | 文章标题，显示在页面和列表中 |
 | `categories` | 否 | 分类列表，多个用逗号分隔，会自动归入分类页 |

 ### Markdown 语法

 参考示例文章 [_posts/2023-06-27-md的使用.md](_posts/2023-06-27-md的使用.md)，涵盖了标题、加粗、列表、代码块、表格、引用、图片等全部常用语法。

 ## 静态资源

 ### 文章图片

 文章引用的图片等资源放在 `posts` 目录下，按日期归档。规则是将文章文件名中的日期转为目录路径：

 | 文章文件名 | 资源目录 |
 |-----------|----------|
 | `2023-06-27-my-post.md` | `posts/2023/06/27/` |
 | `2022-12-03-hello.md` | `posts/2022/12/03/` |

 在文章中通过相对路径引用：

 ```markdown
 ![图片说明](yun.png)
 ```

 文章页的图片支持点击全屏预览。

 ### 全局静态资源

 站点级资源放在 `static/` 目录下：

 | 目录 | 内容 |
 |------|------|
 | `static/css/` | 样式文件 |
 | `static/js/` | JavaScript 脚本 |
 | `static/img/` | 站点头像、favicon、图标 |
 | `static/font/` | 字体文件 |
 | `static/xml/` | sitemap、rss、搜索索引 |

 ## 可选功能开关

 在 `_config.yml` 中控制开关：

 ```yaml
 extClickEffect: false   # 点击页面文字冒出特效
 extAdsense: false       # Google Adsense 广告（需在 _includes/ext-adsense.html 配置）
 extMath: true           # MathJax 数学公式渲染（影响加载速度）
 ```

 ## 域名配置

 | 方式 | 操作 |
 |------|------|
 | 自定义域名 | 创建 `CNAME` 文件写入域名，CNAME 解析到 `用户名.github.com` |
 | GitHub 域名 | 删除 `CNAME` 文件，项目命名为 `用户名.github.io` |

 ## 部署

 ```bash
 # 构建到 dist 目录
 ./blog.sh build

 # 部署到腾讯云 COS 并刷新 CDN
 ./blog.sh deploy
 ```

 如使用 GitHub Pages，将代码推送到仓库即可自动构建。

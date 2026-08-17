// 打印主题标识,请保留出处
;(function () {
  var style1 = 'background:#4BB596;color:#ffffff;border-radius: 2px;'
  var style2 = 'color:auto;'
  var author = ' runtao.zhong'
  console.info('%c Author %c' + author, style1, style2)
})()

/**
 * 工具，在 DOM 就绪后执行，脚本在页尾时会立即执行
 * @param {方法} func
 */
blog.addLoadEvent = function (func) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', func)
  } else {
    func()
  }
}

/**
 * 工具，兼容的方式添加事件
 * @param {单个DOM节点} dom
 * @param {事件名} eventName
 * @param {事件方法} func
 * @param {是否捕获} useCapture
 */
blog.addEvent = function (dom, eventName, func, useCapture) {
  dom.addEventListener(eventName, func, useCapture === true)
}

/**
 * 工具，DOM添加某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.addClass = function (dom, className) {
  dom.classList.add(className)
}

/**
 * 工具，DOM是否有某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.hasClass = function (dom, className) {
  return dom.classList.contains(className)
}

/**
 * 工具，DOM删除某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.removeClass = function (dom, className) {
  dom.classList.remove(className)
}

/**
 * 工具，兼容问题，某些OPPO手机不支持ES5的trim方法
 * @param {字符串} str
 */
blog.trim = function (str) {
  return String.prototype.trim.call(str)
}

/**
 * 工具， 转义正则关键字
 * @param {字符串} str
 */
blog.encodeRegChar = function (str) {
  return str.replace(/[\\.^$*+?{}[\]|()-]/g, '\\$&')
}

/**
 * 特效：点击页面文字冒出特效
 */
blog.initClickEffect = function (textArr) {
  function createDOM(text) {
    var dom = document.createElement('span')
    dom.innerText = text
    dom.style.left = 0
    dom.style.top = 0
    dom.style.position = 'fixed'
    dom.style.fontSize = '12px'
    dom.style.whiteSpace = 'nowrap'
    dom.style.webkitUserSelect = 'none'
    dom.style.userSelect = 'none'
    dom.style.opacity = 0
    dom.style.transform = 'translateY(0)'
    dom.style.webkitTransform = 'translateY(0)'
    return dom
  }

  blog.addEvent(window, 'click', function (ev) {
    var tagName = ev.target.tagName.toLocaleLowerCase()
    if (tagName == 'a') {
      return
    }
    var text = textArr[Math.floor(Math.random() * textArr.length)]
    var dom = createDOM(text)

    document.body.appendChild(dom)
    var w = parseInt(window.getComputedStyle(dom, null).getPropertyValue('width'))
    var h = parseInt(window.getComputedStyle(dom, null).getPropertyValue('height'))

    dom.style.left = ev.clientX - w / 2 + 'px'
    dom.style.top = ev.clientY - h + 'px'
    dom.style.opacity = 1

    setTimeout(function () {
      dom.style.transition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.webkitTransition = 'transform 500ms ease-out, opacity 500ms ease-out'
      dom.style.opacity = 0
      dom.style.transform = 'translateY(-26px)'
      dom.style.webkitTransform = 'translateY(-26px)'
    }, 20)

    setTimeout(function () {
      document.body.removeChild(dom)
      dom = null
    }, 520)
  })
}

// 新建DIV包裹TABLE
blog.addLoadEvent(function () {
  // 文章页生效
  if (document.getElementsByClassName('page-post').length == 0) {
    return
  }
  var tables = document.querySelectorAll('table')
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i]
    var elem = document.createElement('div')
    elem.setAttribute('class', 'table-container')
    table.parentNode.insertBefore(elem, table)
    elem.appendChild(table)
  }
})

// 文章代码块复制
blog.initCodeCopy = function () {
  var page = document.querySelector('.page-post')
  if (!page) {
    return
  }

  var pres = page.querySelectorAll('pre')
  for (var i = 0; i < pres.length; i++) {
    var pre = pres[i]
    var code = pre.querySelector('code')
    if (!code || (code.className || '').indexOf('language-mermaid') !== -1) {
      continue
    }

    var container = pre.parentNode
    if (
      !container.classList ||
      (!container.classList.contains('highlight') && !container.classList.contains('code-block'))
    ) {
      container = document.createElement('div')
      container.className = 'code-block'
      pre.parentNode.insertBefore(container, pre)
      container.appendChild(pre)
    }

    if (container.querySelector('.code-copy-button')) {
      continue
    }

    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.title = '复制代码'
    button.setAttribute('aria-label', '复制代码')
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>' +
      '<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>' +
      '</svg><span>复制</span>'

    blog.addEvent(button, 'click', function (event) {
      event.stopPropagation()
      var currentButton = event.currentTarget
      var currentCode = currentButton.parentNode.querySelector('code')
      copyText(currentCode.textContent.replace(/^[\r\n]+/, '').replace(/\s+$/, ''), currentButton)
    })

    container.appendChild(button)
  }

  function copyText(text, button) {
    function done(success) {
      var label = button.querySelector('span')
      button.className = success ? 'code-copy-button copied' : 'code-copy-button failed'
      label.innerText = success ? '已复制' : '复制失败'
      button.title = success ? '已复制' : '复制失败，请手动选择代码'
      button.setAttribute('aria-label', button.title)

      clearTimeout(button.resetTimer)
      button.resetTimer = setTimeout(function () {
        button.className = 'code-copy-button'
        label.innerText = '复制'
        button.title = '复制代码'
        button.setAttribute('aria-label', '复制代码')
      }, 1800)
    }

    function copyByTextarea() {
      var textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'readonly')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      var success = false
      try {
        success = document.execCommand('copy')
      } catch (e) {
        success = false
      }
      document.body.removeChild(textarea)
      done(success)
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true)
        },
        function () {
          copyByTextarea()
        }
      )
      return
    }

    copyByTextarea()
  }
}

// 回到顶部
blog.addLoadEvent(function () {
  var toTopDOM = document.getElementById('to-top')
  if (!toTopDOM) {
    return
  }

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || 0
  }

  var updating = false
  function updateToTop() {
    updating = false
    toTopDOM.classList.toggle('show', getScrollTop() > 200)
  }

  function scheduleUpdateToTop() {
    if (!updating) {
      updating = true
      window.requestAnimationFrame(updateToTop)
    }
  }

  window.addEventListener('scroll', scheduleUpdateToTop, { passive: true })
  blog.addEvent(
    toTopDOM,
    'click',
    function (event) {
      window.scrollTo(0, 0)
      event.stopPropagation()
    },
    true
  )
  blog.addEvent(
    toTopDOM,
    'keydown',
    function (event) {
      if (event.key === 'Enter' || event.key === ' ' || event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault()
        window.scrollTo(0, 0)
      }
    },
    true
  )
  updateToTop()
})

// 点击图片全屏预览
blog.addLoadEvent(function () {
  if (!document.querySelector('.page-post')) {
    return
  }
  //console.debug('init post img click event')
  let imgMoveOrigin = null
  let imgMoveOriginRect = null
  let restoreLock = false
  let imgArr = document.querySelectorAll('.page-post img')

  let css = [
    '.img-move-bg {',
    '  transition: opacity 300ms ease;',
    '  position: fixed;',
    '  left: 0;',
    '  top: 0;',
    '  right: 0;',
    '  bottom: 0;',
    '  opacity: 0;',
    '  background-color: #000000;',
    '  z-index: 100;',
    '}',
    '.img-move-item {',
    '  transition: all 300ms ease;',
    '  position: fixed;',
    '  opacity: 0;',
    '  cursor: pointer;',
    '  z-index: 101;',
    '}'
  ].join('')
  var styleDOM = document.createElement('style')
  styleDOM.appendChild(document.createTextNode(css))
  document.head.appendChild(styleDOM)

  window.addEventListener('resize', toCenter, { passive: true })

  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i].addEventListener('click', imgClickEvent)
  }

  function prevent(ev) {
    ev.preventDefault()
  }

  function toCenter() {
    if (!imgMoveOrigin) {
      return
    }
    if (!imgMoveOrigin.naturalWidth || !imgMoveOrigin.naturalHeight) {
      return
    }

    let width = Math.min(imgMoveOrigin.naturalWidth, document.documentElement.clientWidth * 0.9)
    let height = (width * imgMoveOrigin.naturalHeight) / imgMoveOrigin.naturalWidth
    if (window.innerHeight * 0.95 < height) {
      height = Math.min(imgMoveOrigin.naturalHeight, window.innerHeight * 0.95)
      width = (height * imgMoveOrigin.naturalWidth) / imgMoveOrigin.naturalHeight
    }

    let img = document.querySelector('.img-move-item')
    img.style.left = (document.documentElement.clientWidth - width) / 2 + 'px'
    img.style.top = (window.innerHeight - height) / 2 + 'px'
    img.style.width = width + 'px'
    img.style.height = height + 'px'
  }

  function restore() {
    if (restoreLock == true) {
      return
    }
    restoreLock = true
    let div = document.querySelector('.img-move-bg')
    let img = document.querySelector('.img-move-item')
    if (!div || !img) {
      restoreLock = false
      imgMoveOrigin = null
      return
    }

    div.style.opacity = 0
    img.style.opacity = 0
    img.style.left = imgMoveOriginRect.left + 'px'
    img.style.top = imgMoveOriginRect.top + 'px'
    img.style.width = imgMoveOriginRect.width + 'px'
    img.style.height = imgMoveOriginRect.height + 'px'

    setTimeout(function () {
      restoreLock = false
      document.body.removeChild(div)
      document.body.removeChild(img)
      imgMoveOrigin = null
    }, 300)
  }

  function imgClickEvent(event) {
    event.preventDefault()
    let source = event.currentTarget
    if (imgMoveOrigin || !source.complete || !source.naturalWidth) {
      return
    }

    imgMoveOrigin = source
    let originRect = source.getBoundingClientRect()
    imgMoveOriginRect = originRect

    let div = document.createElement('div')
    div.className = 'img-move-bg'

    let img = document.createElement('img')
    img.className = 'img-move-item'
    img.src = imgMoveOrigin.currentSrc || imgMoveOrigin.src
    img.style.left = originRect.left + 'px'
    img.style.top = originRect.top + 'px'
    img.style.width = originRect.width + 'px'
    img.style.height = originRect.height + 'px'

    div.addEventListener('click', restore)
    div.addEventListener('wheel', restore, { passive: true })
    div.addEventListener('touchmove', prevent, { passive: false })

    img.addEventListener('click', restore)
    img.addEventListener('wheel', restore, { passive: true })
    img.addEventListener('touchmove', prevent, { passive: false })
    img.addEventListener('dragstart', prevent)

    document.body.appendChild(div)
    document.body.appendChild(img)

    setTimeout(function () {
      div.style.opacity = 0.5
      img.style.opacity = 1
      toCenter()
    }, 0)
  }
})

// 切换夜间模式
blog.addLoadEvent(function () {
  var $logo = document.querySelector('.header .logo')
  var $themeToggle = document.getElementById('theme-toggle')

  function toggleTheme() {
    blog.setDarkTheme(!blog.darkTheme)
    blog.setStoredTheme(blog.darkTheme)
  }

  if (!$logo) {
    return
  }

  blog.addEvent($logo, 'click', toggleTheme)
  if ($themeToggle) {
    blog.addEvent($themeToggle, 'click', function (event) {
      toggleTheme()
      event.stopPropagation()
    })
  }
})

// 标题定位
blog.addLoadEvent(function () {
  if (!document.querySelector('.page-post')) {
    return
  }
  const list = document.querySelectorAll('.post h1, .post h2, .post h3, .post h4, .post h5')
  for (var i = 0; i < list.length; i++) {
    blog.addEvent(list[i], 'click', function (event) {
      const el = event.currentTarget
      if (el.scrollIntoView) {
        el.scrollIntoView({ block: 'start' })
      }
      if (el.id && history.replaceState) {
        history.replaceState({}, '', '#' + el.id)
      }
    })
  }
})

// 文章目录：桌面端固定右侧，非桌面端从右下角展开
blog.initPostToc = function () {
  var page = document.querySelector('.page-post')
  var actions = document.getElementById('footer-actions')
  if (!page) {
    return
  }

  var headings = Array.prototype.slice.call(
    page.querySelectorAll('.post h3, .post h4, .post h5')
  )
  if (headings.length < 2) {
    return
  }

  var tocToggle = document.createElement('button')
  tocToggle.id = 'toc-toggle'
  tocToggle.type = 'button'
  tocToggle.setAttribute('aria-label', '展开文章目录')
  tocToggle.title = '文章目录'
  tocToggle.setAttribute('aria-controls', 'post-toc-panel')
  tocToggle.setAttribute('aria-expanded', 'false')
  tocToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>'

  var aside = document.createElement('aside')
  aside.className = 'post-toc'
  aside.id = 'post-toc-panel'
  aside.setAttribute('aria-label', '文章目录')

  var list = document.createElement('ul')
  list.className = 'post-toc-list'
  var links = []

  headings.forEach(function (heading, index) {
    if (!heading.id) {
      heading.id = 'toc-heading-' + (index + 1)
    }

    var item = document.createElement('li')
    item.className = 'toc-level-' + heading.tagName.toLowerCase()

    var link = document.createElement('a')
    link.href = '#' + encodeURIComponent(heading.id)
    link.textContent = heading.textContent
    link.title = heading.textContent
    link.onclick = function (event) {
      event.preventDefault()
      setActive(link)
      closeToc()
      window.scrollTo(0, window.scrollY + heading.getBoundingClientRect().top - 16)
      if (history.replaceState) {
        history.replaceState({}, '', '#' + encodeURIComponent(heading.id))
      }
    }

    links.push(link)
    item.appendChild(link)
    list.appendChild(item)
  })

  aside.appendChild(list)
  tocToggle.onclick = function (event) {
    event.stopPropagation()
    var opened = !aside.classList.contains('open')
    aside.classList.toggle('open', opened)
    tocToggle.setAttribute('aria-expanded', opened ? 'true' : 'false')
  }

  function closeToc() {
    blog.removeClass(aside, 'open')
    tocToggle.setAttribute('aria-expanded', 'false')
  }

  document.body.appendChild(aside)
  if (actions) {
    actions.appendChild(tocToggle)
    blog.addClass(actions, 'has-mobile-toc')
  }

  blog.addEvent(document, 'keydown', function (event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      closeToc()
    }
  })

  var ticking = false

  function setActive(link) {
    links.forEach(function (item) {
      blog.removeClass(item, 'active')
    })
    blog.addClass(link, 'active')
  }

  function updateActiveHeading() {
    ticking = false

    var scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4

    if (scrolledToBottom) {
      setActive(links[links.length - 1])
      return
    }

    var activeLink = null
    links.forEach(function (link, index) {
      if (headings[index].getBoundingClientRect().top <= 120) {
        activeLink = link
      }
    })

    if (activeLink) {
      setActive(activeLink)
    } else {
      links.forEach(function (item) {
        blog.removeClass(item, 'active')
      })
    }
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(updateActiveHeading)
    }
  }, { passive: true })

  updateActiveHeading()
}

blog.addLoadEvent(blog.initPostToc)
blog.addLoadEvent(blog.initCodeCopy)

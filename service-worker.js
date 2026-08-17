---
layout: null
---
const version = '{{ site.time | date: "%Y%m%d%H%M%S" }}'
const baseUrl = '{{ site.baseurl }}'
const cachePrefix = 'blog_'
const cacheKey = cachePrefix + version

self.addEventListener('install', function (event) {
  event.waitUntil(
    fetch(baseUrl + '/index.html')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status)
        }
        return response.text()
      })
      .then(function (html) {
        return caches.open(cacheKey).then(function (cache) {
          var urls = collectCacheUrls(html)
          return Promise.allSettled(
            urls.map(function (url) {
              return cache.add(url)
            })
          )
        })
      })
      .then(function () {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key.startsWith(cachePrefix) && key !== cacheKey
            })
            .map(function (key) {
              return caches.delete(key)
            })
        )
      })
      .then(function () {
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', function (event) {
  var request = event.request

  if (request.method !== 'GET') {
    return
  }

  try {
    if (new URL(request.url).origin !== self.origin) {
      return
    }
  } catch (error) {
    return
  }

  event.respondWith(
    caches.open(cacheKey).then(function (cache) {
      var requestCacheUrl = new URL(request.url).pathname
      return cache.match(requestCacheUrl).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request)
          .then(function (response) {
            if (response && response.ok) {
              cache.put(requestCacheUrl, response.clone())
            }
            return response
          })
          .catch(function () {
            if (request.mode !== 'navigate') {
              return Response.error()
            }

            return cache.match(baseUrl + '/index.html').then(function (homeResponse) {
              return homeResponse || Response.error()
            })
          })
      })
    })
  )
})

function collectCacheUrls(html) {
  var pattern = /(href|src)=(?:"([^"]+)"|'([^']+)')/g
  var urls = new Set([baseUrl + '/index.html'])
  var match

  while ((match = pattern.exec(html)) !== null) {
    var value = match[2] || match[3]
    if (!value) {
      continue
    }

    try {
      var url = new URL(value, self.registration.scope)
      if (url.origin !== self.origin) {
        continue
      }
      url.hash = ''
      url.search = ''
      urls.add(url.pathname)
    } catch (error) {
      // 无效资源地址不阻塞 Service Worker 安装
    }
  }

  return Array.from(urls)
}

layout: mypost
title: 静态资源规划-缓存
categories: [ SpringBoot, StaticResource ]
date: 2026-08-13
---

#### 开启静态资源映射规则

```java
//默认true
spring.web.resources.add-mappings=true
```

#### 设置缓存

**例如**
```java
//设置缓存时间，单位为秒
spring.web.resources.cache.cachecontrol.max-age=3600
```

#### 判断服务器和1浏览器资源是否变化

```java
//默认true,如果last-modified时间的资源相同,返回304
spring.web.resources.cache.use-last-modified=true
```
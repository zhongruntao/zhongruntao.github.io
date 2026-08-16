---
layout: mypost
title: 接口-java基础语法
categories: [ java ]
---

### Java 接口核心规则速查

#### 1. 接口定义语法

```java
// 用 interface 关键字声明，不是 class
public interface 接口名 {
    // 全局常量：默认自带 public static final，必须声明时赋值
    数据类型 常量名 = 值;

    // 抽象方法：默认自带 public abstract，无方法体
    返回值类型 方法名(参数列表);

    // Java 8+ 新增：默认方法，带具体实现，用 default 修饰
    default 返回值类型 方法名(参数列表) {
        // 方法体
    }

    // Java 8+ 新增：静态方法，带具体实现，用 static 修饰
    static 返回值类型 静态方法名(参数列表) {
        // 方法体
    }
}
```

#### 2. 类实现接口规则

```java
// 用 implements 关键字，而非 extends 继承，支持多实现
public class 类名 implements 接口1, 接口2 {
    // 必须重写接口所有抽象方法，强制使用 public 权限
    @Override
    public 返回值类型 方法名(参数列表) {
// 完整业务实现
    }
}
```

##### 3. 核心特性

- 接口不能直接实例化对象
- 一个类可以同时实现多个接口，突破单继承限制
- 接口之间支持多继承：public interface 子接口 extends 父接口1, 父接口2 {} 仅定义能力契约，不包含子类通用复用的成员变量和普通实例方法






<div align=center>
<img src="https://img.shields.io/badge/envoy-1.34.0--dev-blue"/>
<img src="https://img.shields.io/badge/rabbitmq-3.8.9-blue"/>
<img src="https://img.shields.io/badge/meilisearch-1.13.0-blue"/>
<img src="https://img.shields.io/badge/docker-28.0.1-blue"/>
<img src="https://img.shields.io/badge/golang-1.22.5windows%2Famd64-blue"/>
</div>



# 一个用Next.js开发的仿B站项目前端

> **前言**：React的。     ---- 2025/4/28 Yux


## 项目：随便取了platform_frontend

- 使用 Next.js 框架 仿b站开发前端，实现了一个视频网站所具备的主要功能。
- 采用前后端分离模式开发，与后端主要通过json/application方式交互。

### src内结构
- **app 页面文件**
- **assets 资产文件**
- **client-components 客户端组件，除了需要在文件内首行加上 'use client' 外与普通React没有任何区别**
- **server-components 服务端组件，服务端组件只能定义结构，不能有客户端组件Hook，例如useEffect、useState等**
- **tool 有一些前后端交互函数定义于此**

### **声明：本项目只用作学习参考，无任何商业用途，若他人使用本项目造成的侵权问题，本人概不负责**

## 项目功能

- **首页视频随机推荐**
- **用户注册登录**
- **个人中心信息修改**
- **视频投稿**
- **视频审核**
- **内容搜索（视频）**
- **视频详情页（观看 + 点赞 + 收藏 + 评论）**
- **个人空间（用户作品 + 收藏夹等）**

其他由于时间问题，暂停开发的功能：

- 视频分区功能
- 动态服务
- 消息服务
- 收藏夹分类功能
- 视频合集功能
- 数据统计服务
- 弹幕服务

## 启动

- 请先下载yarn
- 再通过yarn install下载依赖
- yarn dev 即可启动
- 管理页面入口为localhost:3000/admin/reviewer (:3000为默认端口)

### 前端

1. 原本是需要通过saga库进行管理的，由于时间原因，直接用useContext与Cookie代替了
2. 未作响应式设计，本人毫无前端天赋，css不是很会用，虽然是React开发，事实上是因为我不会Vue才用的
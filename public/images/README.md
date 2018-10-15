
<p align="center">
<a href="https://jq.qq.com/?_wv=1027&k=5qVzRh4" title="Notadd 官方技术交流群"><img src="https://img.shields.io/badge/QQ%20Group-321735506-6782d6.svg?style=flat-square"></a>
<a href="https://travis-ci.org/notadd/neditor" title="Build Status"><img src="https://img.shields.io/travis/notadd/neditor/master.svg?style=flat-square"></a>
</p>

## 新版发布

2.1 发布，此次版本移除了后端相关代码，纯 ajax 提交，请配置 `neditor.config.js` ，支持各种后端或者云存储。

### 关于 HTTPS

使用了 [又拍云CDN](https://console.upyun.com/register/?invite=r17EYO3BW) 服务，支持跨域 和 https。

如果有需要，也可将下面域名改成自己的。
```
imgbaidu.b0.upaiyun.com
tingapi.b0.upaiyun.com
```
Neditor 是我们团队基于 Ueditor 的一款富文本编辑器。
不论从功能还是从其它各方面来讲， Ueditor 都是一款无以替代的编辑器产品。
只是已经不符合现代化样式的需求，于是我们修改它的样式，实现了这样的效果：

![image](https://www.notadd.com/src/neditor.webp)

## 第一步：下载编辑器

**方式一：完整安装包 （推荐）**

* [Neditor.tar.xz](https://www.notadd.com/download/neditor/Neditor-next-master.tar.xz)

**方式二： npm安装**

`npm i @notadd/neditor -S`

**方式三：编译安装**

```shell
git clone https://github.com/notadd/neditor.git
npm install
npm run build
```

### 第二步：在浏览器打开 index.html ###

进入到目录 `dist` , 使用浏览器打开文件 `index.html` 。

如果看到了下面这样的编辑器，恭喜你，初次部署成功！

![部署成功](https://www.notadd.com/src/neditor-demo.webp)

## 相关版本

[Angular 版 Neditor](https://github.com/notadd/ngx-neditor)

其他版本待添加

### 自定义的参数

编辑器有很多可自定义的参数项，在实例化的时候可以传入给编辑器：

```javascript
var ue = UE.getEditor('container', {
    autoHeight: false
});
```

配置项也可以通过 `neditor.config.js` 文件修改，具体的配置方法请看 [前端配置项说明](http://fex.baidu.com/ueditor/#start-config1.4 前端配置项说明.md)、[后端配置项说明](http://fex.baidu.com/ueditor/#server-config)

### 编辑器图片、视频、涂鸦、附件上传service

编辑器上传逻辑单独在 `neditor.service.js` 文件配置，具体的配置方法见注释

### 设置和读取编辑器的内容

通 getContent 和 setContent 方法可以设置和读取编辑器的内容

```javascript
var ue = UE.getContent();
ue.ready(function(){
    //设置编辑器的内容
    ue.setContent('hello');
    //获取html内容，返回: <p>hello</p>
    var html = ue.getContent();
    //获取纯文本内容，返回: hello
    var txt = ue.getContentTxt();
});
```

Ueditor 的更多API请看[API 文档](http://ueditor.baidu.com/doc "ueditor API 文档")

##  下载地址

Neditor 码云： [http://gitee.com/notadd/neditor](http://gitee.com/notadd/neditor "Neditor github 地址")

Neditor github 地址：[http://github.com/notadd/neditor](http://github.com/notadd/neditor "Neditor github 地址")

## 相关链接

Ueditor 官网：[http://ueditor.baidu.com](http://ueditor.baidu.com "ueditor 官网")

Ueditor API 文档：[http://ueditor.baidu.com/doc](http://ueditor.baidu.com/doc "ueditor API 文档")



## 详细文档

Ueditor 文档：[http://fex.baidu.com/ueditor/](http://fex.baidu.com/ueditor/)

注: 对IE8以下版本不再承诺兼容

## 联系我们 ##

QQ 群： 321735506

[issue](http://github.com/notadd/neditor/issues)

## 捐赠


欢迎通过 [捐赠](https://git.oschina.net/notadd/neditor?donate=true) 支持此项目的发展。

## Todo

### 2.x

- [x] 将上传封装为 service ，支持非 GraphQL 接口。
- [ ] 细节样式修改(美化)
- [ ] word 内图片自动上传
- [ ] 粘贴图片转为本地图片

### 3.0

- [ ] 使用 Typescript 重构
- [ ] 草稿箱功能与离线保存
- [ ] service worker 特性
- [ ] 实现 2.0 的大部分功能

## 其他项目：Notadd

https://github.com/notadd/notadd

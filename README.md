# multipage-vue

## 项目目录

```js
* public
	- index.html
	- test.html
* src
	* assets         // 公共资源
	* components     // 公共组件
	* pages
		* index      // index页面
			* views  // index页面下的私有组件
			- app.vue
			- main.js
			- router.js
			- store.js
		* test       // test页面
- vue.config.js      // 打包配置	
```

## `vue.config.js`配置

```javascript
module.exports = {
  pages: {
    index: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: "src/pages/index/main.js",
      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: "public/index.html",
      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: "index.html",
      // 标题，可选项，一般情况不使用，通常是在路由切换时设置title
      // 需要注意的是使用title属性template 中的 title 标签需要是
      // <title><%= htmlWebpackPlugin.options.title %></title>
      title: "index page",
      // 包含的模块，可选项
      //chunks: ["index"]
    },
    // 只有entry属性时，直接用字符串表示模块入口
    test: "src/pages/test/main.js"
  },
  // map文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
  productionSourceMap: false // 关闭打包生成.map文件
};
```

## 多页面应用

具体根据项目分析

- 对于官网、电商类这种对SEO和首屏加载速度要求比较高的项目，可以采用多页面应用结构。或者优秀“服务器端渲染方案”；
- 如果是后台管理系统页面，不对外开放的系统，采用单页面应用，这样可以利用第三方框架（Vue、React等）对系统进行组件化，如果系统过大，导致首屏加载缓慢，可以将系统拆分成单页面形式的多页面应用；一般来说登录页面作为后台管理系统的首屏页面。

暂时使用到的多页需求是产品的迭代，新老版本共存。所以在项目里开辟另一页面开发新版，共用相关组件
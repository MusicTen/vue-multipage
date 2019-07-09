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



## .prettierrc文件常见配置

```javascript
{
    "tabWidth": 2, // tab缩进大小,默认为2
    "useTabs": false, // 使用tab缩进，默认false
    "semi": false, // 使用分号, 默认true
    "singleQuote": true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
    "printWidth": 120, // 一行的字符数，如果超过会进行换行，默认为80
        
    // 行尾逗号,默认none,可选 none|es5|all
    // es5 包括es5中的数组、对象
    // all 包括函数对象等所有可选
    "TrailingCooma": "all",
        
    // 对象中的空格 默认true
    // true: { foo: bar }
    // false: {foo: bar}
    "bracketSpacing": true,
        
    // JSX标签闭合位置 默认false
    // false: <div
    //          className=""
    //          style={{}}
    //       >
    // true: <div
    //          className=""
    //          style={{}} >
    "jsxBracketSameLine": false,
        
    // 箭头函数参数括号 默认avoid 可选 avoid| always
    // avoid 能省略括号的时候就省略 例如x => x
    // always 总是有括号
    "arrowParens": "avoid"
}
```

> Prettier 是一个支持多种文件格式（包括javascript、css、less、sass、typescript、markdown等）的样式格式化工具。让前端更加专注业务。

### prettierrc 配置文件支持三种格式 

- JSON： 

  ```json
  {
      "printWidth": 100,
      "parser": "flow"
  }
  ```

- JS： 

  ```javascript
  module.exports = {
      printWidth: 100,
      parser: "flow"
  }
  ```

- YAML： 

  ```yaml
  {
      "printWidth": 100,
      "parser": "flow"
  }
  ```

### 与 ESLint 的差异

这是最常见的问题之一，简明的回答是 ESLint 只是一个代码质量工具 (确保没有未使用的变量、没有全局变量，等等)。而 Prettier 只关心格式化文件 (最大长度、混合标签和空格、引用样式等)。你可以将 ESLint 和 Prettier 结合起来使用，以获得双赢的组合。
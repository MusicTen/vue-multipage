module.exports = {
  pages: {
    index: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: 'src/pages/index/main.js',

      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/index.html',

      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'index.html',

      // 标题，可选项，一般情况不使用，通常是在路由切换时设置title
      // 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'index page'

      // 包含的模块，可选项
      // chunks: ["index"]
    },
    // 只有entry属性时，直接用字符串表示模块入口
    test: 'src/pages/test/main.js'
  },
  // map文件的作用：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
  // 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
  productionSourceMap: false
}
